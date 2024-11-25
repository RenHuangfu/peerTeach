package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
	"peerTeach/constant"
	"peerTeach/persistence"
	"peerTeach/service"
	"strconv"
)

func ViewLesson(c *gin.Context) {
	lessonID := c.Param("lessonID")
	id, _ := strconv.Atoi(lessonID)
	lid := uint(id)
	_, ok := persistence.Lessons.Load(lid)
	u, err := service.GetUserBySession(c)
	if err != nil {
		fmt.Println(err)
		return
	}
	if u.Identity == "teacher" {
		req := service.HttpResponse{
			HtmlPath: config.TeacherAfterLessonPath,
		}
		req.ResponseWithHtml(c)
		return
	} else {
		if ok {
			req := service.HttpResponse{
				HtmlPath: config.StudentAtLessonPath,
			}
			req.ResponseWithHtml(c)
			return
		} else {
			req := service.HttpResponse{
				HtmlPath: config.StudentAfterLessonPath,
			}
			req.ResponseWithHtml(c)
			return
		}
	}
}

func ViewBeforeLesson(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.TeacherBeforeLessonPath,
	}
	req.ResponseWithHtml(c)
	return
}

func ViewAtLesson(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.TeacherAtLessonPath,
	}
	req.ResponseWithHtml(c)
	return
}

func PostBeforeLesson(c *gin.Context) {}

func PostAtLesson(c *gin.Context) {
	u, err := service.GetUserBySession(c)
	if err != nil {
		fmt.Println(err)
		return
	}
	if u.Identity == "teacher" {
		TeacherAtLesson(c)
		return
	} else {
		StudentAtLesson(c)
		return
	}
}

func PostAfterLesson(c *gin.Context) {
	u, err := service.GetUserBySession(c)
	if err != nil {
		fmt.Println(err)
		return
	}
	if u.Identity == "teacher" {
		TeacherAfterLesson(c)
		return
	} else {
		StudentAfterLesson(c)
		return
	}
}

func TeacherAtLesson(c *gin.Context) {
	req := &constant.LessonRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.ReadyLesson.IsRequest {

	} else if req.AtLesson.IsRequest {
		err = service.BeginLesson(c, &req.AtLesson)
	}
}

func StudentAtLesson(c *gin.Context) {
	req := &constant.LessonRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.ReadyLesson.IsRequest {

	} else if req.AtLesson.IsRequest {
		err = service.EnterIntoLesson(c, &req.AtLesson)
	}
}

func StudentAfterLesson(c *gin.Context) {}

func TeacherAfterLesson(c *gin.Context) {}
