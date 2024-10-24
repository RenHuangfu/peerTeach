package service

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
)

// GetPostResAll 获取用户所在班级的所有帖子
func GetPostResAll(c *gin.Context, req *constant.ClassRequest) (postRes []*constant.PostResponse, err error) {
	session := sessions.Default(c)
	u := session.Get(constant.UserSession)
	user := &domain.User{
		ID: u.(domain.User).ID,
	}
	class := &domain.Class{
		ID: req.GetPost.ClassID,
	}
	postRes, err = persistence.GetPost(class, user)
	return
}

// PostResDetail 获取帖子详情
func PostResDetail(c *gin.Context, req *constant.PostRequest) (post *constant.PostResponseTotal, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	post = &constant.PostResponseTotal{
		PostResponseDetail: constant.PostResponseDetail{
			PostID: req.GetPostDetail.PostID,
		},
	}
	err = persistence.GetPostDetail(post, &domain.User{
		ID: user.(domain.User).ID,
	})
	return
}

// CreateComment 创建评论
func CreateComment(c *gin.Context, req *constant.PostRequest) (data interface{}, err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	com := &domain.Comment{
		Content: &req.CreateComment.Content,
		PostID:  req.CreateComment.PostID,
		UserID:  user.(domain.User).ID,
	}
	err = persistence.InsertComment(com)
	return struct {
		CommentID uint `json:"comment_id"`
	}{
		CommentID: com.ID,
	}, err
}

// LikePost 帖子点赞或取消
func LikePost(c *gin.Context, req *constant.PostRequest) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	err = persistence.PostUserSet(&domain.Post{
		ID: req.LikePost.PostID,
	}, &domain.User{
		ID: user.(domain.User).ID,
	})
	return
}

// LikeComment 评论点赞或取消
func LikeComment(c *gin.Context, req *constant.PostRequest) (err error) {
	session := sessions.Default(c)
	user := session.Get(constant.UserSession)
	err = persistence.CommentUserSet(&domain.Comment{
		ID: req.LikeComment.CommentID,
	}, &domain.User{
		ID: user.(domain.User).ID,
	})
	return
}
