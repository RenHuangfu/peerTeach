package util

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"peerTeach/config"
	"peerTeach/domain"
	"sync"
	"time"
)

var (
	db     *gorm.DB
	dbOnce sync.Once
)

func init() {
	initDB := GetDB()
	err := initDB.AutoMigrate(
		&domain.User{},
		&domain.Course{},
		&domain.Class{},
		&domain.ClassRoom{},
		&domain.Question{},
		&domain.AnswerRecord{},
		&domain.Announcement{},
		&domain.Post{},
		&domain.Comment{},
		&domain.Exam{},
		&domain.Manager{},
		&domain.Notification{},
	)
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Class{}, "Users", &domain.ClassUser{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.ClassUser{})
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Notification{}, "Users", &domain.NotificationUser{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.NotificationUser{})
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Announcement{}, "Classes", &domain.AnnouncementClass{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.AnnouncementClass{})
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Post{}, "Users", &domain.PostUser{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.PostUser{})
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Comment{}, "Users", &domain.CommentUser{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.CommentUser{})
	if err != nil {
		panic(err)
	}

	err = initDB.SetupJoinTable(&domain.Exam{}, "Questions", &domain.ExamQuestion{})
	if err != nil {
		panic(err)
	}
	err = initDB.AutoMigrate(&domain.ExamQuestion{})
	if err != nil {
		panic(err)
	}
}

// openDB 连接db
func openDB() {
	mysqlConf := config.GetGlobalConf().DbConfig
	connArgs := fmt.Sprintf("%s:%s@(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", mysqlConf.User,
		mysqlConf.Password, mysqlConf.Host, mysqlConf.Port, mysqlConf.Dbname)
	// log.Info("mdb addr:" + connArgs)

	var err error
	db, err = gorm.Open(mysql.Open(connArgs), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	sqlDB, err := db.DB()
	if err != nil {
		panic("fetch db connection err:" + err.Error())
	}

	sqlDB.SetMaxIdleConns(mysqlConf.MaxIdleConn)                                        //设置最大空闲连接
	sqlDB.SetMaxOpenConns(mysqlConf.MaxOpenConn)                                        //设置最大打开的连接
	sqlDB.SetConnMaxLifetime(time.Duration(mysqlConf.MaxIdleTime * int64(time.Second))) //设置空闲时间为(s)
}

// GetDB 获取数据库连接
func GetDB() *gorm.DB {
	dbOnce.Do(openDB)
	return db
}
