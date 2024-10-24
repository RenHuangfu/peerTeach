package config

import (
	"github.com/spf13/viper"
	"path/filepath"
	"sync"
)

var (
	config GlobalConfig // 全局业务配置文件
	once   sync.Once
)

// LogConf 日志配置
type LogConf struct {
	LogPattern string `yaml:"log_pattern" mapstructure:"log_pattern"` // 日志输出标准，终端输出/文件输出
	LogPath    string `yaml:"log_path" mapstructure:"log_path"`       // 日志路径
	SaveDays   uint   `yaml:"save_days" mapstructure:"save_days"`     // 日志保存天数
	Level      string `yaml:"level" mapstructure:"level"`             // 日志级别
}

// DbConf db配置结构
type DbConf struct {
	Host        string `yaml:"host" mapstructure:"host"`                   // db主机地址
	Port        string `yaml:"port" mapstructure:"port"`                   // db端口
	User        string `yaml:"user" mapstructure:"user"`                   // 用户名
	Password    string `yaml:"password" mapstructure:"password"`           // 密码
	Dbname      string `yaml:"dbname" mapstructure:"dbname"`               // db名
	MaxIdleConn int    `yaml:"max_idle_conn" mapstructure:"max_idle_conn"` // 最大空闲连接数
	MaxOpenConn int    `yaml:"max_open_conn" mapstructure:"max_open_conn"` // 最大打开的连接数
	MaxIdleTime int64  `yaml:"max_idle_time" mapstructure:"max_idle_time"` // 连接最大空闲时间
}

// AppConf 服务配置
type AppConf struct {
	AppName string `yaml:"app_name" mapstructure:"app_name"` // 业务名
	Version string `yaml:"version" mapstructure:"version"`   // 版本
	Port    int    `yaml:"port" mapstructure:"port"`         // 端口
	RunMode string `yaml:"run_mode" mapstructure:"run_mode"` // 运行模式
}

// RedisConf 配置
type RedisConf struct {
	Host     string `yaml:"rhost" mapstructure:"rhost"` // db主机地址
	Port     int    `yaml:"rport" mapstructure:"rport"` // db端口
	DB       int    `yaml:"rdb" mapstructure:"rdb"`
	PassWord string `yaml:"passwd" mapstructure:"passwd"`
	PoolSize int    `yaml:"poolsize" mapstructure:"poolsize"`
}

type Cache struct {
	SessionExpired int `yaml:"session_expired" mapstructure:"session_expired"`
	UserExpired    int `yaml:"user_expired" mapstructure:"user_expired"`
}

// GlobalConfig 业务配置结构体
type GlobalConfig struct {
	AppConfig   AppConf   `yaml:"app" mapstructure:"app"`
	DbConfig    DbConf    `yaml:"db" mapstructure:"db"`       // db配置
	LogConfig   LogConf   `yaml:"log" mapstructure:"log"`     // 日志配置
	RedisConfig RedisConf `yaml:"redis" mapstructure:"redis"` // redis配置
	Cache       Cache     `yaml:"cache" mapstructure:"cache"` // cache配置
}

// GetGlobalConf 获取全局配置文件
func GetGlobalConf() *GlobalConfig {
	once.Do(readConf)
	return &config
}

func readConf() {
	viper.SetConfigName("conf")
	viper.SetConfigType("yml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config/")
	viper.AddConfigPath("./src/config/")
	viper.AddConfigPath("../src/config/")
	viper.AddConfigPath("../../src/config/")
	err := viper.ReadInConfig()
	if err != nil {
		panic("read config file err:" + err.Error())
	}
	err = viper.Unmarshal(&config)
	if err != nil {
		panic("config file unmarshal err:" + err.Error())
	}
	//log.Infof("config === %+v", config)
}

// dir name
const (
	UpDir    = ".."
	Front    = "front"
	Html     = "html"
	User     = "user"
	Student  = "student"
	Teacher  = "teacher"
	Main     = "main"
	Class    = "class"
	Resource = "resource"
)

var (
	IndexPath                     = filepath.Join(UpDir, Front, Html, "index.html")
	ManagerPath                   = filepath.Join(UpDir, Front, Html, "manager/main/account.html")
	LoginPath                     = filepath.Join(UpDir, Front, Html, User, "login.html")
	RegisterPath                  = filepath.Join(UpDir, Front, Html, User, "register.html")
	TeacherInfoPath               = filepath.Join(UpDir, Front, Html, User, "teacher.html")
	StudentInfoPath               = filepath.Join(UpDir, Front, Html, User, "student.html")
	TeacherCoursePath             = filepath.Join(UpDir, Front, Html, Teacher, Main, "course.html")
	StudentCoursePath             = filepath.Join(UpDir, Front, Html, Student, Main, "course.html")
	TeacherClassPath              = filepath.Join(UpDir, Front, Html, Teacher, Class, "class.html")
	StudentClassPath              = filepath.Join(UpDir, Front, Html, Student, Class, "class.html")
	TeacherPostDetailPath         = filepath.Join(UpDir, Front, Html, Teacher, Class, "post_detail.html")
	StudentPostDetailPath         = filepath.Join(UpDir, Front, Html, Student, Class, "post_detail.html")
	TeacherAnnouncementDetailPath = filepath.Join(UpDir, Front, Html, Teacher, Class, "announcement_detail.html")
	StudentAnnouncementDetailPath = filepath.Join(UpDir, Front, Html, Student, Class, "announcement_detail.html")
	TeacherResourcePath           = filepath.Join(UpDir, Front, Html, Teacher, Resource, "resource.html")
	TeacherPaperPath              = filepath.Join(UpDir, Front, Html, Teacher, Resource, "paperdetail.html")
)

// session key
// const (
// 	AccountKey = "account"
// 	CartKey    = "cart"
// 	ProductKey = "product"
// 	OrderKey   = "order"
// )

//// InitConfig 初始化日志
//func InitConfig() {
//	globalConf := GetGlobalConf()
//	// 设置日志级别
//	level, err := log.ParseLevel(globalConf.LogConfig.Level)
//	if err != nil {
//		panic("log level parse err:" + err.Error())
//	}
//	// 设置日志格式为json格式
//	log.SetFormatter(&logFormatter{
//		log.TextFormatter{
//			DisableColors:   true,
//			TimestampFormat: "2006-01-02 15:04:05",
//			FullTimestamp:   true,
//		}})
//	log.SetReportCaller(true) // 打印文件位置，行号
//	log.SetLevel(level)
//	switch globalConf.LogConfig.LogPattern {
//	case "stdout":
//		log.SetOutput(os.Stdout)
//	case "stderr":
//		log.SetOutput(os.Stderr)
//	case "file":
//		logger, err := rlog.New(
//			globalConf.LogConfig.LogPath+".%Y%m%d",
//			//rlog.WithLinkName(globalConf.LogConf.LogPath),
//			rlog.WithRotationCount(globalConf.LogConfig.SaveDays),
//			//rlog.WithMaxAge(time.Minute*3),
//			rlog.WithRotationTime(time.Hour*24),
//		)
//		if err != nil {
//			panic("log conf err: " + err.Error())
//		}
//		log.SetOutput(logger)
//	default:
//		panic("log conf err, check log_pattern in logsvr.yaml")
//	}
//}
