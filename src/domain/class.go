package domain

import "gorm.io/gorm"

// Class 班级
type Class struct {
	gorm.Model
	Name     string
	CourseID uint
	Course   Course `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users    []User
}
