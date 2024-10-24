package domain

import "gorm.io/gorm"

// Manager 管理者
type Manager struct {
	gorm.Model
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Notification 通知
type Notification struct {
	gorm.Model
	Content   *string `gorm:"type:text"`
	ManagerID uint
	Manager   Manager `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Users     []User  `gorm:"many2many:notification_users;"`
}

// AfterDelete 通知删除后级联删除用户连接表
func (n *Notification) AfterDelete(tx *gorm.DB) (err error) {
	err = tx.Where("notification_id = ?", n.ID).Delete(&NotificationUser{}).Error
	return err
}

// NotificationUser 通知用户连接表
type NotificationUser struct {
	UserID         uint `gorm:"primaryKey"`
	NotificationID uint `gorm:"primaryKey"`
}
