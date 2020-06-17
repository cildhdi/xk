package models

import (
	"github.com/jinzhu/gorm"
)

type Course struct {
	gorm.Model
	Name      string
	AcademyID uint
	Credit    uint
	Hour      uint
}
