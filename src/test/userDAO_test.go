package test

import (
	"fmt"
	"peerTeach/domain"
	"peerTeach/persistence"
	"testing"
)

var email = "test@gmail.com"

func testClear() {
	err := persistence.DeleteUserByEmail(email)
	if err != nil {
		fmt.Println(err)
	}
}

func TestUserDAO_0(t *testing.T) {
	defer testClear()
	err := persistence.InsertUser(&domain.User{
		Name:     "test0",
		Password: "test0",
		Email:    email,
		Identity: "teacher",
	})
	if err != nil {
		panic(err)
	}
}

func TestUserDAO_1(t *testing.T) {
	defer testClear()
	err := persistence.InsertUser(&domain.User{
		Name:     "test1",
		Password: "test1",
		Email:    email,
		Identity: "student",
	})
	if err != nil {
		panic(err)
	}
}

func TestUserDAO_2(t *testing.T) {
	defer testClear()
	err := persistence.InsertUser(&domain.User{
		Name:     "test2",
		Password: "test2",
		Email:    email,
		Identity: "manager",
	})
	if err != nil {
		panic(err)
	}
}

func TestUserDAO_3(t *testing.T) {
	defer testClear()
	defer func() {
		if err := recover(); err != nil {
			if err == "invalid identity" {
			}
		}
	}()
	err := persistence.InsertUser(&domain.User{
		Name:     "test3",
		Password: "test3",
		Email:    email,
		Identity: "test3",
	})
	if err != nil {
		panic(err)
	}
}

func TestUserDAO_4(t *testing.T) {
	defer testClear()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	err := persistence.InsertUser(&domain.User{
		Name:     "test0",
		Password: "test0",
		Email:    email,
		Identity: "teacher",
	})
	if err != nil {
		panic(err)
	}
	var u *domain.User
	u, err = persistence.GetUserByEmail(email)
	if err != nil {
		panic(err)
	}
	fmt.Println(u)
}

func TestUserDAO_5(t *testing.T) {
	defer testClear()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	err := persistence.InsertUser(&domain.User{
		Name:     "test0",
		Password: "test0",
		Email:    email,
		Identity: "teacher",
	})
	if err != nil {
		panic(err)
	}
	var u *domain.User
	u, err = persistence.GetUserByEmail(email)
	if err != nil {
		panic(err)
	}
	u.Name = "test1"
	err = persistence.UpdateUser(u)
	if err != nil {
		panic(err)
	}
}
