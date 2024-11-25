package domain

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

type Option struct {
	Text      string `json:"text"`
	IsCorrect bool   `json:"IsCorrect"`
}

type Options struct {
	Ops []Option `json:"Options" gorm:"options"`
}

// Value 对题目插入选项时将选项字段序列化
func (o Options) Value() (driver.Value, error) {
	return json.Marshal(o)
}

// Scan 查询题目选项时将字段反序列化
func (o *Options) Scan(value interface{}) error {
	err := json.Unmarshal(value.([]byte), o)
	return err
}

// Question 题目
type Question struct {
	ID       uint      `gorm:"primary_key"`
	Created  time.Time `gorm:"column:created;autoCreateTime"`
	Updated  time.Time `gorm:"column:updated;autoUpdateTime"`
	Name     *string
	Subject  *string
	Section  *string
	Course   *string
	Type     *string
	IsPublic bool
	Options  Options `gorm:"column:options;type:json"`
	UserID   uint
	User     User `gorm:"constraint:OnDelete:CASCADE;"`
}

// Exam 试卷
type Exam struct {
	ID        uint      `gorm:"primary_key"`
	Created   time.Time `gorm:"column:created;autoCreateTime"`
	Updated   time.Time `gorm:"column:updated;autoUpdateTime"`
	Name      *string
	UserID    uint
	User      User       `gorm:"constraint:OnDelete:CASCADE;"`
	Questions []Question `gorm:"many2many:exam_questions;constraint:OnDelete:CASCADE;"`
}

// ExamQuestion 试卷题目连接表
type ExamQuestion struct {
	ExamID     uint     `gorm:"primaryKey"`
	Exam       Exam     `gorm:"foreignKey:ID;references:ExamID;constraint:OnDelete:CASCADE;"`
	QuestionID uint     `gorm:"primaryKey"`
	Question   Question `gorm:"foreignKey:ID;references:QuestionID;constraint:OnDelete:CASCADE;"`
}
