let class_list = [];   //全局课程班级信息列表

// 构建带有查询参数的 URL
var url = "/course";
var postData = {
    get_course: {isRequest: true},
    enter_class: {isRequest: false},
    exit_class: {isRequest: false}
};

// 发送 GET 请求
fetch(url, {
    method: "POST", // 指定请求方法为 POST
    headers: {
        "Content-Type": "application/json" // 设置请求头
    },
    body: JSON.stringify(postData) // 将数据转换为 JSON 字符串并作为请求体发送
})
    .then(response => {
        if (response.status === 200) { // 200 表示请求成功
            return response.json(); // 解析响应为 JSON
        } else if (response.status === 404) { // 404 表示资源未找到
            throw new Error("Resource not found");
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    })
    .then(data => {
        if(data.code === 0){
            // 清空现有的表格数据
            class_list = data.data.classes;
            const container = document.querySelector('.table-container');
            container.innerHTML = '';
            // 生成新的表格
            data.data.classes.forEach(course => generateTable(course));
        }
        else{
            alert(`服务器错误：${data.msg}`)
        }
    })
    .catch(error => {
        alert(`There was a problem with the fetch operation: ${error}`);
    });

const colorItems = ['#1e9fff','#16b777','#16baaa','#31bdec'];

// 生成表格的函数
function generateTable(course) {
// 获取 table-container 元素
    const container = document.querySelector('.table-container');

// 创建包含标题和表格的 div 元素
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';

    const item = colorItems[course.course_id%4];
    tableWrapper.style.background = item;

    tableWrapper.onclick = function(event){
        //console.log('/class?class_id='+course.class_id)
        if(event.target.className!=="fas fa-sign-out-alt"){
            window.location.href = '/class?class_id='+course.class_id;
        }
    }

// 创建标题元素
    const h2 = document.createElement('h2');
    h2.textContent = course.course_name;
    tableWrapper.appendChild(h2);

//创建教师名称元素
    const userIconElement = document.createElement('span');
    userIconElement.innerHTML = '<i class="fas fa-user"></i> '+ course.teacher_name;
    tableWrapper.appendChild(userIconElement);

    const labelbuttondiv = document.createElement('div');
    labelbuttondiv.className = "labelbuttondiv";
// 创建班级名称元素
    const classLabel = document.createElement('span');
    classLabel.innerHTML = '<i class="fas fa-home"></i> '+ course.class_name;
    labelbuttondiv.appendChild(classLabel);

// 创建退出班级按钮
    const exitButton = document.createElement('button');
    exitButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> ';
    exitButton.className = "exitbutton";
    exitButton.id = course.class_id;
    exitButton.setAttribute("lay-on","test-confirm");

    labelbuttondiv.appendChild(exitButton);

    tableWrapper.appendChild(labelbuttondiv);

// 将包含标题和表格的 div 元素添加到 container
    container.appendChild(tableWrapper);
}

// 打开悬浮窗
function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

// 关闭悬浮窗
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 提交邀请码
function submitInviteCode() {
    const inviteCode = document.getElementById('invite-code').value;
    // 解密邀请码获取班级 ID
    let decryptedClassId = xorDecrypt(inviteCode);
    // 定义请求体
    var data = {
        get_course: {isRequest: false},
        enter_class: {isRequest: true, class_id: decryptedClassId},
        exit_class: {isRequest: false}
    };

    var url = "/course";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {   //刷新班级列表
            if(data.code === 0){
                insertCourseList(data.data);  //插入新数据
                // 清空现有的表格数据
                const container = document.querySelector('.table-container');
                container.innerHTML = '';
                // 生成新的表格
                class_list.forEach(course => generateTable(course));
                closeModal();
            }
            else{
                if(data.code===1008){
                    codeInput =  document.getElementById('invite-code');
                    modalContent = document.getElementById('class-modal-content');
                    codeInput.style.color = 'red';
                    let errorLabel = document.createElement('label');
                    errorLabel.textContent = "该班级不存在";
                    errorLabel.style.color = 'red';
                    errorLabel.style.marginTop = '10px';
                    modalContent.insertBefore(errorLabel, codeInput.nextSibling);
                }
                else{
                    alert(`服务器错误：${data.msg}`)
                }
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });

}

function insertCourseList(newData)
{
    class_list.unshift(newData);  //在最前端插入新班级
    console.log(class_list);
}

function xorDecrypt(inviteCode) {
    let key = 9876543210; // 密钥
    // 将邀请码转换为整数
    let encryptedInt = parseInt(inviteCode, 36);

    // 将整数转换为二进制字符串
    let encryptedBinary = encryptedInt.toString(2).padStart(32, '0');

    // 将密钥转换为二进制字符串
    let keyBinary = key.toString(2).padStart(32, '0');

    // 进行异或运算
    let classIdBinary = '';
    for (let i = 0; i < encryptedBinary.length; i++) {
        classIdBinary += encryptedBinary[i] ^ keyBinary[i];
    }

    // 将二进制字符串转换为整数
    let classId = parseInt(classIdBinary, 2);

    return classId;
}

layui.use(function(){
    var layer = layui.layer;
    var util = layui.util;
    // 事件
    util.on('lay-on', {
        "test-confirm": function(){
            var buttonId = this.id;
            console.log(this.id);
            layer.confirm('该操作将退出班级，确定退出吗？', {icon: 3}, function(){
                exitClass(buttonId);
                layer.msg('已退出该班级', {icon: 1});
            }, function(){

            });
        }
    })
})

function exitClass(class_id)
{
    // 构建带有查询参数的 URL
    var url = "/course";
    var postData = {
        get_course: {isRequest: false},
        enter_class: {isRequest: false},
        exit_class: {isRequest: true, class_id: parseInt(class_id)}
    };

    // 发送 GET 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(postData) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                //更新class_list
                const index = class_list.findIndex(item => item.class_id === parseInt(class_id));
                if (index !== -1) {
                    class_list.splice(index, 1);
                }
                // 清空现有的表格数据
                const container = document.querySelector('.table-container');
                container.innerHTML = '';
                // 生成新的表格
                class_list.forEach(course => generateTable(course));
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}
