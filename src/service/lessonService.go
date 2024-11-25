package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
	"peerTeach/util"
	"strconv"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var rdb = util.GetRedisCli()
var ctx = context.Background()

var upGrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func WebSocketWrite(conn *websocket.Conn, res interface{}) {
	w, err := conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return
	}
	Msg, err := json.Marshal(res)
	if err != nil {
		return
	}
	_, err = w.Write(Msg)
}

func GetDiscussion(l *domain.Lesson, u *domain.User) (r *constant.LessonDiscussionRes, err error) {
	lessonDis := fmt.Sprintf("lesson_%d_discussion", l.ID)
	comments, err := rdb.LRange(ctx, lessonDis, 0, -1).Result()
	if err != nil {
		fmt.Println(err)
	}
	r = &constant.LessonDiscussionRes{
		IsResponse: true,
		Comments:   make([]*constant.LessonComment, len(comments)),
	}
	for k, v := range comments {
		r.Comments[k].Content = v
		comment := fmt.Sprintf("lesson_%d_discussion_%d", l.ID, k)
		num, err := rdb.SCard(ctx, comment).Result()
		r.Comments[k].Likes = uint(num)
		if err != nil {
			return nil, err
		}
		r.Comments[k].IsLike, err = rdb.SIsMember(ctx, comment, u.ID).Result()
		if err != nil {
			return nil, err
		}
	}
	return
}

func TeacherRunRead(t *constant.Teacher) {
	defer func() {
		_ = t.Conn.Close()
		persistence.Lessons.Delete(t.Lesson.Lesson.ID)
		t.OverLesson <- struct{}{}
	}()
	t.Conn.SetReadLimit(maxMessageSize)
	_ = t.Conn.SetReadDeadline(time.Now().Add(pongWait))
	t.Conn.SetPongHandler(func(string) error { return t.Conn.SetReadDeadline(time.Now().Add(pongWait)) })
	for {
		_, message, err := t.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		lts := &constant.LessonTeacherRequest{}
		err = json.Unmarshal(message, lts)
		if err != nil {
			fmt.Println("err")
		}
		if lts.InsertQuestion.IsRequest {
			que := &domain.Question{
				Name:     &lts.InsertQuestion.Title,
				Subject:  &lts.InsertQuestion.Subject,
				Section:  &lts.InsertQuestion.Section,
				Course:   &lts.InsertQuestion.Course,
				IsPublic: lts.InsertQuestion.IsPublic,
				Options:  lts.InsertQuestion.Options,
				UserID:   t.User.ID,
			}
			err = persistence.InsertQuestion(que)
			if err != nil {
				return
			}
			err = persistence.InsertQuestionToPaper(que, &domain.Exam{
				ID: lts.InsertQuestion.PaperID,
			})
			if err != nil {
				return
			}
			lq := fmt.Sprintf("lesson_%d_question_%d", t.Lesson.Lesson.ID, que.ID)
			rdb.HSet(ctx, lq, "content", que.Name)
			for k, w := range que.Options.Ops {
				rdb.HSet(ctx, lq, fmt.Sprintf("option_%d", k), w.Text)
				rdb.HSet(ctx, lq, fmt.Sprintf("option_%d_count", k), 0)
			}
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				InsertQuestion: struct {
					IsResponse bool `json:"is_response"`
					QuestionID uint `json:"question_id"`
				}{IsResponse: true, QuestionID: que.ID},
			})
		} else if lts.ShowPPT.IsRequest {
			t.Lesson.NewPPT <- lts.ShowPPT.ShowID
		} else if lts.ShowQuestion.IsRequest {
			t.Lesson.NewQuestion <- &constant.QuestionShow{
				QuestionID: lts.ShowQuestion.ShowID,
				Time:       lts.ShowQuestion.Time,
			}
		} else if lts.OverLesson.IsRequest {
			break
		}
	}
}

func TeacherRunWrite(t *constant.Teacher) {
	defer func() {
		_ = t.Conn.Close()
	}()
	for {
		select {
		case <-t.NewMsg:
			data, err := GetDiscussion(t.Lesson.Lesson, t.User)
			if err != nil {
				fmt.Println(err)
			}
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				DiscussionRes: *data,
			})
		case queId := <-t.Lesson.NewAnswer:
			que := fmt.Sprintf("lesson_%d_question_%d", t.Lesson.Lesson.ID, queId)
			opNum, err := rdb.HGet(ctx, que, "optionNum").Result()
			if err != nil {
				fmt.Println(err)
			}
			n, _ := strconv.Atoi(opNum)
			optNum := make([]uint, n)
			for i := 0; i < n; i++ {
				num, _ := rdb.HGet(ctx, que, fmt.Sprintf("option_%d_count", i)).Result()
				snum, _ := strconv.Atoi(num)
				optNum[i] = uint(snum)
			}
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				QuestionResponse: constant.LessonQuestionResponse{
					IsResponse: true,
					QuestionRes: constant.LessonQuestionRes{
						QuestionID: queId,
						OptionNum:  optNum,
					},
				},
			})
		}
	}
}

func StudentRunRead(s *constant.Student) {
	defer func() {
		_ = s.Conn.Close()
		s.Lesson.UnRegister <- s
	}()
	s.Lesson.Register <- s
	s.Conn.SetReadLimit(maxMessageSize)
	_ = s.Conn.SetReadDeadline(time.Now().Add(pongWait))
	s.Conn.SetPongHandler(func(string) error { return s.Conn.SetReadDeadline(time.Now().Add(pongWait)) })
	for {
		_, message, err := s.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		lts := &constant.LessonStudentRequest{}
		err = json.Unmarshal(message, lts)
		if err != nil {
			fmt.Println("err")
		}
		if lts.MakeLike.IsRequest {
			cls := fmt.Sprintf("lesson_%d_comment_%d", s.Lesson.Lesson.ID, lts.MakeLike.CommentID)
			rdb.SAdd(ctx, cls, s.Student.ID)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.MakeDiscuss.IsRequest {
			discussion := fmt.Sprintf("lesson_%d_discussion", s.Lesson.Lesson.ID)
			rdb.LPush(ctx, discussion, lts.MakeDiscuss.Content)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.AnswerQuestion.IsRequest {
			que := fmt.Sprintf("lesson_%d_question_%d", s.Lesson.Lesson.ID, lts.AnswerQuestion.QuestionID)
			for _, v := range lts.AnswerQuestion.Option {
				option := fmt.Sprintf("option_%d_count", v)
				rdb.HIncrBy(ctx, que, option, 1)
			}
			s.Lesson.NewAnswer <- lts.AnswerQuestion.QuestionID
		}
	}
}

func StudentRunWrite(s *constant.Student) {
	defer func() {
		_ = s.Conn.Close()
	}()
	for {
		select {
		case <-s.NewMsg:
			data, err := GetDiscussion(s.Lesson.Lesson, s.Student)
			if err != nil {
				fmt.Println(err)
			}
			WebSocketWrite(s.Conn, constant.LessonStudentResponse{
				DiscussionRes: *data,
			})
		case que := <-s.NewQuestion:
			WebSocketWrite(s.Conn, constant.LessonStudentResponse{
				QuestionRes: constant.LessonQuestion{
					IsResponse: true,
					QuestionID: que.QuestionID,
					Time:       que.Time,
				},
			})
		case ppt := <-s.NewPPT:
			WebSocketWrite(s.Conn, constant.LessonStudentResponse{
				PPTRes: constant.LessonPPT{
					IsResponse: true,
					PPtID:      ppt,
				},
			})
		}
	}
}

func BeginLesson(c *gin.Context, r *constant.LessonReq) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	lesson := &domain.Lesson{
		Name:    &r.Name,
		ExamID:  r.ExamID,
		ClassID: r.ClassID,
	}
	err = persistence.InsertLesson(lesson)
	if err != nil {
		return
	}
	paper, err := persistence.GetPaperDetail(&domain.Exam{
		ID: r.ExamID,
	})
	if paper == nil {
		return
	}
	ques := paper.Questions
	for _, v := range ques {
		que := fmt.Sprintf("lesson_%d_question_%d", lesson.ID, v.QuestionID)
		rdb.HSet(ctx, que, "content", v.Title)
		rdb.HSet(ctx, que, "optionNum", len(v.Options.Ops))
		for k, w := range v.Options.Ops {
			rdb.HSet(ctx, que, fmt.Sprintf("option_%d", k), w.Text)
			rdb.HSet(ctx, que, fmt.Sprintf("option_%d_count", k), 0)
		}
	}
	discussion := fmt.Sprintf("lesson_%d_discussion", lesson.ID)
	rdb.LPush(ctx, discussion, "课堂开始啦，同学们畅所欲言吧！")
	cls := fmt.Sprintf("lesson_%d_comment_%d", lesson.ID, 0)
	rdb.SAdd(ctx, cls, 0)
	conn, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("err")
		return
	}
	teacher := &constant.Teacher{
		Conn:       conn,
		User:       user.(*domain.User),
		NewMsg:     make(chan struct{}),
		OverLesson: make(chan struct{}),
	}
	teacher.Lesson = teacher.NewLesson(lesson)
	teacher.Lesson.Teacher = teacher
	persistence.Lessons.Store(lesson.ID, teacher.Lesson)
	go teacher.Lesson.Run()
	go TeacherRunRead(teacher)
	go TeacherRunWrite(teacher)
	return
}

func EnterIntoLesson(c *gin.Context, r *constant.LessonReq) (err error) {
	lesson, ok := persistence.Lessons.Load(r.LessonID)
	if !ok {
		return errors.New("lesson is not exist")
	}
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	conn, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("err")
		return
	}
	student := &constant.Student{
		Conn:        conn,
		Student:     user.(*domain.User),
		NewMsg:      make(chan struct{}),
		NewQuestion: make(chan *constant.QuestionShow),
		NewPPT:      make(chan uint),
	}
	student.Lesson = lesson.(*constant.Lesson)
	go StudentRunRead(student)
	go StudentRunWrite(student)
	return
}

func StudentLesson(c *gin.Context) {}

func TeacherLesson(c *gin.Context) {}
