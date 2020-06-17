package main

import (
	"github.com/cildhdi/xk/backend/api"

	statusApi "github.com/appleboy/gin-status-api"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	apiRouter := router.Group("/api")
	apiRouter.POST("/login", api.AuthMiddleware.LoginHandler)
	apiRouter.Use(api.AuthMiddleware.MiddlewareFunc())
	apiRouter.GET("/status[ast]", statusApi.GinHandler)

	apiRouter.POST("/user[ast]", api.CuBasicUsers)
	apiRouter.GET("/users[ast]", api.Users)

	apiRouter.POST("/term[a]", api.CuTerm)
	apiRouter.GET("/terms[ast]", api.Terms)

	apiRouter.POST("/academy[a]", api.CuAcademy)
	apiRouter.GET("/academys[ast]", api.Academys)

	apiRouter.POST("/course[a]", api.CuCourse)
	apiRouter.GET("/courses[ast]", api.Courses)
	router.Run()
}
