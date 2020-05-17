package config

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

var (
	Database   = "postgres"
	DbHost     = "localhost"
	DbPort     = 5432
	DbSSLMode  = "disable"
	DbUser     = ""
	DbName     = ""
	DbPassword = ""
)

func init() {
	if gin.Mode() == gin.ReleaseMode {
		DbHost = "pg"
	}

	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
	DbUser = viper.GetString("POSTGRES_USER")
	DbPassword = viper.GetString("POSTGRES_PASSWORD")
	DbName = viper.GetString("POSTGRES_DB")

	fmt.Printf(`
	Please check config variables:
		Database   = %s
		DbHost     = %s
		DbPort     = %d
		DbSSLMode  = %s
		DbUser     = %s
		DbName     = %s
		DbPassword = %s
	service will start after 10 seconds...
	`, Database, DbHost, DbPort, DbSSLMode, DbUser, DbName, DbPassword)

	time.Sleep(time.Second * 10)
}
