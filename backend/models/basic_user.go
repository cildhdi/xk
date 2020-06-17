package models

import (
	"github.com/jinzhu/gorm"
)

const (
	RAdmin   = "a"
	RTeacher = "t"
	RStudent = "s"
)

type BasicUser struct {
	gorm.Model
	Username   string `gorm:"unique;not null"`
	Secret     string `gorm:"not null"`
	Role       string `gorm:"not null"`
	Name       string `gorm:"not null"`
	Sex        string `gorm:"not null"`
	Birthday   string `gorm:"not null"`
	Birthplace string `gorm:"not null"`
	AcademyID  uint   `gorm:"not null"`
}
