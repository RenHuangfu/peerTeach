package service

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
)

// GetCoursePath 获取课程html资源路径
func GetCoursePath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentCoursePath, nil
	case "teacher":
		return config.TeacherCoursePath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}

func GetClassPath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentClassPath, nil
	case "teacher":
		return config.TeacherClassPath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}

func GetAnnouncementDetailPath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentAnnouncementDetailPath, nil
	case "teacher":
		return config.TeacherAnnouncementDetailPath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}

func GetPostDetailPath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentPostDetailPath, nil
	case "teacher":
		return config.TeacherPostDetailPath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}

func GetInfoPath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentInfoPath, nil
	case "teacher":
		return config.TeacherInfoPath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}

func GetNoticePath(c *gin.Context) (string, error) {
	u, err := GetUserBySession(c)
	if err != nil {
		return "", err
	}
	switch u.Identity {
	case "student":
		return config.StudentNoticePath, nil
	case "teacher":
		return config.TeacherNoticePath, nil
	default:
		return "", errors.New(fmt.Sprintf("identity is valid"))
	}
}
