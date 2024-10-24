let userId = 0;   //用户id

document.addEventListener("DOMContentLoaded", function() {
    let data ={
        request:"get"
    }
    // 获取并显示个人信息
    fetch('/user_info', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code===0) {
                document.getElementById("name").value = data.data.user_name || "未提供";
                document.getElementById("school").value = data.data.school || "未提供";
                document.querySelector(".user-id").textContent = ("ID:"+data.data.email) || "未提供";
                document.getElementById("avatarImage").src = "/file/avatar_"+data.data.user_id+".jpg"; // 替换为实际的头像图片路径
                userId = data.data.user_id; // 将用户ID存储在全局变量中
            } else {
                console.warn("未找到用户信息数据。");
            }
        })
        .catch(error => {
            console.error("获取用户信息失败:", error);
        });

    // 添加点击事件监听器，提交更新后的个人信息
    document.getElementById("confirmButton").addEventListener("click", function(event) {
        event.preventDefault();  // 阻止默认提交行为

        // 获取输入框中的更新信息
        const updatedName = document.getElementById("name").value;
        const updatedSchool = document.getElementById("school").value;

        // 构造请求数据
        const data = {
            request:"update",
            user_name: updatedName,
            school: updatedSchool
        };

        console.log(data)
        // 提交更新的个人信息
        fetch("/user_info", {  // 替换为实际的 API 地址
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 200) {
                layer.msg("个人信息更新成功", {icon: 1, time: 2000});
                // 更新页面上的显示信息
            } else if (response.status === 404) {
                layer.msg("个人信息更新失败", {icon: 1, time: 2000});
            } else {
                throw new Error("服务器错误，请稍后再试！");
            }
        })
        .catch(error => {
            console.error("提交更新失败:", error);
            alert("提交失败，请检查网络连接或稍后再试。");
        });
    });
});

function showAvatarModal(){
    document.getElementById("avatarModal").style.display = "block";
}

function hideAvatarModal(){
    document.getElementById("avatarModal").style.display = "none";
}


//展示用户头像
function previewImage(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const avatarPreview = document.getElementById('previewImage');
            avatarPreview.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
};


//保存头像
function saveAvatar(){
    //头像命名格式： avatar_用户id.jpg
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        //转成.jpg格式
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 设置画布尺寸为图片尺寸
                canvas.width = img.width;
                canvas.height = img.height;

                // 在画布上绘制图片
                ctx.drawImage(img, 0, 0);

                // 将画布内容转换为 JPEG 格式
                canvas.toBlob(function (blob) {
                    // 创建一个新的 FormData 对象
                    fileName = 'avatar_'+userId+'.jpg';
                    const formData = new FormData();
                    formData.append('file', blob, fileName);
                    //发送 FormData 到服务器
                    fetch('/file', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('文件上传失败');
                        }
                        return response.json();
                    })
                    .then(data => {
                        layer.msg('头像保存成功', {icon: 1, time: 2000});
                        console.log('文件上传成功', data);
                        // 更新预览图片
                        const avatarPreview = document.getElementById('avatarImage');
                        avatarPreview.src = canvas.toDataURL('image/jpeg');
                    })
                    .catch(error => {
                        layer.msg('头像保存失败', {icon: 2, time: 2000});
                        console.error('文件上传失败', error);
                    });

                }, 'image/jpeg', 0.9); // 0.9 是 JPEG 质量
                
            };
        };

        reader.readAsDataURL(file);
    }

    hideAvatarModal(); // 隐藏选择头像框
}
