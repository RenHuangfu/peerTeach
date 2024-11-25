package domain

import "time"

// Lesson 课堂
type Lesson struct {
	ID         uint      `gorm:"primary_key"`
	Created    time.Time `gorm:"column:created;autoCreateTime"`
	Name       *string   `json:"name"`
	SchoolTime time.Time
	ExamID     uint
	PPTName    *string
	ClassID    uint
	Class      Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// AnswerRecord 答题记录
type AnswerRecord struct {
	ID           uint      `gorm:"primary_key"`
	Created      time.Time `gorm:"column:created;autoCreateTime"`
	IsCorrect    bool
	AnswerReason *string `gorm:"type:text"`
	Likes        uint
	UserID       uint
	QuestionID   uint
	LessonID     uint
	User         User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Question     Question `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Lesson       Lesson   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
