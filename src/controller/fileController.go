package controller

import (
	"github.com/gin-gonic/gin"
	"peerTeach/service"
	"peerTeach/util"
)

// UploadFile 上传文件
func UploadFile(c *gin.Context) {
	rsp := &service.HttpResponse{}
	_, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		rsp.ResponseError(c, 10008, "")
		return
	}

	err = util.UploadFile(fileHeader)
	if err != nil {
		rsp.ResponseError(c, 10008, "")
		return
	}

	rsp.ResponseWithData(c, nil)
}
