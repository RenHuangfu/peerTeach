document.getElementById("registerButton").addEventListener("click", function () {
    // 获取用户输入的注册信息
    const userName = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const comfirm = document.getElementById("confirm").value;
    const email = document.getElementById("email").value;
    const identity = document.getElementById("identity").value;
    const school =document.getElementById("school").value;

    // 检查输入项是否填写完整
    if (!userName || !password||!email) {
        alert("请填写所有注册信息！");
        return;
    }
    if (password!=comfirm){
        alert("您两次输入的密码不一致");
        return;
    }
    // 构造请求数据
    const requestData = {
        name: userName,
        password: password,
        email: email,
        identity: identity,
        school: school,
    };

    // 调用注册 API
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if(response.status===204){
            window.location.replace("login")
        }else {
            throw new Error("账号已存在")
        }
    })
    .catch(error => {
       alert(error.message);
    });
});
