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
	pingPeriod = writeWait

	// Maximum message size allowed from peer.
	maxMessageSize = 4096
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
		fmt.Println("Error marshaling message:", err)
		return
	}

	_, err = w.Write(Msg)
	if err != nil {
		fmt.Println("Error writing message:", err)
		return
	}

	// 关闭 writer，确保消息被发送出去
	err = w.Close()
	if err != nil {
		fmt.Println("Error closing writer:", err)
		return
	}
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
		r.Comments[k] = &constant.LessonComment{}
		r.Comments[k].Content = v
		comment := fmt.Sprintf("lesson_%d_comment_%d", l.ID, k)
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
	fmt.Printf("%+v\n", r)
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
		//rdb.HSet(ctx, que, "correct", 0)
		rdb.HSet(ctx, que, "optionNum", len(v.Options.Ops))
		for k, w := range v.Options.Ops {
			rdb.HSet(ctx, que, fmt.Sprintf("option_%d", k), w.Text)
			//rdb.HSet(ctx, que, fmt.Sprintf("option_%d_count", k), 0)
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
			IsStart    bool `json:"is_start"`
		}{IsResponse: true, LessonID: lesson.ID, IsStart: true},
	})
	RecPPT(t, lts.ReadyLesson.PPTSize)
	WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
		ReadyLesson: struct {
			IsResponse bool `json:"is_response"`
			LessonID   uint `json:"lesson_id"`
			IsStart    bool `json:"is_start"`
		}{IsResponse: true, LessonID: lesson.ID, IsStart: false},
	})
	t.Start <- struct{}{}
	return
}

func RecPPT(t *constant.Teacher, size uint) {

	// 保存PPT文件到临时文件
	tmpFile, err := os.CreateTemp("../temp/", fmt.Sprintf("PPTJPG_%d.ppt", t.Lesson.Lesson.ID))
	if err != nil {
		log.Println("Failed to create temp file:", err)
		return
	}
	defer os.Remove(tmpFile.Name())

	conn := t.Conn
	var cur uint
	file, err := os.OpenFile(tmpFile.Name(), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// 写入数据
	for cur < size {
		_, pptData, err := conn.ReadMessage()
		cur += uint(len(pptData))
		if err != nil {
			fmt.Println("pptData error")
		}
		_, err = file.Write(pptData)
		if err != nil {
			fmt.Println("Error writing to file:", err)
			return
		}
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
		LessonOver(t.Lesson.Lesson.ID)
		t.OverLesson <- struct{}{}
		t.End <- struct{}{}
		_ = t.Conn.Close()
	}()
	t.Conn.SetReadLimit(maxMessageSize)
	_ = t.Conn.SetReadDeadline(time.Now().Add(pongWait))
	t.Conn.SetPongHandler(func(string) error { return t.Conn.SetReadDeadline(time.Now().Add(pongWait)) })
	WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
		StartLesson: struct {
			IsResponse bool `json:"is_response"`
		}{IsResponse: true},
	})
	for {
		_, message, err := t.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			return
		}
		if len(message) == 0 {
			continue
		}
		lts := &constant.LessonTeacherRequest{}
		err = json.Unmarshal(message, lts)
		if err != nil {
			fmt.Println("err")
		}
		fmt.Println(lts)
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
			for k, w := range que.Options.Ops {
				rdb.HSet(ctx, lq, fmt.Sprintf("option_%d", k), w.Text)
			}
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				InsertQuestion: struct {
					IsResponse bool `json:"is_response"`
					QuestionID uint `json:"question_id"`
				}{IsResponse: true, QuestionID: que.ID},
			})
		} else if lts.ShowPPT.IsRequest {
			fmt.Println("teacher:ShowPPT", lts.ShowPPT.ShowID)
			t.Lesson.NewPPT <- lts.ShowPPT.ShowID
		} else if lts.ShowQuestion.IsRequest {
			t.Lesson.NewQuestion <- constant.QuestionShow{
				QuestionID: lts.ShowQuestion.ShowID,
				Time:       lts.ShowQuestion.Time,
				Round:      lts.ShowQuestion.Round,
			}
		} else if lts.OverLesson.IsRequest {
			return
		}
	}
}

func TeacherRunWrite(t *constant.Teacher) {
	fmt.Println(t.Lesson)
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = t.Conn.Close()
	}()
	for {
		select {
		case <-t.NewMsg:
			fmt.Println("newMsg")
			data, err := GetDiscussion(t.Lesson.Lesson, t.User)
			if err != nil {
				fmt.Println(err)
			}
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				DiscussionRes: *data,
			})
		case queMsg := <-t.Lesson.NewAnswer:
			fmt.Println("t.Lesson.NewAnswer")
			que := fmt.Sprintf("lesson_%d_question_%d", t.Lesson.Lesson.ID, queMsg.QuestionID)
			opNum, err := rdb.HGet(ctx, que, "optionNum").Result()
			if err != nil {
				fmt.Println(err)
			}
			n, _ := strconv.Atoi(opNum)
			optNum := make([]uint, n)
			for i := 0; i < n; i++ {
				strNum, _ := rdb.HGet(ctx, que, fmt.Sprintf("option_%d_count_%d", i, queMsg.Round)).Result()
				num, _ := strconv.Atoi(strNum)
				optNum[i] = uint(num)
			}
			correctNum, _ := rdb.HGet(ctx, que, fmt.Sprintf("correct_%d", queMsg.Round)).Result()
			crt, _ := strconv.Atoi(correctNum)
			WebSocketWrite(t.Conn, constant.LessonTeacherResponse{
				QuestionResponse: constant.LessonQuestionResponse{
					IsResponse: true,
					QuestionRes: constant.LessonQuestionRes{
						QuestionID: queMsg.QuestionID,
						OptionNum:  optNum,
					},
					CorrectNum: uint(crt),
				},
			})
		case <-ticker.C:
			fmt.Println("ticker.C")
			_ = t.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := t.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case <-t.End:
			return
		}
	}
}

func StudentRunRead(s *constant.Student) {
	defer func() {
		s.Lesson.UnRegister <- s
		s.End <- struct{}{}
		_ = s.Conn.Close()
	}()
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
			s.Lesson.Register <- s
			s.Start <- struct{}{}
		} else if lts.MakeLike.IsRequest {
			cls := fmt.Sprintf("lesson_%d_comment_%d", s.Lesson.Lesson.ID, lts.MakeLike.CommentID)
			rdb.SAdd(ctx, cls, s.Student.ID)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.MakeDiscuss.IsRequest {
			discussion := fmt.Sprintf("lesson_%d_discussion", s.Lesson.Lesson.ID)
			fmt.Println(discussion)
			rdb.RPush(ctx, discussion, lts.MakeDiscuss.Content)
			s.Lesson.NewMsg <- struct{}{}
		} else if lts.AnswerQuestion.IsRequest {
			que := fmt.Sprintf("lesson_%d_question_%d", s.Lesson.Lesson.ID, lts.AnswerQuestion.QuestionID)
			fmt.Println(que)
			if lts.AnswerQuestion.IsCorrect {
				rdb.HIncrBy(ctx, que, fmt.Sprintf("correct_%d", lts.AnswerQuestion.Round), 1)
			}
			for _, v := range lts.AnswerQuestion.Option {
				option := fmt.Sprintf("option_%d_count_%d", v, lts.AnswerQuestion.Round)
				rdb.HIncrBy(ctx, que, option, 1)
			}
			s.Lesson.NewAnswer <- constant.QuestionMsg{
				QuestionID: lts.AnswerQuestion.QuestionID,
				Round:      lts.AnswerQuestion.Round,
			}
		}
	}
}

func StudentRunWrite(s *constant.Student) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
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
			fmt.Println("NewQuestion")
			WebSocketWrite(s.Conn, constant.LessonStudentResponse{
				QuestionRes: constant.LessonQuestion{
					IsResponse: true,
					QuestionID: que.QuestionID,
					Time:       que.Time,
					Round:      que.Round,
				},
			})
		case ppt := <-s.NewPPT:
			fmt.Println("NewPPT")
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
		case <-s.End:
			fmt.Println("end")
			return
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
	tea := user.(domain.User)
	teacher := &constant.Teacher{
		Conn:       conn,
		User:       &tea,
		Start:      make(chan struct{}),
		End:        make(chan struct{}),
		NewMsg:     make(chan struct{}),
		OverLesson: make(chan struct{}),
	}
	go TeacherRunRead(teacher)
	_ = <-teacher.Start
	close(teacher.Start)
	go TeacherRunWrite(teacher)
	fmt.Println("ready")
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
	stu := user.(domain.User)
	student := &constant.Student{
		Conn:        conn,
		Student:     &stu,
		Start:       make(chan struct{}),
		End:         make(chan struct{}),
		NewMsg:      make(chan struct{}),
		NewQuestion: make(chan constant.QuestionShow),
		NewPPT:      make(chan uint),
	}
	go StudentRunRead(student)
	_ = <-student.Start
	close(student.Start)
	go StudentRunWrite(student)
	return
}
