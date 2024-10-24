document.getElementById("loginButton").addEventListener("click", function () {
    // 获取账号和密码的输入值
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // 检查账号和密码是否填写
    if (!email || !password) {
        alert("请填写账号和密码！");
        return;
    }

    // 构造请求数据
    const requestData = {
        email: email,
        password: password // 注意：确保字段名称与服务器的预期格式一致
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then((response) => {
        if(response.status===204) {
            location.replace("/course");
        } else {
            throw new Error("账号或密码错误")
        }})
    .catch(error => {
        // 处理失败或错误响应
        alert(error.message); // 显示错误信息
    });
});
