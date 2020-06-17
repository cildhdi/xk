package models

import (
	"github.com/jinzhu/gorm"
)

type Elective struct {
	gorm.Model
	OpendID    uint
	BuID       uint
	UsualScore uint
	ExamScore  uint
	TotalScore uint
}
