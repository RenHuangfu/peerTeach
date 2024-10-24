package service

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
)

// CreatePost 创建帖子
func CreatePost(c *gin.Context, req *constant.ClassRequest) (p *domain.Post, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	p = &domain.Post{
		Title:    &req.CreatePost.Title,
		Content:  &req.CreatePost.Content,
		PhotoNum: req.CreatePost.FileNum,
		UserID:   user.(domain.User).ID,
		ClassID:  req.CreatePost.ClassID,
	}
	err = persistence.InsertPost(p)
	return
}

// CreateAnnouncement 发布公告
func CreateAnnouncement(c *gin.Context, req *constant.ClassRequest) (a *domain.Announcement, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	a = &domain.Announcement{
		FileNum: req.CreateAnnouncement.FileNum,
		UserID:  user.(domain.User).ID,
		Title:   &req.CreateAnnouncement.Title,
		Content: &req.CreateAnnouncement.Content,
	}
	err = persistence.InsertAnnouncement(a, []*domain.Class{{
		ID: req.CreateAnnouncement.ClassID,
	}})
	return
}

// TeacherGroupAnnounce 群发布公告
func TeacherGroupAnnounce(c *gin.Context, req *constant.CourseRequest) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	announce := &domain.Announcement{
		FileNum: req.GroupAnnounce.FileNumber,
		UserID:  user.(domain.User).ID,
		Title:   &req.GroupAnnounce.AnnounceTitle,
		Content: &req.GroupAnnounce.AnnounceContent,
	}
	cl := make([]*domain.Class, len(req.GroupAnnounce.ClassesID))
	for k, v := range req.GroupAnnounce.ClassesID {
		cl[k] = &domain.Class{
			ID: v,
		}
	}
	err = persistence.InsertAnnouncement(announce, cl)
	data = struct {
		AnnouncementID uint `json:"announcement_id"`
	}{
		AnnouncementID: announce.ID,
	}
	return
}
