package domain

import (
	"gorm.io/gorm"
	"time"
)

// ClassRoom 课堂
type ClassRoom struct {
	gorm.Model
	Name       string
	SchoolTime time.Time
	ClassID    uint
	Class      Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
