package domain

import (
	"gorm.io/gorm"
	"time"
)

// Post 帖子
type Post struct {
	gorm.Model
	Content  string `gorm:"type:text"`
	SendTime time.Time
	Likes    uint
	Comment  uint
	UserID   uint
	ClassID  uint
	User     User  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Class    Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
