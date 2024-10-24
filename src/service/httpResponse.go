package service

import (
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
)

const (
	CodeSuccess     ErrCode = 0     // http请求成功
	CodeBodyBindErr ErrCode = 10001 // 参数绑定错误
	CodeParamErr    ErrCode = 10002 // 请求参数不合法
	CodeLoginErr    ErrCode = 10003
	CodeRegisterErr ErrCode = 10004
)

type (
	DebugType int // debug类型
	ErrCode   int // 错误码
)

// HttpResponse http独立请求返回结构体
type HttpResponse struct {
	Code     ErrCode     `json:"code"`
	Msg      string      `json:"msg"`
	Data     interface{} `json:"data"`
	HtmlPath string
}

// ResponseInternalServerError 服务器内部-错误
func (rsp *HttpResponse) ResponseInternalServerError(c *gin.Context, code ErrCode, msg string) {
	rsp.Code = code
	rsp.Msg = msg
	c.JSON(http.StatusInternalServerError, rsp)
}

// ResponseError 客户端请求错误
func (rsp *HttpResponse) ResponseError(c *gin.Context, code ErrCode, msg string) {
	rsp.Code = code
	rsp.Msg = msg
	c.JSON(http.StatusBadRequest, rsp)
}

// ResponseNoContentSuccess 无返回内容-成功
func (rsp *HttpResponse) ResponseNoContentSuccess(c *gin.Context) {
	rsp.Code = CodeSuccess
	rsp.Msg = "success"
	c.JSON(http.StatusNoContent, rsp)
}

// ResponseWithData 返回内容-成功
func (rsp *HttpResponse) ResponseWithData(c *gin.Context, data interface{}) {
	rsp.Code = CodeSuccess
	rsp.Msg = "success"
	rsp.Data = data
	c.JSON(http.StatusOK, rsp)
}

// ResponseWithHtml 返回html资源
func (rsp *HttpResponse) ResponseWithHtml(c *gin.Context) {
	t, err := template.ParseFiles(rsp.HtmlPath)
	if err != nil {
		panic(err)
	}
	err = t.Execute(c.Writer, nil)
	if err != nil {
		panic(err)
	}
}
