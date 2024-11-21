package persistence

import (
	"fmt"
	"peerTeach/constant"
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
func GetPost(c *domain.Class, u *domain.User) (post []*constant.PostResponse, err error) {
	db = util.GetDB()
	post = make([]*constant.PostResponse, 10)
	db = db.Raw("select p.post_id,p.create_time,p.post_title,p.post_likes,"+
		"p.post_comment,p.user_id,p.user_name, IF(p1.user_id is null ,false,true) as is_like "+
		"from (select p.id as post_id,p.created as create_time,"+
		"p.title as post_title,p.likes as post_likes,"+
		"p.comment as post_comment,p.user_id as user_id,u.name as user_name "+
		"from posts as p,users as u where p.user_id = u.id and p.class_id = ?) as p "+
		"left join post_users as p1 on p.post_id = p1.post_id and p1.user_id = ?", c.ID, u.ID).Scan(&post)
	return
}

func GetPostDetail(r *constant.PostResponseTotal, u *domain.User) (err error) {
	db = util.GetDB()
	r.CommentRes = make([]*constant.CommentRes, 10)
	tx := db.Begin()
	err = tx.Raw("select p.post_id,p.create_time,p.post_title,p.post_likes "+
		",p.post_comment,p.post_content,p.photo_num,p.user_id "+
		",p.user_name, IF(p_u.user_id is null ,false,true) as is_like "+
		",IF(p.user_id = ?,true,false) as is_self "+
		"from (select p.id as post_id,p.created as create_time,p.title as post_title "+
		",p.likes as post_likes,p.comment as post_comment,p.content as post_content "+
		",p.photo_num as photo_num,p.user_id as user_id,u.name as user_name "+
		"from posts as p,users as u "+
		"where p.user_id = u.id and p.id = ? "+
		") as p left join ( "+
		"select p_u.user_id,p_u.post_id "+
		"from post_users as p_u "+
		"where p_u.user_id = ? "+
		")as p_u on p.post_id = p_u.post_id", u.ID, r.PostResponseDetail.PostID, u.ID).Scan(&r.PostResponseDetail).Error
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Raw("select c.comment_id,c.create_time,c.comment_content,c.comment_likes "+
		",c.user_id,c.user_name,IF(c_u.user_id is null ,false,true) as is_like "+
		",IF(c.user_id = ?,true,false) as is_self "+
		"from (select c.id as comment_id,c.created as create_time,c.content as comment_content "+
		",c.likes as comment_likes,c.user_id as user_id "+
		",u.name as user_name "+
		"from comments as c, users as u "+
		"where c.user_id = u.id and c.post_id = ? "+
		")as c left join ( "+
		"select c.comment_id,c.user_id "+
		"from comment_users as c "+
		"where c.user_id = ?) as c_u "+
		"on c.comment_id = c_u.comment_id", u.ID, r.PostResponseDetail.PostID, u.ID).Scan(&r.CommentRes).Error
	if err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return
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
	tx := db.Begin()
	err = db.Model(domain.Comment{}).Create(c).Error
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Exec("update posts set comment = comment + 1 where id = ?", c.PostID).Error
	if err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return err
}

// GetComment 获取帖子下所有评论
func GetComment(p *domain.Post) (comment []*domain.Comment, err error) {
	db = util.GetDB()
	comment = make([]*domain.Comment, 10)
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
func DeleteComment(c *domain.Comment) (err error) {
	db = util.GetDB()
	tx := db.Begin()
	err = db.Model(domain.Comment{}).Delete(c).Error
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Exec("update posts set comment = comment - 1 where id = ?", c.PostID).Error
	if err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
	return err
}

// PostUserSet 帖子点赞或取消
func PostUserSet(p *domain.Post, u *domain.User) (err error) {
	db = util.GetDB()
	var isLike bool
	tx := db.Begin()
	err = tx.Raw("select IF(count(p_u.post_id) = 0 , 0, 1) from post_users as p_u where p_u.post_id = ? and p_u.user_id = ?", p.ID, u.ID).Scan(&isLike).Error
	if !isLike {
		err = tx.Create(&domain.PostUser{
			PostID: p.ID,
			UserID: u.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return
		}
	} else {
		err = tx.Delete(&domain.PostUser{
			PostID: p.ID,
			UserID: u.ID,
		}).Error
		if err != nil {
			tx.Rollback()
			return
		}
	}
	err = tx.Exec("update posts set likes = (select count(*) from post_users where post_id = ?) where id = ?", p.ID, p.ID).Error
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return
	}
	return
}

// CommentUserSet 评论点赞或取消
func CommentUserSet(c *domain.Comment, u *domain.User) (err error) {
	db = util.GetDB()
	var isLike bool
	tx := db.Begin()
	err = db.Raw("select IF(count(c_u.comment_id) = 0 , 0, 1) from comment_users as c_u where c_u.comment_id = ? and c_u.user_id = ? FOR UPDATE", c.ID, u.ID).Scan(&isLike).Error
	if !isLike {
		err = tx.Create(&domain.CommentUser{
			CommentID: c.ID,
			UserID:    u.ID,
		}).Error
		if err != nil {
			fmt.Println("one", err)
			tx.Rollback()
			return
		}
	} else {
		err = tx.Delete(&domain.CommentUser{
			CommentID: c.ID,
			UserID:    u.ID,
		}).Error
		if err != nil {
			fmt.Println("one", err)
			tx.Rollback()
			return
		}
	}
	err = tx.Exec("update comments set likes = (select count(*) from comment_users where comment_id = ?) where id = ?", c.ID, c.ID).Error
	if err != nil {
		tx.Rollback()
		return
	}
	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return
	}
	return
}
