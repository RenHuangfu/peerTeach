package domain

import (
	"time"
)

// Post 帖子
type Post struct {
	ID       uint      `gorm:"primary_key"`
	Created  time.Time `gorm:"column:created;autoCreateTime"`
	Title    *string   `gorm:"type:text"`
	Content  *string   `gorm:"type:text"`
	Likes    uint      `gorm:"default:0"`
	Comment  uint      `gorm:"default:0"`
	PhotoNum uint      `gorm:"default:0"`
	UserID   uint
	ClassID  uint
	User     User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Class    Class  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Users    []User `gorm:"many2many:post_users;constraint:OnDelete:CASCADE;"`
}

// Comment 评论
type Comment struct {
	ID      uint      `gorm:"primary_key"`
	Created time.Time `gorm:"column:created;autoCreateTime"`
	Updated time.Time `gorm:"column:updated;autoUpdateTime"`
	Content *string   `gorm:"type:text"`
	Likes   uint
	PostID  uint
	UserID  uint
	Post    Post   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	User    User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Users   []User `gorm:"many2many:comment_users;constraint:OnDelete:CASCADE;"`
}

// PostUser 用户对某个帖子是否点过赞
type PostUser struct {
	PostID uint `gorm:"primaryKey"`
	Post   Post `gorm:"foreignKey:ID;references:PostID;constraint:OnDelete:CASCADE;"`
	UserID uint `gorm:"primaryKey"`
	User   User `gorm:"foreignKey:ID;references:UserID;constraint:OnDelete:CASCADE;"`
}

// CommentUser 用户对某个评论是否点过赞
type CommentUser struct {
	CommentID uint    `gorm:"primaryKey"`
	Comment   Comment `gorm:"foreignKey:ID;references:CommentID;constraint:OnDelete:CASCADE;"`
	UserID    uint    `gorm:"primaryKey"`
	User      User    `gorm:"foreignKey:ID;references:UserID;constraint:OnDelete:CASCADE;"`
}
