package models

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	//postgres
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/cildhdi/xk/backend/config"
)

var db *gorm.DB

func connect() (err error) {
	db, err = gorm.Open(config.Database,
		fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=%s",
			config.DbHost, config.DbPort, config.DbUser,
			config.DbName, config.DbPassword, config.DbSSLMode))
	return
}

func init() {
	err := connect()
	for err != nil {
		fmt.Println("connect to database failed:", err.Error(), ", wait for 10 seconds...")
		time.Sleep(10 * time.Second)
		err = connect()
	}
	fmt.Println("connected to database")

	//migrates
	db.AutoMigrate(&BasicUser{}, &Admin{}, &Teacher{}, &Student{}, &Academy{})
}

//Db gorm.DB
func Db() *gorm.DB {
	return db
}
