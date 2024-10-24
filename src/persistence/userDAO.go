package persistence

import (
	"gorm.io/gorm"
	"peerTeach/domain"
	"peerTeach/util"
)

var db *gorm.DB

// GetUserByEmail 通过邮箱获取用户
func GetUserByEmail(email string) (user *domain.User, err error) {
	db = util.GetDB()
	err = db.Take(user, "email = ?", email).Error
	return user, err
}

// InsertUser 插入用户
func InsertUser(user *domain.User) (err error) {
	db = util.GetDB()
	err = db.Create(user).Error
	return err
}

// UpdateUser 更新用户
func UpdateUser(user *domain.User) (err error) {
	db = util.GetDB()
	err = db.Save(user).Error
	return err
}

// DeleteUserByEmail 删除用户
func DeleteUserByEmail(email string) (err error) {
	db = util.GetDB()
	//开启事务
	tx := db.Begin()
	//删除用户
	err = tx.Where("email = ?", email).Delete(&domain.User{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return err
}
