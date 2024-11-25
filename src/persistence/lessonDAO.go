package persistence

import (
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
