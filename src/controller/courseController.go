package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/service"
)

func ViewCourse(c *gin.Context) {
	coursePath, err := service.GetCoursePath(c)
	if err != nil {
		req := service.HttpResponse{}
		req.ResponseError(c, 10008, "")
		return
	}
	req := service.HttpResponse{
		HtmlPath: coursePath,
	}
	req.ResponseWithHtml(c)
}

func PostCourse(c *gin.Context) {
	rsp := &service.HttpResponse{}
	u, err := service.GetUserBySession(c)
	if err != nil {
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	switch u.Identity {
	case "student":
		StudentPostCourse(c)
	case "teacher":
		TeacherPostCourse(c)
	default:
		rsp.ResponseError(c, service.CodeBodyBindErr, "identity is valid")
	}
}

func TeacherPostCourse(c *gin.Context) {
	req := &constant.CourseRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetCourse.IsRequest {
		data, err := service.TeacherGetCourse(c)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.DeleteCourse.IsRequest {
		err = service.TeacherDeleteCourse(req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.DeleteClass.IsRequest {
		err = service.TeacherDeleteClass(req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.EditCourse.IsRequest {
		err = service.TeacherEditCourse(req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.CreateCourse.IsRequest {
		data, err := service.TeacherCreateCourse(c, req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.CreateClass.IsRequest {
		data, err := service.TeacherCreateClass(req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.GroupAnnounce.IsRequest {
		data, err := service.TeacherGroupAnnounce(c, req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}

func StudentPostCourse(c *gin.Context) {
	req := &constant.CourseRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetCourse.IsRequest {
		data, err := service.StudentGetCourse(c)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.EnterClass.IsRequest {
		data, err := service.StudentEnterClass(c, req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.ExitClass.IsRequest {
		fmt.Println(req.ExitClass.ClassID)
		err = service.StudentExitClass(c, req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
