package service

import (
	"errors"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
)

func GetUserBySession(c *gin.Context) (*domain.User, error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	u, ok := user.(domain.User)
	if !ok {
		return nil, errors.New("cannot turn interface into User")
	}
	return &u, nil
}

// Register 用户注册
func Register(req *constant.RegisterRequest) error {
	if req.UserName == "" || req.Password == "" || req.Email == "" || req.Identity == "" {
		return errors.New(fmt.Sprintf("register param invalid"))
	}
	existedUser, _ := persistence.GetUserByEmail(req.Email)

	if existedUser != nil {
		return errors.New(fmt.Sprintf("用户已经注册，不能重复注册"))
	}

	user := &domain.User{
		Name:     req.UserName,
		Password: req.Password,
		Email:    req.Email,
		Identity: req.Identity,
		School:   &req.School,
		Profile:  nil,
	}
	if err := persistence.InsertUser(user); err != nil {
		return errors.New(fmt.Sprintf("register|%v", err))
	}
	return nil
}

// Login 用户登陆
func Login(c *gin.Context, req *constant.LoginRequest) error {
	email := req.Email

	user, err := persistence.GetUserByEmail(email)
	if err != nil {
		return errors.New(fmt.Sprintf("login|%v", err))
	}

	if user == nil {
		return errors.New(fmt.Sprintf("login|user is not exit"))
	}
	if req.PassWord != user.Password {
		return errors.New(fmt.Sprintf("login|password is not correct"))
	}

	session := sessions.Default(c)
	session.Set(constant.UserSession, user)
	err = session.Save()
	if err != nil {
		return errors.New(fmt.Sprintf("login|SetSessionInfo fail:%v", err))
	}

	return nil
}

func GetUserInfo(c *gin.Context) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	data, err = persistence.GetUserInfo(&domain.User{
		ID: user.(domain.User).ID,
	})
	return
}

func UpdateInfo(c *gin.Context, r *constant.InfoRequest) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	err = persistence.UpdateUser(&domain.User{
		ID:     user.(domain.User).ID,
		Name:   r.UserName,
		School: &r.School,
	})
	return
}

func GetNotice(c *gin.Context) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	data, err = persistence.GetNotification(&domain.User{
		ID: user.(domain.User).ID,
	})
	return
}
