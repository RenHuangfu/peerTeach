package domain

import (
	"gorm.io/gorm"
	"time"
)

type Announcement struct {
	gorm.Model
	Content  string `gorm:"type:text"`
	SendTime time.Time
	ClassID  uint
	Class    Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
