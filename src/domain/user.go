package domain

import (
	"encoding/gob"
)

// User 用户
type User struct {
	ID       uint `gorm:"primary_key" json:"id"`
	Password string
	Name     string `json:"name"`
	Email    string `gorm:"unique,not null"`
	Identity string
	Profile  *string
	School   *string
}

func init() {
	gob.Register(User{})
}
