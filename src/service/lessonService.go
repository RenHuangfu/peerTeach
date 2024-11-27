package service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"os"
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

func ReadyLesson(t *constant.Teacher, lts *constant.LessonTeacherRequest) (err error) {
	lesson := &domain.Lesson{
		Name:    &lts.ReadyLesson.Name,
		ExamID:  lts.ReadyLesson.ExamID,
		ClassID: lts.ReadyLesson.ClassID,
	}
	err = persistence.InsertLesson(lesson)
	if err != nil {
		return
	}
	if _, ok := persistence.Lessons.Load(lesson.ID); ok {
		return
	}
	paper, _ := persistence.GetPaperDetail(&domain.Exam{
		ID: lts.ReadyLesson.ExamID,
	})
	if paper == nil {
		return
	}
	ques := paper.Questions
	for _, v := range ques {
		que := fmt.Sprintf("lesson_%d_question_%d", lesson.ID, v.QuestionID)
		rdb.HSet(ctx, que, "content", v.Title)
		rdb.HSet(ctx, que, "correct", 0)
		rdb.HSet(ctx, que, "optionNum", len(v.Options.Ops))
		for k, w := range v.Options.Ops {
			rdb.HSet(ctx, que, fmt.Sprintf("option_%d", k), w.Text)
			rdb.HSet(ctx, que, fmt.Sprintf("option_%d_count", k), 0)
		}
	}
	t.Lesson = t.NewLesson(lesson)
	t.Lesson.Teacher = t
	persistence.Lessons.Store(lesson.ID, t.Lesson)
	go t.Lesson.Run()
	WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
		ReadyLesson: struct {
			IsResponse bool `json:"is_response"`
			LessonID   uint `json:"lesson_id"`
		}{IsResponse: true, LessonID: lesson.ID},
	})
	RecPPT(t.Conn)
	return
}

func RecPPT(conn *websocket.Conn) {
	_, pptData, err := conn.ReadMessage()
	if err != nil {
		fmt.Println("pptData error")
	}
	// 保存PPT文件到临时文件
	tmpFile, err := os.CreateTemp("../temp/", "uploaded-*.pptx")
	if err != nil {
		log.Println("Failed to create temp file:", err)
		return
	}
	defer os.Remove(tmpFile.Name())

	err = os.WriteFile(tmpFile.Name(), pptData, 0644)
	if err != nil {
		log.Println("Failed to write PPT to temp file:", err)
		return
	}

	// 转换PPT为JPG
	err = util.ConvertPPTtoJPG(tmpFile.Name())
	if err != nil {
		log.Println("Failed to convert PPT to JPG:", err)
		return
	}
}

func LessonOver(lessonId uint) {
	persistence.Lessons.Delete(lessonId)
	que := fmt.Sprintf("lesson_%d_question_*", lessonId)
	keys, _ := rdb.Keys(ctx, que).Result()
	for _, v := range keys {
		correct, _ := rdb.HGet(ctx, v, "correct").Result()
		correctNum, _ := strconv.Atoi(correct)
		strNum, _ := rdb.HGet(ctx, v, "optionNum").Result()
		num, _ := strconv.Atoi(strNum)
		opt := make([]string, num)
		for i := 0; i < num; i++ {
			opt[i], _ = rdb.HGet(ctx, v, fmt.Sprintf("option_%d_count", i)).Result()
		}
		_ = persistence.InsertAnswerRecord(&domain.AnswerRecord{
			CorrectNum: uint(correctNum),
			OptionNum:  opt,
			LessonID:   lessonId,
		})
		rdb.Del(ctx, v)
	}
	rdb.Del(ctx, fmt.Sprintf("lesson_%d_discussion", lessonId))
}

func TeacherRunRead(t *constant.Teacher) {
	defer func() {
		_ = t.Conn.Close()
		LessonOver(t.Lesson.Lesson.ID)
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
		if lts.ReadyLesson.IsRequest {
			err = ReadyLesson(t, lts)
			if err != nil {
				return
			}
		} else if lts.InsertQuestion.IsRequest {
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
			rdb.HSet(ctx, lq, "correct", 0)
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
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
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
				strNum, _ := rdb.HGet(ctx, que, fmt.Sprintf("option_%d_count", i)).Result()
				num, _ := strconv.Atoi(strNum)
				optNum[i] = uint(num)
			}
			correctNum, _ := rdb.HGet(ctx, que, "correct").Result()
			crt, _ := strconv.Atoi(correctNum)
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				QuestionResponse: constant.LessonQuestionResponse{
					IsResponse: true,
					QuestionRes: constant.LessonQuestionRes{
						QuestionID: queId,
						OptionNum:  optNum,
					},
					CorrectNum: uint(crt),
				},
			})
		case <-ticker.C:
			_ = t.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := t.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
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
		if lts.ReadyLesson.IsRequest {
			lesson, ok := persistence.Lessons.Load(lts.ReadyLesson.LessonID)
			if !ok {
				return
			}
			s.Lesson = lesson.(*constant.Lesson)
		} else if lts.MakeLike.IsRequest {
			cls := fmt.Sprintf("lesson_%d_comment_%d", s.Lesson.Lesson.ID, lts.MakeLike.CommentID)
			rdb.SAdd(ctx, cls, s.Student.ID)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.MakeDiscuss.IsRequest {
			discussion := fmt.Sprintf("lesson_%d_discussion", s.Lesson.Lesson.ID)
			rdb.LPush(ctx, discussion, lts.MakeDiscuss.Content)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.AnswerQuestion.IsRequest {
			que := fmt.Sprintf("lesson_%d_question_%d", s.Lesson.Lesson.ID, lts.AnswerQuestion.QuestionID)
			if lts.AnswerQuestion.IsCorrect {
				rdb.HIncrBy(ctx, que, "correct", 1)
			}
			for _, v := range lts.AnswerQuestion.Option {
				option := fmt.Sprintf("option_%d_count", v)
				rdb.HIncrBy(ctx, que, option, 1)
			}
			s.Lesson.NewAnswer <- lts.AnswerQuestion.QuestionID
		}
	}
}

func StudentRunWrite(s *constant.Student) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
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
		case <-ticker.C:
			_ = s.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := s.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func BeginLesson(c *gin.Context) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
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
	go TeacherRunRead(teacher)
	go TeacherRunWrite(teacher)
	return
}

func EnterIntoLesson(c *gin.Context) (err error) {
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
	go StudentRunRead(student)
	go StudentRunWrite(student)
	return
}
