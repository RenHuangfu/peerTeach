package persistence

import (
	"peerTeach/domain"
	"peerTeach/util"
)

// InsertNotification 插入通知和被通知者
func InsertNotification(notify *domain.Notification, users []*domain.User) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Create(notify).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	for _, user := range users {
		err = tx.Create(&domain.NotificationUser{
			UserID:         user.ID,
			NotificationID: notify.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return err
}

// DeleteNotification 删除通知
func DeleteNotification(notify *domain.Notification) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Notification{}).Delete(notify).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return err
}

// GetNotification 查找被通知用户的所有通知信息
func GetNotification(user *domain.User) (notify []*domain.Notification, err error) {
	db = util.GetDB()
	notify = make([]*domain.Notification, 10)
	var notifyID []uint
	tx := db.Begin()
	err = tx.Model(domain.NotificationUser{}).Where("user_id = ?", user.ID).Pluck("notification_id", &notifyID).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = tx.Model(domain.Notification{}).Where("id IN (?)", notifyID).Find(&notify).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return notify, err
}
