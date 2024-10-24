package domain

import "gorm.io/gorm"

// User 用户
type User struct {
	gorm.Model
	Password         string
	Name             string
	Profile          string
	School           string
	Email            string
	Identity         string
	SecurityQuestion string
	SecurityAnswer   string
	ClassID          uint
}
