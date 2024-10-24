package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
	"peerTeach/service"
)

func ViewResource(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.TeacherResourcePath,
	}
	req.ResponseWithHtml(c)
}

func ViewPaperDetail(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.TeacherPaperPath,
	}
	req.ResponseWithHtml(c)
}

func PostResource(c *gin.Context) {
	req := &constant.ResourceRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetPaper.IsRequest {
		data, err := service.GetPaper(c)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.GetQuestion.IsRequest {
		data, err := service.GetQuestion(c, req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.GetGlobalQuestion.IsRequest {
		data, err := service.GetGlobalQuestion(req)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.CreatePaper.IsRequest {
		data, err := service.InsertPaper(c, &req.CreatePaper)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.CreateQuestion.IsRequest {
		data, err := service.InsertQuestion(c, &req.CreateQuestion)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.DeletePaper.IsRequest {
		err := persistence.DeleteExam(&domain.Exam{
			ID: req.DeletePaper.PaperID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.DeleteQuestion.IsRequest {
		err := persistence.DeleteQuestion(&domain.Question{
			ID: req.DeleteQuestion.QuestionID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}

func PostResourceDetail(c *gin.Context) {
	req := &constant.ResourceDetailRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		rsp.ResponseError(c, service.CodeLoginErr, err.Error())
		return
	}
	if req.GetPaperDetail.IsRequest {
		data, err := persistence.GetPaperDetail(&domain.Exam{
			ID: req.GetPaperDetail.PaperID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.GetQuestionDetail.IsRequest {
		data, err := persistence.GetQuestionDetail(&domain.Question{
			ID: req.GetQuestionDetail.QuestionID,
		})
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.UpdatePaper.IsRequest {
		err := service.UpdatePaper(c, &req.UpdatePaper)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.UpdateQuestion.IsRequest {
		err := service.UpdateQuestion(c, &req.UpdateQuestion)
		if err != nil {
			rsp.ResponseError(c, service.CodeLoginErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
