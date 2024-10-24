package domain

import (
	"gorm.io/gorm"
	"time"
)

// Post 帖子
type Post struct {
	gorm.Model
	Content  *string `gorm:"type:text"`
	SendTime time.Time
	Likes    uint
	Comment  uint
	UserID   uint
	ClassID  uint
	User     User  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Class    Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Comment 评论
type Comment struct {
	gorm.Model
	Content *string `gorm:"type:text"`
	Likes   uint
	PostID  uint
	Post    Post `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
