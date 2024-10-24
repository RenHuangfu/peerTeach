package constant

import "peerTeach/domain"

var (
	UserSession = "user"
)

// RegisterRequest 注册请求
type RegisterRequest struct {
	UserName string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Identity string `json:"identity"`
	School   string `json:"school"`
}

// LoginRequest 登陆请求
type LoginRequest struct {
	Email    string `json:"email"`
	PassWord string `json:"password"`
}

// InfoRequest 个人信息请求
type InfoRequest struct {
	Request  string `json:"request"`
	UserName string `json:"user_name"`
	School   string `json:"school"`
}

// courseReq 课程子请求
type courseReq struct {
	IsRequest  bool   `json:"isRequest"`
	ClassID    uint   `json:"class_id"`
	CourseID   uint   `json:"course_id"`
	CourseName string `json:"course_name"`
	ClassName  string `json:"class_name"`
}

// announceReq 公告请求
type announceReq struct {
	IsRequest       bool   `json:"isRequest"`
	AnnounceID      uint   `json:"announce_id"`
	AnnounceTitle   string `json:"title"`
	AnnounceContent string `json:"content"`
	ClassesID       []uint `json:"classes_id"`
	FileNumber      uint   `json:"file_number"`
}

// CourseRequest 课程请求
type CourseRequest struct {
	GetCourse     courseReq   `json:"get_course"`
	EnterClass    courseReq   `json:"enter_class"`
	DeleteClass   courseReq   `json:"delete_class"`
	DeleteCourse  courseReq   `json:"delete_course"`
	EditCourse    courseReq   `json:"edit_course"`
	CreateCourse  courseReq   `json:"create_course"`
	CreateClass   courseReq   `json:"create_class"`
	ExitClass     courseReq   `json:"exit_class"`
	GroupAnnounce announceReq `json:"group_post"`
}

// classReq 班级子请求
type classReq struct {
	IsRequest      bool   `json:"isRequest"`
	ClassID        uint   `json:"class_id"`
	UserID         uint   `json:"user_id"`
	PostID         uint   `json:"post_id"`
	CommentID      uint   `json:"comment_id"`
	AnnouncementID uint   `json:"announcement_id"`
	Title          string `json:"title"`
	Content        string `json:"content"`
	FileNum        uint   `json:"file_num"`
}

// ClassRequest 班级请求
type ClassRequest struct {
	GetLesson          classReq `json:"get_lessons"`
	GetMember          classReq `json:"get_members"`
	DeleteStudent      classReq `json:"delete_student"`
	GetPost            classReq `json:"get_posts"`
	CreatePost         classReq `json:"create_post"`
	GetAnnouncement    classReq `json:"get_announcements"`
	CreateAnnouncement classReq `json:"create_announcements"`
	DeleteAnnouncement classReq `json:"delete_announcement"`
}

// QuestionReq 题目请求
type QuestionReq struct {
	IsRequest  bool           `json:"isRequest"`
	QuestionID uint           `json:"question_id"`
	Title      string         `json:"title"`
	Subject    string         `json:"subject"`
	Section    string         `json:"section"`
	Course     string         `json:"course"`
	IsPublic   bool           `json:"is_public"`
	Options    domain.Options `json:"options"`
}

type PaperReq struct {
	IsRequest  bool   `json:"isRequest"`
	PaperID    uint   `json:"paper_id"`
	Title      string `json:"title"`
	QuestionID []uint `json:"question_id"`
}

// ResourceReq 资源子请求
type ResourceReq struct {
	IsRequest bool   `json:"isRequest"`
	Subject   string `json:"subject"`
	Section   string `json:"section"`
	Course    string `json:"course"`
}

// ResourceRequest 资源请求
type ResourceRequest struct {
	GetPaper          ResourceReq `json:"get_paper"`
	GetQuestion       ResourceReq `json:"get_question"`
	GetGlobalQuestion ResourceReq `json:"get_global_question"`
	CreatePaper       PaperReq    `json:"create_paper"`
	CreateQuestion    QuestionReq `json:"create_question"`
	DeletePaper       PaperReq    `json:"delete_paper"`
	DeleteQuestion    QuestionReq `json:"delete_question"`
}

type ResourceDetailRequest struct {
	GetPaperDetail    PaperReq    `json:"get_paper_detail"`
	GetQuestionDetail QuestionReq `json:"get_question_detail"`
	UpdatePaper       PaperReq    `json:"update_paper"`
	UpdateQuestion    QuestionReq `json:"update_question"`
}

// postReq 帖子子请求
type postReq struct {
	IsRequest bool   `json:"isRequest"`
	PostID    uint   `json:"post_id"`
	CommentID uint   `json:"comment_id"`
	Content   string `json:"content"`
}

// PostRequest 帖子详情请求
type PostRequest struct {
	GetPostDetail postReq `json:"get_post_detail"`
	CreateComment postReq `json:"create_comment"`
	DeletePost    postReq `json:"delete_post"`
	DeleteComment postReq `json:"delete_comment"`
	LikePost      postReq `json:"like_post"`
	LikeComment   postReq `json:"like_comment"`
}

// AnnounceRequest 公告详情请求
type AnnounceRequest struct {
	GetAnnounceDetail  announceReq `json:"get_announce_detail"`
	DeleteAnnouncement announceReq `json:"delete_announcement"`
}
