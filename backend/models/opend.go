package models

import (
	"github.com/jinzhu/gorm"
)

type Opend struct {
	gorm.Model
	CourseID  uint
	BuID      uint
	TermID    uint
	Num       uint
	Time      string
	Classroom string
}
