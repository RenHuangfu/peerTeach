package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/persistence"
	"peerTeach/service"
)

func ViewPostDetail(c *gin.Context) {
	PostDetailPath, err := service.GetPostDetailPath(c)
	if err != nil {
		req := service.HttpResponse{}
		req.ResponseError(c, 10008, "")
		return
	}
	req := service.HttpResponse{
		HtmlPath: PostDetailPath,
	}
	req.ResponseWithHtml(c)
}

func ViewAnnouncementDetail(c *gin.Context) {
	AnnouncementPath, err := service.GetAnnouncementDetailPath(c)
	if err != nil {
		req := service.HttpResponse{}
		req.ResponseError(c, 10008, "")
		return
	}
	req := service.HttpResponse{
		HtmlPath: AnnouncementPath,
	}
	req.ResponseWithHtml(c)
}

func PostPostDetail(c *gin.Context) {
	req := &constant.PostRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetPostDetail.IsRequest {
		fmt.Println("GetPostDetail")
		data, err := service.PostResDetail(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.CreateComment.IsRequest {
		data, err := service.CreateComment(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.DeleteComment.IsRequest {
		err := persistence.DeleteComment(&domain.Comment{
			ID:     req.DeleteComment.CommentID,
			PostID: req.DeleteComment.PostID,
		})
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.DeletePost.IsRequest {
		err := persistence.DeletePost(&domain.Post{
			ID: req.DeletePost.PostID,
		})
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.LikePost.IsRequest {
		fmt.Println("LikePost")
		err := service.LikePost(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, nil)
	} else if req.LikeComment.IsRequest {
		err := service.LikeComment(c, req)
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}

func PostAnnouncementDetail(c *gin.Context) {
	req := &constant.AnnounceRequest{}
	rsp := &service.HttpResponse{}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		fmt.Println(req)
		rsp.ResponseError(c, service.CodeBodyBindErr, err.Error())
		return
	}
	if req.GetAnnounceDetail.IsRequest {
		data, err := persistence.GetAnnouncementDetail(&domain.Announcement{
			ID: req.GetAnnounceDetail.AnnounceID,
		})
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, data)
	} else if req.DeleteAnnouncement.IsRequest {
		err = persistence.DeleteAnnouncement(&domain.Announcement{
			ID: req.DeleteAnnouncement.AnnounceID,
		})
		if err != nil {
			rsp.ResponseError(c, 10008, "")
			return
		}
		rsp.ResponseWithData(c, nil)
	} else {
		rsp.ResponseError(c, service.CodeLoginErr, "no request")
	}
}
