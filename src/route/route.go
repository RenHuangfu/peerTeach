package route

import (
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"peerTeach/config"
	"peerTeach/controller"
	"strconv"
)

var getRoute = map[string]func(*gin.Context){
	"/":                    controller.ViewLogin,
	"/manager":             controller.ViewManager,
	"/notice":              controller.ViewNotice,
	"/user_info":           controller.ViewInfo,
	"/login":               controller.ViewLogin,
	"/register":            controller.ViewRegister,
	"/course":              controller.ViewCourse,
	"/class":               controller.ViewClass,
	"/post_detail":         controller.ViewPostDetail,
	"/announcement_detail": controller.ViewAnnouncementDetail,
	"/resource":            controller.ViewResource,
	"/paperDetail":         controller.ViewPaperDetail,
	"/lesson":              controller.ViewLesson,
	"/before_lesson":       controller.ViewBeforeLesson,
	"/at_lesson":           controller.ViewAtLesson,
}

var postRoute = map[string]func(*gin.Context){
	"/":                    controller.Login,
	"/file":                controller.UploadFile,
	"/notice":              controller.PostNotice,
	"/user_info":           controller.PostInfo,
	"/login":               controller.Login,
	"/register":            controller.Register,
	"/course":              controller.PostCourse,
	"/class":               controller.PostClass,
	"/post_detail":         controller.PostPostDetail,
	"/announcement_detail": controller.PostAnnouncementDetail,
	"/resource":            controller.PostResource,
	"/resourceDetail":      controller.PostResourceDetail,
	"/before_lesson":       controller.PostBeforeLesson,
	"/at_lesson":           controller.PostAtLesson,
	"/after_lesson":        controller.PostAfterLesson,
}

func RegisterRoute() {
	r := gin.Default()

	// 页面注册
	r.LoadHTMLGlob("../front/html/user/*")
	r.LoadHTMLGlob("../front/html/student/**/*")
	r.LoadHTMLGlob("../front/html/teacher/**/*")
	r.LoadHTMLGlob("../front/html/manager/**/*")
	r.Static("/css", "../front/css")
	r.Static("/js", "../front/js")
	r.Static("/html", "../front/html")
	r.Static("/file", "../file")
	r.Static("/img", "../front/images/class")
	r.Static("/images/resource", "../front/images/resource")
	r.Static("/json", "../front/json")

	// session 注册
	redisConfig := config.GetGlobalConf().RedisConfig
	addr := fmt.Sprintf("%s:%d", redisConfig.Host, redisConfig.Port)
	store, err := redis.NewStore(
		redisConfig.PoolSize, // 最大空闲链接数量，过大会浪费，过小将来会触发性能瓶颈
		"tcp",                // 指定与Redis服务器通信的网络类型，通常为"tcp"
		addr,                 // Redis服务器的地址，格式为"host:port"
		redisConfig.PassWord, // Redis服务器的密码，如果没有密码可以为空字符串
		[]byte("95osj3fUD7fo0mlYdDbncXz4VD2igvf0"), // authentication key
		[]byte("0Pf2r0wZBpXVXlQNdpwCXN4ncnlnZSc3"), // encryption key
	)
	if err != nil {
		panic(err)
	}
	r.Use(sessions.Sessions("mySession", store))

	// 路由注册
	var k string
	var v func(*gin.Context)
	for k, v = range getRoute {
		r.GET(k, v)
	}
	for k, v = range postRoute {
		r.POST(k, v)
	}
	// 启动server
	port := config.GetGlobalConf().AppConfig.Port
	if err := r.Run(":" + strconv.Itoa(port)); err != nil {
		panic("start server err:" + err.Error())
	}
}
