package persistence

import (
	"fmt"
	"peerTeach/constant"
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

// InsertAnswerRecord 插入答题记录
func InsertAnswerRecord(r *domain.AnswerRecord) (err error) {
	db = util.GetDB()
	err = db.Create(r).Error
	return err
}

// DeleteAnswerRecord 删除答题记录
func DeleteAnswerRecord(r *domain.AnswerRecord) (err error) {
	db = util.GetDB()
	err = db.Delete(r).Error
	return err
}

// InsertExam 组卷
func InsertExam(e *domain.Exam, q []*domain.Question) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Create(e).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	for _, v := range q {
		err = tx.Model(domain.ExamQuestion{}).Create(&domain.ExamQuestion{
			QuestionID: v.ID,
			ExamID:     e.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return err
}

// DeleteExam 删除试卷
func DeleteExam(e *domain.Exam) (err error) {
	db = util.GetDB()
	err = db.Delete(e).Error
	return err
}

// GetPaper 获取试卷
func GetPaper(u *domain.User) (p *constant.PapersResponse, err error) {
	db = util.GetDB()
	ps := make([]*constant.Paper, 10)
	err = db.Raw("select p.id as paper_id, p.name as title, p.updated as time "+
		"from exams as p where p.user_id = ?", u.ID).Scan(&ps).Error
	p = &constant.PapersResponse{
		Papers: ps,
	}
	return
}

// GetQuestion 获取题目
func GetQuestion(u *domain.User, r *constant.ResourceReq) (p *constant.QuestionResponse, err error) {
	db = util.GetDB()
	qs := make([]*constant.Question, 10)
	sql := "and subject like '%" + r.Subject + "%' and course like '%" + r.Course + "%' and section like '%" + r.Section + "%'"
	err = db.Raw("select q.id as question_id, q.name as title, q.updated as time "+
		"from questions as q where q.user_id = ? "+sql, u.ID).Scan(&qs).Error
	p = &constant.QuestionResponse{
		Questions: qs,
	}
	return
}

// GetGlobalQuestion 获取全局题目
func GetGlobalQuestion(r *constant.ResourceReq) (p *constant.QuestionResponse, err error) {
	db = util.GetDB()
	qs := make([]*constant.Question, 10)
	sql := "and subject like '%" + r.Subject + "%' and course like '%" + r.Course + "%' and section like '%" + r.Section + "%'"
	err = db.Raw("select q.id as question_id, q.name as title, q.updated as time " +
		"from questions as q where q.is_public is true " + sql).Scan(&qs).Error
	p = &constant.QuestionResponse{
		Questions: qs,
	}
	return
}

func GetPaperDetail(e *domain.Exam) (r *constant.PaperResponseDetail, err error) {
	db = util.GetDB()
	tx := db.Begin()
	r = &constant.PaperResponseDetail{
		Questions: make([]*constant.QuestionDetail, 10),
	}
	err = tx.Raw("select name from exams where id = ?", e.ID).Scan(&r.Name).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	fmt.Println(e.ID)
	err = tx.Raw("select q.id as question_id,q.created as time,q.name as title,q.options as options "+
		"from questions as q where q.id in "+
		"(select q.question_id from exam_questions as q join exams as e "+
		"on q.exam_id = e.id and e.id = ?)", e.ID).Scan(&r.Questions).Error
	fmt.Println(r.Questions)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	return
}

func GetQuestionDetail(q *domain.Question) (question *constant.QuestionDetail, err error) {
	db = util.GetDB()
	//err = db.Raw("select q.id as question_id,q.created as time,q.name as title,q.options as options "+
	//	"from questions as q where q.id = ?", q.ID).Scan(&question).Error
	id := q.ID
	err = db.Find(q, id).Error
	question = &constant.QuestionDetail{
		QuestionID: q.ID,
		Title:      q.Name,
		Time:       q.Created,
		Options:    q.Options,
	}
	if err != nil {
		return nil, err
	}
	return
}

//func GetQuestionDetail() {
//	db = util.GetDB()
//	// 创建数据
//	q := domain.Question{
//		ID: 1,
//		Options: domain.Options{
//			Ops: []domain.Option{
//				{Text: "000", IsCorrect: true},
//				{Text: "000", IsCorrect: false},
//				{Text: "000", IsCorrect: true},
//			},
//		},
//		UserID: 1,
//	}
//	db.Create(&q)
//	// 查询数据
//	var question domain.Question
//	db.First(&question, 1) // 查询 ID 为 1 的题目
//
//	fmt.Println(question)
//	return
//}
