package models

import (
	"github.com/jinzhu/gorm"
)

type Student struct {
	gorm.Model
	BasicUserID uint
	AcademyID   uint
}
