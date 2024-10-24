package persistence

import (
	"gorm.io/gorm"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/util"
)

var db *gorm.DB

// GetUserByEmail 通过邮箱获取用户
func GetUserByEmail(email string) (*domain.User, error) {
	db = util.GetDB()
	user := &domain.User{}
	err := db.Model(domain.User{}).Where("email=?", email).First(user).Error
	if err != nil {
		return nil, err
	}
	return user, err
}

// GetUserInfo 获取用户信息
func GetUserInfo(u *domain.User) (r *constant.InfoResponse, err error) {
	db = util.GetDB()
	err = db.Raw("select id,name,email,school from users where id = ?", u.ID).Scan(&r).Error
	if err != nil {
		return nil, err
	}
	return
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
	err = tx.Where("email = ?", email).Delete(domain.User{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return err
}
