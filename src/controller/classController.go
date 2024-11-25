package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
	"peerTeach/service"
)

func ViewClass(c *gin.Context) {
	ClassPath, err := service.GetClassPath(c)
	if err != nil {
		req := service.HttpResponse{}
		req.ResponseError(c, 10008, "")
		return
	}
	req := service.HttpResponse{
		HtmlPath: ClassPath,
	}
	req.ResponseWithHtml(c)
}

func PostClass(c *gin.Context) {
	req := &constant.ClassRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetLesson.IsRequest {
		classrooms, err := persistence.GetLesson(&domain.Class{
			ID: req.GetLesson.ClassID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, classrooms)
	} else if req.GetMember.IsRequest {
		students, err := persistence.GetStudents(&domain.Class{
			ID: req.GetMember.ClassID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, students)
	} else if req.DeleteStudent.IsRequest {
		err = persistence.DeleteStudent(&domain.Class{
			ID: req.DeleteStudent.ClassID,
		}, &domain.User{
			ID: req.DeleteStudent.UserID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, nil)
	} else if req.GetPost.IsRequest {
		data, err := service.GetPostResAll(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.CreatePost.IsRequest { //
		data, err := service.CreatePost(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, struct {
			PostID uint `json:"post_id"`
		}{
			PostID: data.ID,
		})
	} else if req.GetAnnouncement.IsRequest {
		announcements, err := persistence.GetAnnouncement(&domain.Class{
			ID: req.GetAnnouncement.ClassID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, announcements)
	} else if req.CreateAnnouncement.IsRequest { //
		data, err := service.CreateAnnouncement(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, struct {
			AnnouncementID uint `json:"announcement_id"`
		}{
			AnnouncementID: data.ID,
		})
	} else if req.DeleteAnnouncement.IsRequest {
		err = persistence.DeleteAnnouncement(&domain.Announcement{
			ID: req.DeleteAnnouncement.AnnouncementID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, "")
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
