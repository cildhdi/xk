package api

import (
	"github.com/cildhdi/xk/backend/models"
	"github.com/cildhdi/xk/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type cuTermParam struct {
	Name   string `binding:"required"`
	Status uint
}

func CuTerm(ctx *gin.Context) {
	param := cuTermParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.Error(ctx, util.ParamError, err.Error())
		return
	}
	term := models.Term{}
	models.Db().Where("name=?", param.Name).First(&term)
	if param.Status == 0 {
		param.Status = 1
	}
	if term.ID == 0 {
		newTerm := models.Term{
			Name:   param.Name,
			Status: param.Status,
		}
		models.Db().Create(&newTerm)
		util.Success(ctx, newTerm)
	} else {
		models.Db().Model(&term).Update("status", param.Status)
		util.Success(ctx, nil)
	}
}

func Terms(ctx *gin.Context) {
	terms := []models.Term{}
	models.Db().Find(&terms)
	util.Success(ctx, &terms)
}
