package persistence

import (
	"peerTeach/domain"
	"peerTeach/util"
)

// InsertCourse 插入课程
func InsertCourse(c *domain.Course) (err error) {
	db = util.GetDB()
	err = db.Create(c).Error
	return err
}

// DeleteCourse 删除课程
func DeleteCourse(c *domain.Course) (err error) {
	db = util.GetDB()
	err = db.Delete(c).Error
	return err
}

// GetCourse 获取某位老师的所有课程
func GetCourse(t *domain.Teacher) (course []*domain.Course, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Course{}).Where("teacher_id = ?", t.ID).Find(&course).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return course, err
}

// InsertClass 插入班级
func InsertClass(c *domain.Class) (err error) {
	db = util.GetDB()
	err = db.Create(c).Error
	return err
}

// GetClass 获取课程下面所有班级
func GetClass(c *domain.Course) (class []*domain.Class, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Class{}).Where("course_id = ?", c.ID).Find(&class).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return class, err
}

// InsertStudents 对班级插入学生
func InsertStudents(c *domain.Class, students []*domain.Student) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	for _, s := range students {
		err = tx.Model(domain.ClassStudent{}).Create(&domain.ClassStudent{
			ClassID:   c.ID,
			StudentId: s.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return err
}

// DeleteStudent 删除班级里某个学生
func DeleteStudent(c *domain.Class, s *domain.Student) (err error) {
	db = util.GetDB()
	err = db.Model(domain.ClassStudent{}).Where("student_id = ?", s.ID).Delete(s).Error
	return err
}

// GetStudents 获取班级里的所有学生
func GetStudents(c *domain.Class) (students []*domain.Student, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.ClassStudent{}).Where("class_id = ?", c.ID).Find(&students).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return students, err
}

// DeleteClass 删除班级
func DeleteClass(c *domain.Class) (err error) {
	db = util.GetDB()
	err = db.Delete(c).Error
	return err
}

// InsertClassRoom 插入课堂
func InsertClassRoom(c *domain.ClassRoom) (err error) {
	db = util.GetDB()
	err = db.Create(c).Error
	return err
}

// GetClassRoom 获取班级下所有课堂
func GetClassRoom(c *domain.ClassRoom) (room *domain.ClassRoom, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.ClassRoom{}).Where("class_id = ?", c.ID).Find(&room).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return room, err
}

// DeleteClassRoom 删除课堂
func DeleteClassRoom(c *domain.ClassRoom) (err error) {
	db = util.GetDB()
	err = db.Delete(c).Error
	return err
}

// InsertAnnouncement 插入公告
func InsertAnnouncement(a *domain.Announcement) (err error) {
	db = util.GetDB()
	err = db.Create(a).Error
	return err
}

// DeleteAnnouncement 删除公告
func DeleteAnnouncement(a *domain.Announcement) (err error) {
	db = util.GetDB()
	err = db.Delete(a).Error
	return err
}

// GetAnnouncement 获取班级所有公告
func GetAnnouncement(c *domain.Class) (announcement []*domain.Announcement, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Announcement{}).Where("class_id = ?", c.ID).Find(&announcement).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return announcement, err
}
