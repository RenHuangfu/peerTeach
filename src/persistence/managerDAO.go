package persistence

import (
	"peerTeach/constant"
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
func GetNotification(user *domain.User) (r *constant.NoticeRes, err error) {
	db = util.GetDB()
	notices := make([]constant.Notice, 10)
	err = db.Raw("select n.content as content,n.created as created from notifications as n "+
		"join notification_users as n_u on n_u.notification_id = n.id "+
		"and n_u.user_id = ?", user.ID).Scan(&notices).Error
	r = &constant.NoticeRes{
		Notices: notices,
	}
	return
}
