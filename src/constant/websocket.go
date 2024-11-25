package constant

import (
	"github.com/gorilla/websocket"
	"peerTeach/domain"
)

type QuestionShow struct {
	QuestionID uint
	Time       uint
}

type Lesson struct {
	Lesson      *domain.Lesson
	Students    map[*Student]bool
	Teacher     *Teacher
	NewQuestion chan *QuestionShow
	NewPPT      chan uint
	NewAnswer   chan uint
	NewMsg      chan struct{}
	Register    chan *Student
	UnRegister  chan *Student
}

type Teacher struct {
	Lesson     *Lesson
	Conn       *websocket.Conn
	User       *domain.User
	NewMsg     chan struct{}
	OverLesson chan struct{}
}

type Student struct {
	Lesson      *Lesson
	Conn        *websocket.Conn
	Student     *domain.User
	NewMsg      chan struct{}
	NewQuestion chan *QuestionShow
	NewPPT      chan uint
}

func (t *Teacher) NewLesson(l *domain.Lesson) (lesson *Lesson) {
	return &Lesson{
		Lesson:      l,
		Students:    make(map[*Student]bool),
		Teacher:     t,
		NewQuestion: make(chan *QuestionShow),
		NewPPT:      make(chan uint),
		NewAnswer:   make(chan uint),
		NewMsg:      make(chan struct{}),
		Register:    make(chan *Student),
		UnRegister:  make(chan *Student),
	}
}

func (l *Lesson) Run() {
	for {
		select {
		case student := <-l.Register:
			l.Students[student] = true
		case student := <-l.UnRegister:
			if _, ok := l.Students[student]; ok {
				delete(l.Students, student)
				close(student.NewMsg)
				close(student.NewQuestion)
				close(student.NewPPT)
			}
		case message := <-l.NewMsg:
			for student := range l.Students {
				select {
				case student.NewMsg <- message:
				default:
					delete(l.Students, student)
					close(student.NewMsg)
					close(student.NewQuestion)
					close(student.NewPPT)
				}
			}
			select {
			case l.Teacher.NewMsg <- message:
			default:
				close(l.Teacher.NewMsg)
				return
			}
		case NewQuestion := <-l.NewQuestion:
			for student := range l.Students {
				select {
				case student.NewQuestion <- NewQuestion:
				default:
					delete(l.Students, student)
					close(student.NewMsg)
					close(student.NewQuestion)
					close(student.NewPPT)
				}
			}
		case NewPPT := <-l.NewPPT:
			for student := range l.Students {
				select {
				case student.NewPPT <- NewPPT:
				default:
					delete(l.Students, student)
					close(student.NewMsg)
					close(student.NewQuestion)
					close(student.NewPPT)
				}
			}
		case <-l.Teacher.OverLesson:
			for student := range l.Students {
				delete(l.Students, student)
				close(student.NewMsg)
				close(student.NewQuestion)
				close(student.NewPPT)
			}
			close(l.Teacher.NewMsg)
			return
		}
	}
}
