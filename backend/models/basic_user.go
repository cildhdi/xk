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
	Username   string
	Secret     string
	Role       string
	Name       string
	Sex        string
	Birthday   string
	Birthplace string
}
