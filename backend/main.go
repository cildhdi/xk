package main

import (
	statusApi "github.com/appleboy/gin-status-api"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	apiRouter := router.Group("/api")
	apiRouter.GET("/status[ats]", statusApi.GinHandler)
	router.Run()
}
