package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

const (
	_ = iota
	Admin
	Teacher
	Student
)

type Auth struct {
	gorm.Model
	Username string
	Secret   string
	Role     uint
}

func CreateAuth(username string, secret string, role uint) (*Auth, error) {
	auth := Auth{
		Username: username,
		Secret:   secret,
		Role:     role,
	}
	if err := db.Create(&auth).Error; err != nil {
		return nil, errors.New("创建登录信息失败")
	}
	return &auth, nil
}
