package domain

import "gorm.io/gorm"

// Exam 试卷
type Exam struct {
	gorm.Model
	Name   string
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
