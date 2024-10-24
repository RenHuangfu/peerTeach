package domain

import (
	"gorm.io/gorm"
	"time"
)

// Course 课程
type Course struct {
	gorm.Model
	Name      *string
	TeacherID uint
	Teacher   Teacher `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Class 班级
type Class struct {
	gorm.Model
	Name     *string
	CourseID uint
	Course   Course    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Students []Student `gorm:"many2many:exam_questions;"`
}

// Announcement 公告
type Announcement struct {
	gorm.Model
	Content *string `gorm:"type:text"`
	ClassID uint
	Class   Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// ClassRoom 课堂
type ClassRoom struct {
	gorm.Model
	Name       *string
	SchoolTime time.Time
	ClassID    uint
	Class      Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// ClassStudent 班级学生连接表
type ClassStudent struct {
	ClassID   uint `gorm:"primaryKey"`
	StudentId uint `gorm:"primaryKey"`
}

func (c *Class) AfterDelete(tx *gorm.DB) (err error) {
	err = tx.Where("class_id = ?", c.ID).Delete(&Class{}).Error
	return err
}
