package constant

import (
	"peerTeach/domain"
	"time"
)

type InfoResponse struct {
	ID     uint    `json:"user_id" gorm:"id"`
	Name   *string `json:"user_name" gorm:"name"`
	Email  *string `json:"email" gorm:"email"`
	School *string `json:"school" gorm:"school"`
}

type Class struct {
	ID   uint    `json:"id"`
	Name *string `json:"name"`
}

type Course struct {
	CourseId   uint    `json:"course_id"`
	CourseName *string `json:"course_name"`
	Classes    []Class `json:"classes"`
}

type CourseResponse struct {
	Courses []Course `json:"courses"`
}

type DetailClass struct {
	ClassID     uint    `json:"class_id" gorm:"class_id"`
	ClassName   *string `json:"class_name" gorm:"class_name"`
	CourseID    uint    `json:"course_id" gorm:"course_id"`
	CourseName  *string `json:"course_name" gorm:"course_name"`
	TeacherName *string `json:"teacher_name" gorm:"teacher_name"`
}

type ClassResponse struct {
	Classes []*DetailClass `json:"classes"`
}

type AnnouncementResponse struct {
	Id          uint      `json:"announcement_id" gorm:"id"`
	Time        time.Time `json:"time" gorm:"time"`
	Title       *string   `json:"title" gorm:"title"`
	TeacherName *string   `json:"teacher_name" gorm:"teacher_name"`
}

type PostResponse struct {
	PostID      uint      `json:"post_id" gorm:"post_id"`
	CreateTime  time.Time `json:"create_time" gorm:"create_time"`
	PostTitle   *string   `json:"post_title" gorm:"post_title"`
	PostLikes   uint      `json:"post_likes" gorm:"post_likes"`
	PostComment uint      `json:"post_comment" gorm:"post_comment"`
	UserID      uint      `json:"user_id" gorm:"user_id"`
	UserName    *string   `json:"user_name" gorm:"user_name"`
	IsLike      bool      `json:"islike" gorm:"is_like"`
}

type CommentRes struct {
	CommentID      uint      `json:"comment_id" gorm:"comment_id"`
	CreateTime     time.Time `json:"create_time" gorm:"create_time"`
	CommentContent *string   `json:"comment_content" gorm:"comment_content"`
	CommentLikes   uint      `json:"comment_likes" gorm:"comment_likes"`
	UserID         uint      `json:"user_id" gorm:"user_id"`
	UserName       *string   `json:"user_name" gorm:"user_name"`
	IsLike         bool      `json:"islike" gorm:"is_like"`
	IsSelf         bool      `json:"isself" gorm:"is_self"`
}

type PostResponseDetail struct {
	PostID      uint      `json:"post_id" gorm:"post_id"`
	CreateTime  time.Time `json:"create_time" gorm:"create_time"`
	PostTitle   *string   `json:"post_title" gorm:"post_title"`
	PostLikes   uint      `json:"post_likes" gorm:"post_likes"`
	PostComment uint      `json:"post_comment" gorm:"post_comment"`
	PostContent *string   `json:"post_content" gorm:"post_content"`
	PhotoNum    uint      `json:"photo_num" gorm:"photo_num"`
	UserID      uint      `json:"user_id" gorm:"user_id"`
	UserName    *string   `json:"user_name" gorm:"user_name"`
	IsLike      bool      `json:"islike" gorm:"is_like"`
	IsSelf      bool      `json:"isself" gorm:"is_self"`
}

type PostResponseTotal struct {
	PostResponseDetail PostResponseDetail `json:"post_detail"`
	CommentRes         []*CommentRes      `json:"comments"`
}

type AnnouncementResDetail struct {
	Time    time.Time `json:"time" gorm:"time"`
	Title   *string   `json:"title" gorm:"title"`
	Content *string   `json:"content" gorm:"content"`
	FileNum uint      `json:"file_num" gorm:"file_num"`
}

type Paper struct {
	PaperID        uint      `json:"paperId" gorm:"paper_id"`
	Title          *string   `json:"title" gorm:"title"`
	LastChangeTime time.Time `json:"LastChangeTime" gorm:"time"`
}

type PapersResponse struct {
	Papers []*Paper `json:"papers"`
}

type Question struct {
	QuestionID     uint      `json:"questionId" gorm:"question_id"`
	Title          *string   `json:"title" gorm:"title"`
	LastChangeTime time.Time `json:"LastChangeTime" gorm:"time"`
}

type QuestionDetail struct {
	Question
	domain.Options
}

type QuestionResponse struct {
	Questions []*Question `json:"question"`
}

type PaperResponseDetail struct {
	Name      string            `json:"name"`
	Questions []*QuestionDetail `json:"question"`
}
