package service

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
)

// TeacherGetCourse 获取课程和班级
func TeacherGetCourse(c *gin.Context) (data *constant.CourseResponse, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	teacher := &domain.User{
		ID: user.(domain.User).ID,
	}
	courses, err := persistence.GetCourse(teacher)
	if err != nil {
		return nil, err
	}
	cs := make([]constant.Course, len(courses))
	for i, v := range courses {
		classes, err := persistence.GetClass(v)
		if err != nil {
			return nil, err
		}
		cls := make([]constant.Class, len(classes))
		for j, w := range classes {
			cls[j] = constant.Class{
				ID:   w.ID,
				Name: w.Name,
			}
		}
		cs[i] = constant.Course{
			CourseId:   v.ID,
			CourseName: v.Name,
			Classes:    cls,
		}
	}
	data = &constant.CourseResponse{
		Courses: cs,
	}
	return data, nil
}

// TeacherDeleteCourse 删除课程
func TeacherDeleteCourse(req *constant.CourseRequest) (err error) {
	err = persistence.DeleteCourse(&domain.Course{
		ID: req.DeleteCourse.CourseID,
	})
	if err != nil {
		return err
	}
	return
}

// TeacherDeleteClass 删除班级
func TeacherDeleteClass(req *constant.CourseRequest) (err error) {
	err = persistence.DeleteClass(&domain.Class{
		ID: req.DeleteClass.ClassID,
	})
	if err != nil {
		return err
	}
	return
}

// TeacherEditCourse 编辑课程
func TeacherEditCourse(req *constant.CourseRequest) (err error) {
	err = persistence.UpdateCourse(&domain.Course{
		ID:   req.EditCourse.CourseID,
		Name: &req.EditCourse.CourseName,
	})
	if err != nil {
		return err
	}
	return
}

// TeacherCreateCourse 创建课程
func TeacherCreateCourse(c *gin.Context, req *constant.CourseRequest) (data *constant.Course, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	course := &domain.Course{
		Name:   &req.CreateCourse.CourseName,
		UserID: user.(domain.User).ID,
	}
	err = persistence.InsertCourse(course)
	data = &constant.Course{
		CourseId: course.ID,
	}
	return
}

// TeacherCreateClass 创建班级
func TeacherCreateClass(req *constant.CourseRequest) (data *constant.Class, err error) {
	class := &domain.Class{
		Name:     &req.CreateClass.ClassName,
		CourseID: req.CreateClass.CourseID,
	}
	err = persistence.InsertClass(class)
	data = &constant.Class{
		ID: class.ID,
	}
	return
}

// StudentGetCourse 获取学生所在班级课程教师
func StudentGetCourse(c *gin.Context) (data *constant.ClassResponse, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	student := &domain.User{
		ID: user.(domain.User).ID,
	}
	classes, err := persistence.GetClassByStudent(student)
	if err != nil {
		return nil, err
	}

	data = &constant.ClassResponse{
		Classes: classes,
	}

	return data, nil
}

// StudentEnterClass 学生加入班级
func StudentEnterClass(c *gin.Context, req *constant.CourseRequest) (data *constant.DetailClass, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	student := &domain.User{
		ID: user.(domain.User).ID,
	}
	class := &domain.Class{
		ID: req.EnterClass.ClassID,
	}
	err = persistence.InsertStudents(class, student)
	if err != nil {
		return nil, err
	}
	data, err = persistence.GetClassDetailByClass(class)
	if err != nil {
		return nil, err
	}
	return data, nil
}

// StudentExitClass 学生退出班级
func StudentExitClass(c *gin.Context, req *constant.CourseRequest) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	student := &domain.User{
		ID: user.(domain.User).ID,
	}
	class := &domain.Class{
		ID: req.ExitClass.ClassID,
	}
	err = persistence.DeleteStudent(class, student)
	return
}
