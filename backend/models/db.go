package models

import (
	"crypto/md5"
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
	db.AutoMigrate(&BasicUser{}, &Teacher{}, &Academy{})

	//check
	adminCount := 0
	db.Model(&BasicUser{}).Where("role=?", RAdmin).Count(&adminCount)
	if adminCount == 0 {
		adminRawPswwd := []byte(config.AdminPw)
		md5bytes := md5.Sum(adminRawPswwd)
		bu := BasicUser{
			Username: config.AdminUn,
			Secret:   fmt.Sprintf("%x", md5bytes),
			Role:     RAdmin,
			Name:     "杨磊",
			Sex:      "男",
		}
		db.Create(&bu)
		if bu.ID != 0 {
			fmt.Println("create admin successfully")
		} else {
			fmt.Println("failed to create admin")
		}
	}
}

//Db gorm.DB
func Db() *gorm.DB {
	return db
}
