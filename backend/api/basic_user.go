package api

import (
	"github.com/cildhdi/xk/backend/models"
	"github.com/cildhdi/xk/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jinzhu/gorm"
)

func BasicInfo(ctx *gin.Context) {
	util.Success(ctx, ctx.MustGet("user"))
}

type registerUserParam struct {
	users []struct {
		Username   string `binding:"required"`
		Secret     string `binding:"required"`
		Role       string `binding:"required,oneof=a s t"`
		Name       string `binding:"required"`
		Sex        string `binding:"required,oneof=男 女"`
		Birthday   string `binding:"required"`
		Birthplace string `binding:"required"`
		AcademyID  uint   `binding:"required"`
		// for teacher
		Level  string
		Salary uint
	} `binding:"required,dive,required"`
}

func CuBasicUsers(ctx *gin.Context) {
	param := registerUserParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.Error(ctx, util.ParamError, err.Error())
		return
	}

	if err := models.Db().Transaction(func(tx *gorm.DB) error {
		for _, user := range param.users {
			bu := models.BasicUser{
				Username:   user.Username,
				Secret:     user.Secret,
				Role:       user.Role,
				Name:       user.Name,
				Sex:        user.Sex,
				Birthday:   user.Birthday,
				Birthplace: user.Birthplace,
				AcademyID:  user.AcademyID,
			}
			findBu := models.BasicUser{}
			tx.Where("username=?", user.Username).First(&findBu)
			var targetBuID uint = 0
			if findBu.ID == 0 {
				if err := tx.Create(&bu).Error; err != nil {
					return err
				}
				targetBuID = bu.ID
			} else {
				if err := tx.Model(&findBu).Updates(bu).Error; err != nil {
					return err
				}
				targetBuID = findBu.ID
			}
			if user.Role == models.RTeacher {
				teacher := models.Teacher{
					BasicUserID: targetBuID,
					Level:       user.Level,
					Salary:      user.Salary,
				}
				if err := tx.Create(&teacher).Error; err != nil {
					return err
				}
			}
		}
		return nil
	}); err != nil {
		util.Error(ctx, util.DatabaseError, err.Error())
	}
	util.Success(ctx, nil)
}

func Users(ctx *gin.Context) {
	users := []models.BasicUser{}
	models.Db().Find(&users)
	util.Success(ctx, &users)
}
