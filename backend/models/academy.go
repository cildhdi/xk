package models

import (
	"github.com/jinzhu/gorm"
)

type Academy struct {
	gorm.Model
	Name  string
	Addr  string
	Phone string
}
