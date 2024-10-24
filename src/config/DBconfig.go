package config

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"peerTeach/domain"
)

func Init() {
	dsn := "root:000000@tcp(127.0.0.1:3306)/peerTeach?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Course{},
		&domain.Question{},
		&domain.Class{},
		&domain.ClassRoom{},
		&domain.AnswerRecord{},
		&domain.Announcement{},
		&domain.Comment{},
		&domain.Exam{},
		&domain.Post{},
	)
	if err != nil {
		panic(err)
	}
	err = db.SetupJoinTable(&domain.Notification{}, "User", &domain.NotificationUser{})
	if err != nil {
		panic(err)
	}
}
