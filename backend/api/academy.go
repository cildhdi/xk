package api

import (
	"github.com/cildhdi/xk/backend/models"
	"github.com/cildhdi/xk/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type cuAcademyParam struct {
	Name  string `binding:"required"`
	Addr  string
	Phone string
}

func CuAcademy(ctx *gin.Context) {
	param := cuAcademyParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.Error(ctx, util.ParamError, err.Error())
		return
	}
	academy := models.Academy{}
	models.Db().Where("name=?", param.Name).First(&academy)
	if academy.ID == 0 {
		newAcademy := models.Academy{
			Name:  param.Name,
			Addr:  param.Addr,
			Phone: param.Phone,
		}
		models.Db().Create(&newAcademy)
		util.Success(ctx, newAcademy)
	} else {
		models.Db().Model(&academy).Updates(models.Academy{Addr: param.Addr, Phone: param.Phone})
		util.Success(ctx, nil)
	}
}

func Academys(ctx *gin.Context) {
	academys := []models.Academy{}
	models.Db().Find(&academys)
	util.Success(ctx, &academys)
}
