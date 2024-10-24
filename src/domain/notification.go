package domain

import "gorm.io/gorm"

type Notification struct {
	gorm.Model
	Content string `gorm:"type:text"`
	Scope   string
	User    []User `gorm:"many2many:notification_users;"`
}
type NotificationUser struct {
	UserID         uint `gorm:"primaryKey"`
	NotificationID uint `gorm:"primaryKey"`
}
