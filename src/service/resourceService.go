package service

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
)

func GetPaper(c *gin.Context) (data *constant.PapersResponse, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	data, err = persistence.GetPaper(&domain.User{
		ID: user.(domain.User).ID,
	})
	return
}

func GetQuestion(c *gin.Context, req *constant.ResourceRequest) (data *constant.QuestionResponse, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	data, err = persistence.GetQuestion(&domain.User{
		ID: user.(domain.User).ID,
	}, &req.GetQuestion)
	return
}

func GetGlobalQuestion(req *constant.ResourceRequest) (data *constant.QuestionResponse, err error) {
	data, err = persistence.GetGlobalQuestion(&req.GetGlobalQuestion)
	return
}

func InsertQuestion(c *gin.Context, req *constant.QuestionReq) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	que := &domain.Question{
		Name:     &req.Title,
		Subject:  &req.Subject,
		Section:  &req.Section,
		Course:   &req.Course,
		IsPublic: req.IsPublic,
		Options:  req.Options,
		UserID:   user.(domain.User).ID,
	}
	err = persistence.InsertQuestion(que)
	data = struct {
		QuestionID uint `json:"question_id"`
	}{
		QuestionID: que.ID,
	}
	return
}

func InsertPaper(c *gin.Context, req *constant.PaperReq) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	paper := &domain.Exam{
		Name:   &req.Title,
		UserID: user.(domain.User).ID,
	}
	que := make([]*domain.Question, len(req.QuestionID))
	for k, v := range req.QuestionID {
		que[k] = &domain.Question{
			ID: v,
		}
	}
	err = persistence.InsertExam(paper, que)
	data = struct {
		PaperID uint `json:"paper_id"`
	}{
		PaperID: paper.ID,
	}
	return
}

func UpdatePaper(c *gin.Context, req *constant.PaperReq) (err error) {
	err = persistence.DeleteExam(&domain.Exam{
		ID: req.PaperID,
	})
	if err != nil {
		return
	}
	_, err = InsertPaper(c, req)
	return
}

func UpdateQuestion(c *gin.Context, req *constant.QuestionReq) (err error) {
	err = persistence.DeleteQuestion(&domain.Question{
		ID: req.QuestionID,
	})
	if err != nil {
		return
	}
	_, err = InsertQuestion(c, req)
	return
}
