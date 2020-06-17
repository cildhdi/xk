package models

import (
	"github.com/jinzhu/gorm"
)

type Academy struct {
	gorm.Model
	Name  string `gorm:"unique;not null"`
	Addr  string
	Phone string
}
