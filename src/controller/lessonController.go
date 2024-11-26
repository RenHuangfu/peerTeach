package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
	"peerTeach/constant"
	"peerTeach/domain"
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

func AtLessonWebsocket(c *gin.Context) {
	u, err := service.GetUserBySession(c)
	if err != nil {
		fmt.Println(err)
		return
	}
	if u.Identity == "teacher" {
		_ = service.BeginLesson(c)
		return
	} else {
		_ = service.EnterIntoLesson(c)
		return
	}
}

func PostAfterLesson(c *gin.Context) {
	req := &constant.AfterLessonRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.LessonAnswerRecord.IsRequest {
		data, err := persistence.GetAnswerRecordLesson(&domain.Lesson{
			ID: req.LessonAnswerRecord.LessonID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, data)
	} else if req.ClassAnswerRecord.IsRequest {
		data, err := persistence.GetAnswerRecordClass(&domain.Class{
			ID: req.ClassAnswerRecord.ClassID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, data)
	} else if req.PaperAnswerRecord.IsRequest {
		data, err := persistence.GetAnswerRecordExam(&domain.Exam{
			ID: req.PaperAnswerRecord.PaperID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, data)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
