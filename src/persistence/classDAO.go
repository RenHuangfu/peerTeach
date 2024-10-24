package persistence

import (
	"peerTeach/constant"
	"peerTeach/domain"
	"peerTeach/util"
)

// GetAnnouncementDetail 获取班级公告详情
func GetAnnouncementDetail(a *domain.Announcement) (r *constant.AnnouncementResDetail, err error) {
	db = util.GetDB()
	err = db.Raw("select a.created as time,a.title as title,a.content as content"+
		",a.file_num as file_num from announcements as a where a.id = ?", a.ID).Scan(&r).Error
	return
}
