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
	err = tx.Where("notification_id = ?", notify.ID).Delete(&domain.NotificationUser{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return err
}

// GetNotification 查找被通知用户的所有通知信息
func GetNotification(user *domain.User) (n []*domain.Notification, err error) {
	db = util.GetDB()
	tx := db.Begin()
	var a []uint
	err = tx.Model(domain.NotificationUser{}).Where("user_id = ?", user.ID).Find(&a).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = tx.Model(domain.Notification{}).Where(a).Find(&n).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return n, err
}
