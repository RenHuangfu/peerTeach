package util

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"os/exec"
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

func ConvertPPTtoJPG(pptFilePath string) error {
	// 使用开源工具如unoconv或者Go的库（如unidoc）来转换PPT文件
	// 这里是调用一个外部命令的示例：unoconv工具来转换PPT为JPG
	// 请先安装unoconv并确保其路径正确

	cmd := exec.Command("unoconv", "-f", "jpg", "-o", "../file/", pptFilePath) // 使用unoconv转换
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("error during conversion: %v", err)
	}
	return nil
}
