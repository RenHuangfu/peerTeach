package domain

import "gorm.io/gorm"

// Question 题目
type Question struct {
	gorm.Model
	Subject        *string
	Section        *string
	Type           *string
	IsPublic       bool
	QuestionStem   *string `gorm:"type:text"`
	QuestionOption *string `gorm:"type:text"`
	RightAnswer    *string
	CourseID       uint
	Course         Course `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// AnswerRecord 答题记录
type AnswerRecord struct {
	gorm.Model
	AnswerContent *string `gorm:"type:text"`
	AnswerReason  *string `gorm:"type:text"`
	Likes         uint
	StudentID     uint
	QuestionID    uint
	ClassRoomID   uint
	Student       Student   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Question      Question  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ClassRoom     ClassRoom `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Exam 试卷
type Exam struct {
	gorm.Model
	Name      *string
	TeacherID uint
	Teacher   User       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Questions []Question `gorm:"many2many:exam_questions;"`
}

// ExamQuestion 试卷题目连接表
type ExamQuestion struct {
	QuestionID uint `gorm:"primaryKey"`
	ExamId     uint `gorm:"primaryKey"`
}
