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
	apiRouter.GET("/status[sat]", statusApi.GinHandler)
	router.Run()
}
