package domain

import "gorm.io/gorm"

// Course 课程
type Course struct {
	gorm.Model
	Name   string
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
