package persistence

import (
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/util"
)

// InsertCourse 插入课程
func InsertCourse(c *domain.Course) (err error) {
	db = util.GetDB()
	err = db.Create(c).Error
	return err
}

// UpdateCourse 修改课程
func UpdateCourse(c *domain.Course) (err error) {
	db = util.GetDB()
	err = db.Model(domain.Course{}).Where("id = ?", c.ID).Update("name", c.Name).Error
	return err
}

// DeleteCourse 删除课程
func DeleteCourse(c *domain.Course) (err error) {
	db = util.GetDB()
	err = db.Delete(&domain.Course{}, c.ID).Error
	return err
}

// GetCourse 获取某位老师的所有课程
func GetCourse(t *domain.User) (course []*domain.Course, err error) {
	db = util.GetDB()
	course = make([]*domain.Course, 10)
	tx := db.Begin()
	err = tx.Model(domain.Course{}).Where("user_id = ?", t.ID).Find(&course).Error
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
	class = make([]*domain.Class, 10)
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
func InsertStudents(c *domain.Class, students *domain.User) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.ClassUser{}).Create(&domain.ClassUser{
		ClassID: c.ID,
		UserID:  students.ID,
	}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return err
}

// DeleteStudent 删除班级里某个学生
func DeleteStudent(c *domain.Class, s *domain.User) (err error) {
	db = util.GetDB()
	err = db.Delete(&domain.ClassUser{
		ClassID: c.ID,
		UserID:  s.ID,
	}).Error
	return err
}

// GetStudents 获取班级里的所有学生
func GetStudents(c *domain.Class) (students []*domain.User, err error) {
	db = util.GetDB()
	students = make([]*domain.User, 50)
	studentID := make([]uint, 50)
	tx := db.Begin()
	err = tx.Model(domain.ClassUser{}).Where("class_id = ?", c.ID).Pluck("user_id", &studentID).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = tx.Model(domain.User{}).Where("id IN (?)", studentID).Find(&students).Error
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
func GetClassRoom(c *domain.Class) (room []*domain.ClassRoom, err error) {
	db = util.GetDB()
	room = make([]*domain.ClassRoom, 10)
	err = db.Model(domain.ClassRoom{}).Where("class_id = ?", c.ID).Find(&room).Error
	if err != nil {
		return nil, err
	}
	return room, err
}

// DeleteClassRoom 删除课堂
func DeleteClassRoom(c *domain.ClassRoom) (err error) {
	db = util.GetDB()
	err = db.Delete(&domain.ClassRoom{}, c.ID).Error
	return err
}

// InsertAnnouncement 插入公告
func InsertAnnouncement(a *domain.Announcement, c []*domain.Class) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Create(a).Error
	if err != nil {
		tx.Rollback()
		return
	}
	for _, v := range c {
		err = tx.Create(&domain.AnnouncementClass{
			AnnouncementID: a.ID,
			ClassID:        v.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}
	tx.Commit()
	return err
}

// DeleteAnnouncement 删除公告
func DeleteAnnouncement(a *domain.Announcement) (err error) {
	db = util.GetDB()
	err = db.Delete(a).Error
	return err
}

// GetAnnouncement 获取班级所有公告
func GetAnnouncement(c *domain.Class) (announcement []*constant.AnnouncementResponse, err error) {
	db = util.GetDB()
	announcement = make([]*constant.AnnouncementResponse, 10)
	db = db.Raw("select a.id as id,a.created as time,a.title as title,u.name as teacher_name "+
		"from announcements as a,users as u,announcement_classes as ac,classes as c,courses as cr "+
		"where ac.class_id = c.id and ac.announcement_id = a.id and cr.user_id = u.id "+
		"and c.course_id = cr.id and c.id = ?", c.ID).Scan(&announcement)
	return
}

// GetClassByStudent 获取学生所有的班级课程教师
func GetClassByStudent(u *domain.User) (classes []*constant.DetailClass, err error) {
	db = util.GetDB()
	classes = make([]*constant.DetailClass, 10)
	db = db.Raw("select cl.id as class_id,cl.name as class_name,cr.id as course_id,"+
		"cr.name as course_name,t.name as teacher_name "+
		"from classes as cl,courses as cr,users as t,users as s,class_users as cu "+
		"where cu.user_id = s.id and cu.class_id = cl.id and cl.course_id = cr.id "+
		"and cr.user_id = t.id and s.id = ?", u.ID).Scan(&classes)
	return
}

// GetClassDetailByClass 获取班级所属课程教师
func GetClassDetailByClass(c *domain.Class) (class *constant.DetailClass, err error) {
	db = util.GetDB()
	class = &constant.DetailClass{}
	db = db.Raw("select cl.id as class_id,cl.name as class_name,cr.id as course_id,"+
		"cr.name as course_name,t.name as teacher_name "+
		"from classes as cl,courses as cr,users as t "+
		"where cl.course_id = cr.id and cr.user_id = t.id and cl.id = ?", c.ID).Scan(class)
	return
}
