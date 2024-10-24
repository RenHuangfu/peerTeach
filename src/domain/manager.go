package domain

import (
	"time"
)

// Manager 管理者
type Manager struct {
	ID       uint      `gorm:"primary_key"`
	Created  time.Time `gorm:"column:created;autoCreateTime"`
	Updated  time.Time `gorm:"column:updated;autoUpdateTime"`
	Password string
	Name     string
}

// Notification 通知
type Notification struct {
	ID        uint      `gorm:"primary_key"`
	Created   time.Time `gorm:"column:created;autoCreateTime"`
	Updated   time.Time `gorm:"column:updated;autoUpdateTime"`
	Content   *string   `gorm:"type:text"`
	ManagerID uint
	Manager   Manager `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Users     []User  `gorm:"many2many:notification_users;constraint:OnDelete:CASCADE;"`
}

// NotificationUser 通知用户连接表
type NotificationUser struct {
	NotificationID uint         `gorm:"primaryKey"`
	Notification   Notification `gorm:"foreignKey:ID;references:NotificationID;constraint:OnDelete:CASCADE;"`
	UserID         uint         `gorm:"primaryKey"`
	User           User         `gorm:"foreignKey:ID;references:UserID;constraint:OnDelete:CASCADE;"`
	CreatedAt      time.Time
}
