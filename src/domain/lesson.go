package domain

import (
	"database/sql/driver"
	"strings"
	"time"
)

// Lesson 课堂
type Lesson struct {
	ID      uint      `gorm:"primary_key"`
	Created time.Time `gorm:"column:created;autoCreateTime"`
	Name    *string   `json:"name"`
	ExamID  uint
	PPTName *string
	ClassID uint
	Class   Class `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type AnswerOption []string

// AnswerRecord 答题记录
type AnswerRecord struct {
	ID         uint      `gorm:"primary_key"`
	Created    time.Time `gorm:"column:created;autoCreateTime"`
	CorrectNum uint
	OptionNum  AnswerOption
	LessonID   uint
	Lesson     Lesson `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (a *AnswerOption) Scan(val interface{}) error {
	s := val.([]uint8)
	ss := strings.Split(string(s), "|")
	*a = ss
	return nil
}

func (a AnswerOption) Value() (driver.Value, error) {
	str := strings.Join(a, "|")
	return str, nil
}
