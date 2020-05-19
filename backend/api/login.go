package api

import (
	"log"
	"net/http"
	"strings"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/cildhdi/xk/backend/models"
	"github.com/cildhdi/xk/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

var (
	AuthMiddleware *jwt.GinJWTMiddleware
	usernameKey    = "un"
	roleKey        = "role"
)

type loginParam struct {
	Username string `binding:"required"`
	Secret   string `binding:"required"`
}

func init() {
	var err error
	AuthMiddleware, err = jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "test zone",          // for test
		Key:         []byte("secret key"), // for test
		Timeout:     time.Hour * 24,
		MaxRefresh:  time.Hour * 24,
		IdentityKey: usernameKey,
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(*models.BasicUser); ok {
				return jwt.MapClaims{
					usernameKey: v.Username,
					roleKey:     v.Role,
				}
			}
			return jwt.MapClaims{}
		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			return &models.BasicUser{
				Username: claims[usernameKey].(string),
				Role:     claims[roleKey].(string),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var param loginParam
			if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
				return "", jwt.ErrMissingLoginValues
			}

			basicUser := models.BasicUser{}
			models.Db().Model(&models.BasicUser{}).Where("username=? and secret=?", param.Username, param.Secret).First(&basicUser)
			basicUser.Secret = ""
			if basicUser.ID != 0 {
				c.Set("bu", &basicUser)
				return &basicUser, nil
			}
			return nil, jwt.ErrFailedAuthentication
		},
		Authorizator: func(data interface{}, c *gin.Context) bool {
			if v, ok := data.(*models.BasicUser); ok {
				roleIndex := strings.LastIndex(c.Request.URL.Path, v.Role)
				bracIndex := strings.LastIndex(c.Request.URL.Path, "[")
				return roleIndex > bracIndex
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			util.Error(c, util.Unauthorized, message)
		},
		LoginResponse: func(c *gin.Context, code int, token string, expire time.Time) {
			util.Success(c, gin.H{
				"code":   http.StatusOK,
				"token":  token,
				"expire": expire.Format(time.RFC3339),
				"bu":     c.MustGet("bu"),
			})
		},
		TokenLookup:   "header: Authorization",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}
}
