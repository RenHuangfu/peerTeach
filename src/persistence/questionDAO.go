package persistence

import (
	"peerTeach/domain"
	"peerTeach/util"
)

// InsertQuestion 插入问题
func InsertQuestion(q *domain.Question) (err error) {
	db = util.GetDB()
	err = db.Create(q).Error
	return err
}

// DeleteQuestion 删除题目
func DeleteQuestion(q *domain.Question) (err error) {
	db = util.GetDB()
	err = db.Delete(q).Error
	return err
}
