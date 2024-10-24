package persistence

import (
	"peerTeach/domain"
	"peerTeach/util"
)

// InsertPost 插入帖子
func InsertPost(p *domain.Post) (err error) {
	db = util.GetDB()
	err = db.Model(domain.Post{}).Create(p).Error
	return err
}

// GetPost 获取班级下的所有帖子
func GetPost(c *domain.Class) (post []*domain.Post, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Post{}).Where("class_id = ?", c.ID).Find(&post).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return post, nil
}

// DeletePost 删除帖子
func DeletePost(p *domain.Post) (err error) {
	db = util.GetDB()
	err = db.Model(domain.Post{}).Delete(p).Error
	return err
}

// InsertComment 插入评论
func InsertComment(c *domain.Comment) (err error) {
	db = util.GetDB()
	err = db.Model(domain.Comment{}).Create(c).Error
	return err
}

// GetComment 获取帖子下所有评论
func GetComment(p *domain.Post) (comment []*domain.Comment, err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = tx.Model(domain.Comment{}).Where("post_id = ?", p.ID).Find(&comment).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return comment, nil
}

// DeleteComment 删除评论
func DeleteComment(p *domain.Comment) (err error) {
	db = util.GetDB()
	err = db.Model(domain.Comment{}).Delete(p).Error
	return err
}
