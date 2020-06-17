package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// code
const (
	Ok = iota
	ParamError
	DatabaseError
	Unauthorized
)

// Response 响应
type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func response(ctx *gin.Context, code int, msg string, data interface{}) {
	if code == Ok {
		msg = "success"
	}
	ctx.AbortWithStatusJSON(http.StatusOK, Response{
		Code: code,
		Msg:  msg,
		Data: data,
	})
}

//Success 响应成功
func Success(ctx *gin.Context, data interface{}) {
	response(ctx, Ok, "", data)
}

//Error 响应错误
func Error(ctx *gin.Context, code int, msg string) {
	response(ctx, code, msg, nil)
}
