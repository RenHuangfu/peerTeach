package domain

import "gorm.io/gorm"

// AnswerRecord 答题记录
type AnswerRecord struct {
	gorm.Model
	AnswerContent string `gorm:"type:text"`
	AnswerReason  string `gorm:"type:text"`
	Likes         uint
	UserID        uint
	QuestionID    uint
	ClassRoomID   uint
	User          User      `gorm:"foreignkey:UserID"`
	Question      Question  `gorm:"foreignkey:QuestionID"`
	ClassRoom     ClassRoom `gorm:"foreignkey:ClassRoomID"`
}
