package domain

import "gorm.io/gorm"

// Comment 评论
type Comment struct {
	gorm.Model
	Content string `gorm:"type:text"`
	Likes   uint
	PostID  uint
	Post    Post `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
