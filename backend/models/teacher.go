package models

import (
	"github.com/jinzhu/gorm"
)

type Teacher struct {
	gorm.Model
	BasicUserID uint `gorm:"not null"`
	Level       string
	Salary      uint
}
