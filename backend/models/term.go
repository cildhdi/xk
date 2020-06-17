package models

import (
	"github.com/jinzhu/gorm"
)

type Term struct {
	gorm.Model
	Name   string `gorm:"not null"`
	Status uint   `gorm:"not null"`
}
