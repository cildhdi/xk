package api

import (
	"github.com/cildhdi/xk/backend/models"
	"github.com/cildhdi/xk/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type cuCourseParam struct {
	Name      string `binding:"required"`
	AcademyID uint
	Credit    uint
	Hour      uint
}

func CuCourse(ctx *gin.Context) {
	param := cuCourseParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.Error(ctx, util.ParamError, err.Error())
		return
	}
	course := models.Course{}
	models.Db().Where("name=?", param.Name).First(&course)
	if course.ID == 0 {
		newCourse := models.Course{
			Name:      param.Name,
			AcademyID: param.AcademyID,
			Credit:    param.Credit,
			Hour:      param.Hour,
		}
		models.Db().Create(&newCourse)
		util.Success(ctx, newCourse)
	} else {
		models.Db().Model(&course).Updates(models.Course{
			AcademyID: param.AcademyID,
			Credit:    param.Credit,
			Hour:      param.Hour,
		})
		util.Success(ctx, nil)
	}
}

func Courses(ctx *gin.Context) {
	courses := []models.Course{}
	models.Db().Find(&courses)
	util.Success(ctx, &courses)
}
