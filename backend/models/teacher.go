package models

import (
	"github.com/jinzhu/gorm"
)

type Teacher struct {
	gorm.Model
	BasicUserID uint
	AcademyID   uint
	Level       string
	Salary      uint
}
