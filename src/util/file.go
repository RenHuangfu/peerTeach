package util

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path"
	"strings"
)

// UploadFile 文件上传到本地
func UploadFile(file *multipart.FileHeader) (err error) {
	ext := path.Ext(file.Filename)                     // 读取文件后缀
	filename := strings.TrimSuffix(file.Filename, ext) // 读取文件名

	fmt.Println(ext)
	storePath := "../file/" + filename + ext // 文件存储路径

	f, openError := file.Open() // 读取文件
	if openError != nil {
		return errors.New("function file.Open() Filed, err:" + openError.Error())
	}
	defer func(f multipart.File) {
		err := f.Close()
		if err != nil {
			return
		}
	}(f) // 创建文件 defer 关闭

	var out *os.File
	var createErr error

	out, createErr = os.Create(storePath)
	if createErr != nil {
		return errors.New("function os.Create() Filed, err:" + createErr.Error())
	}
	defer func(out *os.File) {
		err := out.Close()
		if err != nil {
			return
		}
	}(out) // 创建文件 defer 关闭

	_, copyErr := io.Copy(out, f) // 拷贝文件
	if copyErr != nil {
		return errors.New("function io.Copy() Filed, err:" + copyErr.Error())
	}
	return nil
}
