package domain

import (
	"time"
)

// Course 课程
type Course struct {
	ID      uint      `gorm:"primary_key"`
	Created time.Time `gorm:"column:created;autoCreateTime"`
	Updated time.Time `gorm:"column:updated;autoUpdateTime"`
	Name    *string
	UserID  uint
	User    User `gorm:"constraint:OnDelete:CASCADE;"`
}

// Class 班级
type Class struct {
	ID       uint      `gorm:"primary_key"`
	Created  time.Time `gorm:"column:created;autoCreateTime"`
	Updated  time.Time `gorm:"column:updated;autoUpdateTime"`
	Name     *string
	CourseID uint
	Course   Course `gorm:"constraint:OnDelete:CASCADE;"`
	Users    []User `gorm:"many2many:class_users;constraint:OnDelete:CASCADE;"`
}

// Announcement 公告
type Announcement struct {
	ID      uint      `gorm:"primary_key"`
	Created time.Time `gorm:"column:created;autoCreateTime"`
	Updated time.Time `gorm:"column:updated;autoUpdateTime"`
	FileNum uint
	UserID  uint
	Title   *string `gorm:"type:text"`
	Content *string `gorm:"type:text"`
	User    User    `gorm:"constraint:OnDelete:CASCADE;"`
	Classes []Class `gorm:"many2many:announcement_classes;constraint:OnDelete:CASCADE;"`
}

// ClassUser 班级学生连接表
type ClassUser struct {
	ClassID   uint  `gorm:"primaryKey"`
	Class     Class `gorm:"foreignKey:ID;references:ClassID;constraint:OnDelete:CASCADE;"`
	UserID    uint  `gorm:"primaryKey"`
	User      User  `gorm:"foreignKey:ID;references:UserID;constraint:OnDelete:CASCADE;"`
	CreatedAt time.Time
}

// AnnouncementClass 通知班级连接表
type AnnouncementClass struct {
	ClassID        uint         `gorm:"primaryKey"`
	Class          Class        `gorm:"foreignKey:ID;references:ClassID;constraint:OnDelete:CASCADE;"`
	AnnouncementID uint         `gorm:"primaryKey"`
	Announcement   Announcement `gorm:"foreignKey:ID;references:AnnouncementID;constraint:OnDelete:CASCADE;"`
	CreatedAt      time.Time
}
