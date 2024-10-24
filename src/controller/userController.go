package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
	"peerTeach/constant"
	"peerTeach/service"
)

func ViewManager(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.ManagerPath,
	}
	req.ResponseWithHtml(c)
}

func ViewLogin(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.LoginPath,
	}
	req.ResponseWithHtml(c)
}

func ViewRegister(c *gin.Context) {
	req := service.HttpResponse{
		HtmlPath: config.RegisterPath,
	}
	req.ResponseWithHtml(c)
}

func ViewInfo(c *gin.Context) {
	InfoPath, err := service.GetInfoPath(c)
	if err != nil {
		req := service.HttpResponse{}
		req.ResponseError(c, 10008, "")
		return
	}
	req := service.HttpResponse{
		HtmlPath: InfoPath,
	}
	req.ResponseWithHtml(c)
}

func Login(c *gin.Context) {
	req := &constant.LoginRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}

	err = service.Login(c, req)
	if err != nil {
		rsp.ResponseError(c, service.CodeLoginErr, err.Error())
		return
	}
	rsp.ResponseNoContentSuccess(c)
}

func Register(c *gin.Context) {
	req := &constant.RegisterRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}

	err = service.Register(req)
	if err != nil {
		fmt.Println(err)
		rsp.ResponseError(c, service.CodeRegisterErr, err.Error())
		return
	}
	rsp.ResponseNoContentSuccess(c)
}

func PostInfo(c *gin.Context) {
	req := &constant.InfoRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.Request == "get" {
		data, err := service.GetUserInfo(c)
		if err != nil {
			fmt.Println(err)
			rsp.ResponseError(c, service.CodeRegisterErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.Request == "update" {
		err = service.UpdateInfo(c, req)
		if err != nil {
			fmt.Println(err)
			rsp.ResponseError(c, service.CodeRegisterErr, err.Error())
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
