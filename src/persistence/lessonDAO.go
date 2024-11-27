package persistence

import (
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/util"
	"sync"
)

var Lessons sync.Map

func IsLessonExist(l *domain.Lesson) (exist bool, err error) {
	db = util.GetDB()
	err = db.Raw("select IF(count(l.id) = 0,false,true) as exist"+
		"from lessons as l where l.id = ?", l.ID).Scan(&exist).Error
	return
}

func GetAnswerRecordLesson(l *domain.Lesson) (la *constant.LessonAnswerRecord, err error) {
	db = util.GetDB()
	la = &constant.LessonAnswerRecord{
		QuestionAnswerRecord: make([]*constant.QuestionAnswerRecord, 10),
	}
	tx := db.Begin()
	err = tx.Raw("select exam_id as paper_id from lessons where id = ?", l.ID).Scan(&la.PaperID).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = tx.Raw("select count(class_users.user_id) as lesson_member_num "+
		"from (select lessons.class_id as class_id from lessons where lessons.id = ?) as lci "+
		"join class_users on class_users.class_id = lci.class_id ", l.ID).Scan(&la.LessonMemberNum).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = tx.Raw("select ar.correct_num, ar.option_num from"+
		" answer_records as ar where ar.lesson_id = ?", l.ID).Scan(&la.QuestionAnswerRecord).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return
}

func GetAnswerRecordExam(p *domain.Exam) (la []*constant.LessonAnswerRecord, err error) {
	db = util.GetDB()
	lid := make([]uint, 10)
	err = db.Raw("select lessons.id from lessons where lessons.exam_id = ? ", p.ID).Scan(&lid).Error
	if err != nil {
		return nil, err
	}
	la = make([]*constant.LessonAnswerRecord, len(lid))
	for k, v := range lid {
		la[k], err = GetAnswerRecordLesson(&domain.Lesson{
			ID: v,
		})
		if err != nil {
			return nil, err
		}
	}
	return
}

func GetAnswerRecordClass(c *domain.Class) (la []*constant.LessonAnswerRecord, err error) {
	db = util.GetDB()
	lid := make([]uint, 10)
	err = db.Raw("select lessons.id from lessons where lessons.class_id = ? ", c.ID).Scan(&lid).Error
	if err != nil {
		return nil, err
	}
	la = make([]*constant.LessonAnswerRecord, len(lid))
	for k, v := range lid {
		la[k], err = GetAnswerRecordLesson(&domain.Lesson{
			ID: v,
		})
		if err != nil {
			return nil, err
		}
	}
	return
}
