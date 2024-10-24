package domain

import "gorm.io/gorm"

// Question 题目
type Question struct {
	gorm.Model
	Subject        string
	Section        string
	Type           string
	IsPublic       bool
	QuestionStem   string `gorm:"type:text"`
	QuestionOption string `gorm:"type:text"`
	RightAnswer    string
	CourseID       uint
	Course         Course `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
