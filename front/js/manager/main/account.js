let users = [];
let selectedUsers = [];

// 构建带有查询参数的 URL
var url = "/main/account";
var data = {
    get_account: {isRequest: true},
    block_user: {isRequest: false},
    unblock_user: {isRequest: false},
    create_notice: {isRequest: false}
};

// 发送 GET 请求
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
    .then(data => {
        if(data.code === 0){
            generateTable(data.data.accounts);
            users = data.data.accounts;
        }
        else{
            alert(`服务器错误：${data.msg}`)
        }
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });

// 生成用户表格
function generateTable(users) {
    const tbody = document.querySelector('#user-table tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = user.id;
        tr.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        tr.appendChild(nameCell);

        const roleCell = document.createElement('td');
        roleCell.textContent = user.identity;
        tr.appendChild(roleCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        tr.appendChild(emailCell);

        const schoolCell = document.createElement('td');
        schoolCell.textContent = user.college;
        tr.appendChild(schoolCell);

        const actionCell = document.createElement('td');
        const button = document.createElement('button');
        if(!user.IsBlock){
            button.textContent = '封禁用户';
        }
        else if(user.IsBlock){
            button.textContent = '解除封禁';
        }
        button.onclick = () => toggleBan(button, user.id);
        actionCell.appendChild(button);
        tr.appendChild(actionCell);

        tbody.appendChild(tr);
    });
}

// 初始化表格
generateTable(users);

// 搜索用户
function searchUser() {
    const searchId = document.getElementById('search-input').value;
    const filteredUsers = users.filter(user => user.id == parseInt(searchId));
    console.log(parseInt(searchId));
    generateTable(filteredUsers);
}

// 显示全部用户
function showAllUsers() {
    generateTable(users);
}

// 发布通知
function publishNotification() {
    alert('发布通知功能尚未实现');
}

// 查看历史通知
function viewHistory() {
    alert('查看历史通知功能尚未实现');
}

// 封禁/解除封禁用户
function toggleBan(button, userId) {
    if (button.textContent === '封禁用户') {
        blockUser(button, userId);
        alert(`用户ID ${userId} 已被封禁`);
    } else {
        unblockUser(button, userId);
        alert(`用户ID ${userId} 已解除封禁`);
    }
}

function blockUser(button, userId){
    var data = {
        get_account: {isRequest: false},
        block_user: {isRequest: true, account_id: userId},
        unblock_user: {isRequest: false},
        create_notice: {isRequest: false}
    };

    var url = "/main/account";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            console.log("response.status="+response.status);
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
                console.log(data.message);
                button.textContent = '解除封禁';
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function unblockUser(button, userId){
    var data = {
        get_account: {isRequest: false},
        block_user: {isRequest: false},
        unblock_user: {isRequest: true, account_id: userId},
        create_notice: {isRequest: false}
    };

    var url = "/main/account";
    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            console.log("response.status="+response.status);
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
                console.log(data.message);
                button.textContent = '封禁用户';
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });

}

/*发通知*/
// 显示悬浮框
function showNotificationModal() {
    const modal = document.getElementById('notification-modal');
    modal.style.display = 'flex';
}

// 隐藏悬浮框
function hideNotificationModal() {
    const modal = document.getElementById('notification-modal');
    selectedUsers = [];
    document.getElementById('selected-users').innerHTML = '';
    document.getElementById('selected-user-list').innerHTML = '';
    modal.style.display = 'none';
}

// 发布通知按钮点击事件
function publishNotification() {
    showNotificationModal();
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    generateUserList();
    restoreSelectedUsers();
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function generateUserList() {
    let userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        let userLi = document.createElement('li');
        userLi.innerText = `${user.name} (ID: ${user.id})`;
        userLi.setAttribute('data-id', user.id);
        userLi.onclick = () => toggleUser(userLi);
        userList.appendChild(userLi);
    });
}

function toggleUser(userLi) {
    let userId = userLi.getAttribute('data-id');
    if (userLi.classList.contains('selected')) {
        userLi.classList.remove('selected');
        selectedUsers = selectedUsers.filter(id => id !== userId);
    } else {
        userLi.classList.add('selected');
        selectedUsers.push(userId);
    }
    updateSelectedUsers();
}

function updateSelectedUsers() {
    let selectedUserList = document.getElementById('selected-user-list');
    selectedUserList.innerHTML = '';
    selectedUsers.forEach(userId => {
        let userLi = document.querySelector(`.user-list li[data-id="${userId}"]`);
        if (userLi) {
            let userName = userLi.innerText;
            let li = document.createElement('li');
            li.innerText = userName;
            selectedUserList.appendChild(li);
        }
    });
}

function restoreSelectedUsers() {
    let userList = document.querySelectorAll('.user-list li');
    userList.forEach(userLi => {
        if (selectedUsers.includes(userLi.getAttribute('data-id'))) {
            userLi.classList.add('selected');
        } else {
            userLi.classList.remove('selected');
        }
    });
}

function confirmSelection() {
    let selectedUserNames = selectedUsers.map(userId => {
        let userLi = document.querySelector(`.user-list li[data-id="${userId}"]`);
        if (userLi) {
            return userLi.innerText;
        }
        return '';
    });
    document.getElementById('selected-users').innerText = selectedUserNames.join(', ');
    closeModal();
}

function submitForm() {
    let content = document.getElementById('content').value;

    console.log('Content:', content);
    console.log('Selected Users:', selectedUsers);

    // 构建带有查询参数的 URL
    var url = "/main/account";
    var data = {
        get_account: {isRequest: false},
        block_user: {isRequest: false},
        unblock_user: {isRequest: false},
        create_notice: {isRequest: true, content: content, users: selectedUsers}
    };

    // 发送 GET 请求
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
        .then(data => {
            if(data.code === 0){
                console.log("发送成功")
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });

    hideNotificationModal();
}