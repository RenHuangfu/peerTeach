package domain

import (
	"errors"
	"gorm.io/gorm"
)

// User 用户
type User struct {
	ID               uint `gorm:"primaryKey"`
	Password         string
	Name             string
	Email            string `gorm:"unique,not null"`
	Identity         string
	Profile          *string
	School           *string
	SecurityQuestion *string
	SecurityAnswer   *string
}

// AfterCreate 用户创建后分配角色
func (u *User) AfterCreate(tx *gorm.DB) (err error) {
	switch u.Identity {
	case "teacher":
		err = tx.Create(&Teacher{UserID: u.ID}).Error
	case "student":
		err = tx.Create(&Student{UserID: u.ID}).Error
	case "manager":
		err = tx.Create(&Manager{UserID: u.ID}).Error
	default:
		return errors.New("invalid identity")
	}
	return err
}

// Teacher 教师
type Teacher struct {
	gorm.Model
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Student 学生
type Student struct {
	gorm.Model
	UserID uint
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
