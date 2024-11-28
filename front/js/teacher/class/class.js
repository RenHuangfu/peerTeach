
var urlParams = new URLSearchParams(window.location.search);
var classId = urlParams.get('class_id');
let DeleteMessageId = 0;
let CurrentLab = 0;

var messages = [];
const perPage = 15; // 每页显示的消息数
let currentPage = 1; // 当前页码

function showTab(tabId) {
    // 隐藏所有标签页内容
    var contents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active-content');
    }
    // 隐藏所有激活的标签
    var tabs = document.getElementsByClassName('tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active-tab');
    }
    // 显示对应标签页的内容和标签
    document.getElementById(tabId + '-content').classList.add('active-content');
    document.querySelector('.tab[onclick="showTab(\'' + tabId + '\')"]').classList.add('active-tab');

    if(tabId=='class-tab'){
        CurrentLab = 1;
        // messages = messages1;
        // renderMessages(currentPage);
        url = '/class';
        var data = {
            get_lessons:{isRequest: true, class_id: parseInt(classId)},  //获取课堂列表
        }
        fetch(url ,{
            method: "POST", // 指定请求方法为 POST
            headers: {
                "Content-Type": "application/json" // 设置请求头
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.data.lessons && Array.isArray(data.data.lessons)) {
                    messages = data.data.lessons.map(post => ({
                        id: post.lesson_id,
                        name : post.name,
                        time: post.created
                    }));
                    console.log(messages);
                    renderMessages(currentPage);
                } else {
                    console.error('Data format error: PostList is not an array or does not exist.');
                }
            })
            .catch(error => {
                console.error('Error:',error);
            });
    }
    else if(tabId=='manage-tab'){
        CurrentLab = 2;
        // messages = messages2;
        // renderMessages(currentPage);
        url = '/class';
        var data = {
            get_members:{isRequest: true, class_id: parseInt(classId)},  //获取班级成员
        }
        fetch(url, {
            method: "POST", // 指定请求方法为 POST
            headers: {
                "Content-Type": "application/json" // 设置请求头
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.data && Array.isArray(data.data)) {
                    messages = data.data.map(post => ({
                        id: post.id,
                        name: post.name,
                        number: post.number
                    }));
                    console.log(messages);
                    renderMessages(currentPage);
                } else {
                    console.error('Data format error: PostList is not an array or does not exist.');
                }
            })
            .catch(error => {
                console.error('Error:',error);
            });
    }
    else if(tabId=='discussion-tab'){
        CurrentLab = 3;
        // messages = messages3;
        // renderMessages(currentPage);
        url = '/class';
        var data = {
            get_posts:{isRequest: true, class_id: parseInt(classId)},  //获取帖子信息
        }
        fetch(url, {
            method: "POST", // 指定请求方法为 POST
            headers: {
                "Content-Type": "application/json" // 设置请求头
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    console.log(data.data);
                    messages = data.data.map(post => ({
                        id: post.post_id,
                        time: post.create_time, // 临时替换
                        title: post.post_title,
                        like: post.post_likes,
                        comment: post.post_comment,
                        user_id: post.user_id,
                        user: post.user_name,
                        islike: post.islike // 根据实际情况处理
                    }));
                    console.log(messages);
                    renderMessages(currentPage);
                } else {
                    console.error('Data format error: PostList is not an array or does not exist.');
                }
            })
            .catch(error => {
                console.error('Error:',error);
            });
    }
    else{
        CurrentLab = 4;
        // messages = messages4;
        // renderMessages(currentPage);
        url = '/class';
        var data = {
            get_announcements:{isRequest: true, class_id: parseInt(classId)},  //获取公告
        }
        fetch(url, {
            method: "POST", // 指定请求方法为 POST
            headers: {
                "Content-Type": "application/json" // 设置请求头
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.data);
                if (data.data && Array.isArray(data.data)) {
                    messages = data.data.map(post => ({
                        id: post.announcement_id,
                        title : post.title,
                        time: post.time,
                        user: post.teacher_name,
                    }));
                    console.log(messages);
                    renderMessages(currentPage);
                } else {
                    console.error('Data format error: PostList is not an array or does not exist.');
                }
            })
            .catch(error => {
                console.error('Error:',error);
            });
    }
}

window.onload = function() {
    // 默认显示课堂页面
    showTab('class-tab');

};

function renderMessages(page) {
    if(CurrentLab==1){
        const messageList = document.getElementById('messageList1');
        const pageInfo = document.getElementById('pageInfo1');
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageMessages = messages.slice(startIndex, endIndex);

        // 清空现有消息项
        messageList.innerHTML = '';

        // 渲染消息项
        pageMessages.forEach((msg) => {
            const li = document.createElement('li');
            li.classList.add('message-item1');
            li.dataset.messageId = msg.id; // 添加data属性存储消息id

            // 创建详情元素
            const details = document.createElement('div');
            details.classList.add('message-details1');

            const name = document.createElement('span');
            name.textContent = msg.name;

            const time = document.createElement('span');
            time.textContent = ' ' + formatDate(msg.time); // 添加空格以改善格式
            // time.style.marginLeft = '10px'; // 添加一些左边距

            // 将用户和时间添加到详情元素中
            details.appendChild(name);
            details.appendChild(time);

            // 添加点击事件以根据id跳转
            li.addEventListener('click', () => window.location.href = `/lesson?lesson_id=${msg.id}`);

            // 将详情元素添加到列表项中
            li.appendChild(details);

            // 将列表项添加到消息列表中
            messageList.appendChild(li);
        });
        // 更新分页信息
        const totalPages = Math.ceil(messages.length / perPage);
        pageInfo.textContent = `${page}/${totalPages}`;

    }
    else if(CurrentLab==2){
        const messageList = document.getElementById('messageList2');
        const pageInfo = document.getElementById('pageInfo2');
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageMessages = messages.slice(startIndex, endIndex);

        // 清空现有消息项
        messageList.innerHTML = '';

        // 渲染消息项
        pageMessages.forEach((msg, index) => {
            const li = document.createElement('li');
            li.classList.add('message-item2');
            li.dataset.messageId = msg.id; // 添加data属性存储消息id

            // 创建名字和号码元素
            const name = document.createElement('span');
            name.textContent = msg.name;

            const number = document.createElement('span');
            number.textContent = msg.number;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '移除该学生';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => confirmDeleteStudent(msg.id));

            // 将名字、号码和按钮添加到列表项中
            li.appendChild(name);
            li.appendChild(document.createTextNode(' '));
            li.appendChild(number);
            li.appendChild(document.createElement('br'));
            li.appendChild(deleteButton);

            // 将列表项添加到消息列表中
            messageList.appendChild(li);
        });
        // 更新分页信息
        const totalPages = Math.ceil(messages.length / perPage);
        pageInfo.textContent = `${page}/${totalPages}`;
    }
    else if(CurrentLab==3){
        const messageList = document.getElementById('messageList3');
        const pageInfo = document.getElementById('pageInfo3');
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageMessages = messages.slice(startIndex, endIndex);

        // 清空现有消息项
        messageList.innerHTML = '';

        // 渲染消息项
        pageMessages.forEach((msg, index) => {
            const li = document.createElement('li');
            li.classList.add('message-item3');
            li.dataset.messageId = msg.id; // 添加data属性存储消息id

            var newUrl = `post_detail?class_id=${encodeURIComponent(classId)}&post_id=${encodeURIComponent(msg.id)}`;
            li.addEventListener('click', (event) => {
                if(event.target.className !== "deletePostButton") {
                    console.log("li-jump")
                    window.open(newUrl);
                }
            });

            // 创建标题元素，并添加点击事件
            const title = document.createElement('h3');
            title.classList.add('message-title3');
            title.textContent = msg.title;



            // 创建详情元素
            const details = document.createElement('div');
            details.classList.add('message-details3');

            const photo = document.createElement('img');
            photo.src = "file/avatar_"+msg.user_id+".jpg";
            photo.style.width = '20px';
            photo.style.height = '20px';
            photo.style.marginRight = '10px';
            photo.style.borderRadius = '50%';
            photo.style.marginLeft = '5%';

            const user = document.createElement('span');
            user.style.marginRight = '10px';
            user.style.marginLeft = '10px';
            user.style.width = '200px';
            user.textContent = msg.user;

            const time = document.createElement('span');
            time.style.marginRight = '10px';
            time.style.marginLeft = '10px';
            time.style.width = '200px';
            time.textContent = formatDate(msg.time);

            const commentIcon = document.createElement('img');
            commentIcon.src = 'img/comment.jpg';
            commentIcon.style.width = '15px';
            commentIcon.style.height = '15px';
            commentIcon.style.marginLeft = '400px';
            const commentSpan = document.createElement('span');
            commentSpan.style.marginLeft = '20px';
            commentSpan.style.width = '50px';
            // commentSpan.appendChild(commentIcon);
            commentSpan.textContent += ` ${msg.comment}`;

            let likeIconSrc = msg.islike ? 'img/islike.jpg' : 'img/like.jpg';
            const likeIcon = document.createElement('img');
            likeIcon.src = likeIconSrc;
            likeIcon.style.width = '15px';
            likeIcon.style.height = '15px';
            likeIcon.style.marginLeft = '5px';
            const likeSpan = document.createElement('span');
            likeSpan.style.marginLeft = '20px';
            likeSpan.style.width = '50px';
            // likeSpan.appendChild(likeIcon);
            likeSpan.textContent += ` ${msg.like}`;

            // 将用户、时间、照片、评论和点赞信息添加到详情元素中
            details.appendChild(photo);
            details.appendChild(user);
            details.appendChild(time);
            details.appendChild(commentIcon);
            details.appendChild(commentSpan);
            details.appendChild(likeIcon);
            details.appendChild(likeSpan);

            // 将标题和详情元素添加到列表项中
            li.appendChild(title);
            li.appendChild(details);

            // 将列表项添加到消息列表中
            messageList.appendChild(li);
        });
        // 更新分页信息
        const totalPages = Math.ceil(messages.length / perPage);
        pageInfo.textContent = `${page}/${totalPages}`;
    }
    else{
        const messageList = document.getElementById('messageList4');
        const pageInfo = document.getElementById('pageInfo4');
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageMessages = messages.slice(startIndex, endIndex);

        // 清空现有消息项
        messageList.innerHTML = '';

        // 渲染消息项
        pageMessages.forEach((msg, index) => {
            const li = document.createElement('li');
            li.classList.add('message-item4');
            li.dataset.messageId = msg.id; // 添加data属性存储消息id
            var newUrl = `announcement_detail?class_id=${encodeURIComponent(classId)}&announcementid=${encodeURIComponent(msg.id)}`;
            li.addEventListener('click', (event) => {
                if(event.target.className !== "deletePostButton"){
                    window.open(newUrl,'AnnouncementDetail');
                }
            });

            // 创建标题元素，并添加点击事件
            const title = document.createElement('h3');
            title.classList.add('message-title4');
            title.textContent = msg.title;


            // 创建详情元素
            const details = document.createElement('div');
            details.classList.add('message-details4');

            const user = document.createElement('span');
            user.textContent = msg.user;

            const time = document.createElement('span');
            time.textContent = formatDate(msg.time);

            const deleteButton = document.createElement('button');
            deleteButton.className = "deletePostButton";
            deleteButton.textContent = '删除';
            deleteButton.addEventListener('click', () => confirmDeleteAnnouncement(msg.id));

            // 将用户、时间和按钮添加到详情元素中
            details.appendChild(user);
            details.appendChild(time);
            details.appendChild(deleteButton);

            // 将标题和详情元素添加到列表项中
            li.appendChild(title);
            li.appendChild(details);

            // 将列表项添加到消息列表中
            messageList.appendChild(li);
        });
        // 更新分页信息
        const totalPages = Math.ceil(messages.length / perPage);
        pageInfo.textContent = `${page}/${totalPages}`;
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMessages(currentPage);
    }
}

function nextPage() {
    const totalPages = Math.ceil(messages.length / perPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderMessages(currentPage);
    }
}

function confirmDeleteStudent(messageId) {
    let popup = document.getElementById('DeleteStudentModal');
    popup.classList.add('active');
    document.getElementById('DeleteName').textContent = messages.find(msg => msg.id === messageId).name;
    DeleteMessageId = messageId;
}

function DeleteStudent(){
    var url = '/class';
    var data = {
        delete_student:{isRequest: true, class_id: parseInt(classId), student_id: parseInt(DeleteMessageId)}, //移除班级成员
    }
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if(data.code===0){
                console.log("Response data:",data);
                const index = messages.findIndex(msg => msg.id === DeleteMessageId);
                if (index !== -1) {
                    messages.splice(index, 1); // 从数组中删除消息
                    renderMessages(currentPage); // 重新渲染当前页面
                }
                let popup = document.getElementById('DeleteStudentModal');
                popup.classList.remove('active');
            }
            else
            {
                console.log("服务器错误：",data.msg)
            }
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function CancelDeleteStudent(){
    let popup = document.getElementById('DeleteStudentModal');
    popup.classList.remove('active');
}

let key = 543210; // 密钥
function xorEncrypt(classId, key) {
    // 将班级 ID 和密钥转换为二进制字符串
    let classIdBinary = classId.toString(2).padStart(32, '0'); // 假设班级 ID 是 32 位的整数
    let keyBinary = key.toString(2).padStart(32, '0'); // 假设密钥是 32 位的整数

    // 进行异或运算
    let encryptedBinary = '';
    for (let i = 0; i < classIdBinary.length; i++) {
        encryptedBinary += classIdBinary[i] ^ keyBinary[i];
    }

    // 将二进制字符串转换为整数
    let encryptedInt = parseInt(encryptedBinary, 2);

    // 将整数转换为字符串形式的邀请码
    let inviteCode = encryptedInt.toString(36); // 使用 36 进制表示法，生成更短的字符串

    return inviteCode;
}

function showInviteCode(){
    let popup = document.querySelector('.inviteModal');
    popup.classList.add('active');
    const codeInfo = document.getElementById('codeInfo');
    codeInfo.textContent = xorEncrypt(parseInt(classId),key);
}

function closebtn(){
    let popup = document.querySelector('.inviteModal');
    popup.classList.remove('active');
}

function copy(){
    const codeInfo = document.getElementById('codeInfo');
    const codeText = codeInfo.textContent || codeInfo.innerText; // 兼容不同浏览器获取文本内容

    navigator.clipboard.writeText(codeText).then(function() {
        alert('邀请码已复制到剪贴板！');
    }).catch(function(err) {
        console.error('无法复制文本：', err);
        alert('无法复制邀请码，请尝试再次点击或手动复制。');
    });
}

function confirmDeleteAnnouncement(messageId) {
    let popup = document.getElementById('DeleteAnnouncementModal');
    popup.classList.add('active');
    DeleteMessageId = messageId;
}

function DeleteAnnouncement(){
    var url = '/class';
    var data = {
        delete_announcement:{isRequest: true, class_id: parseInt(classId), announcement_id: parseInt(DeleteMessageId)} //删除公告
    }
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Response data:",data);
            const index = messages.findIndex(msg => msg.id === DeleteMessageId);
            if (index !== -1) {
                messages.splice(index, 1); // 从数组中删除消息
                renderMessages(currentPage); // 重新渲染当前页面
            }
            let popup = document.getElementById('DeleteAnnouncementModal');
            popup.classList.remove('active');
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function CancelDeleteAnnouncement(){
    let popup = document.getElementById('DeleteAnnouncementModal');
    popup.classList.remove('active');
}

function CreateAnno(){
    const createAnnoModal = document.getElementById('createAnnoModal');
    createAnnoModal.classList.add('active');
}

function cancelCreateAnno(type){
    const createAnnoModal = document.getElementById('createAnnoModal');
    createAnnoModal.classList.remove('active');
    if(type==0)
    {
        deleteAnnoForm();
    }
}

function deleteAnnoForm(){
    document.getElementById('anno-title').value ="";
    document.getElementById('anno-content').value ="";
    document.getElementById('anno-attachment').value ="";
}

function CreateMes(){
    const createPostModal = document.getElementById('createPostModal');
    createPostModal.classList.add('active');
}

function cancelCreateMes(type){
    const createPostModal = document.getElementById('createPostModal');
    createPostModal.classList.remove('active');
    if(type==0)
    {
        deleteMesForm();
    }
}

function deleteMesForm(){
    document.getElementById('title').value ="";
    document.getElementById('content').value ="";
    document.getElementById('upload-input').value ="";
}


function submitPost(){

    cancelCreateMes(1);  //仅关闭窗口

    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let attachment = document.getElementById('upload-input').files;
    let file_number = attachment.length;

    console.log('Title:', title);
    console.log('Content:', content);
    console.log('image:', attachment);

    var data = {
        create_post:{isRequest: true, title:title, content:content, file_number:file_number, class_id:parseInt(classId)},  //发贴
    }

    var url = "/class";
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
        .then(data => {
            if(data.code === 0){
                console.log("帖子发送成功",data.data.post_id);
                postAttachment(attachment, data.data.post_id, 1)   //调用函数发送附件
                    .then(responses => {
                        console.log('所有文件上传成功', responses);
                        deleteMesForm();  //清空表单
                        showTab('discussion-tab');
                    })
                    .catch(error => {
                        console.error('文件上传失败', error);
                    });

            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert("There was a problem with the fetch operation:"+ error);
        });

}

function submitAnno(){

    cancelCreateAnno(1);

    let title = document.getElementById('anno-title').value;
    let content = document.getElementById('anno-content').value;
    let attachment = document.getElementById('anno-attachment').files;
    let file_number = attachment.length;

    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Attachment:', attachment);

    var data = {
        create_announcements:{isRequest: true, title:title, content:content, file_number:file_number, class_id:parseInt(classId)},  //发公告
    }

    var url = "/class";
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
        .then(data => {
            if(data.code === 0){
                console.log("公告发送成功",data.data.announcement_id);
                postAttachment(attachment, data.data.announcement_id, 2)   //调用函数发送附件
                    .then(responses => {
                        console.log('所有文件上传成功', responses);
                        deleteAnnoForm();
                        showTab('anno-tab');
                    })
                    .catch(error => {
                        console.error('文件上传失败', error);
                    });

            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert("There was a problem with the fetch operation:"+ error);
        });
}

function postAttachment(attachment, id, type)
{
    console.log("发送附件")
    console.log(attachment)

    let uploadPromises = [];

    var prefix = "";
    var url = "";
    if(type===1){
        prefix = "Post_";
        url = "/file";
    }
    else{
        prefix = "Announcement_";
        url = "/file";
    }

    for(var i=0; i<attachment.length; i++){
        var file = attachment[i];
        const newFileName = `${prefix}${id}_${i + 1}_${file.name}`;
        console.log(newFileName);
        uploadPromises.push(postFile(file, newFileName, url));
    }

    return Promise.all(uploadPromises);
}


function postFile(file, fileName, url){  //文件和该文件的文件名
    var formData = new FormData();
    formData.append('file', file, fileName);

    return fetch(url, {
        method: "POST", // 指定请求方法为 POST
        body: formData
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                {
                    return response.json(); // 解析响应为 JSON
                }

            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                console.log("文件",fileName,"发送成功");
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function startLesson(){
    window.location.href = "/at_lesson";
    sessionStorage.setItem("class_id",classId)
}

// window.addEventListener('load', function () {
//     // 页面完全加载后执行的代码
//     renderMessages(currentPage);
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // 获取所有的列表项
//     var listItems = document.querySelectorAll('.horizontal-list li');
//     // 更好的点击事件处理（不依赖查询参数）
//     listItems.forEach(function(item) {
//         item.addEventListener('click', function(event) {
//             event.preventDefault();
//             var targetPage = this.getAttribute('data-page');
//             var newUrl = targetPage + (targetPage.includes('?') ? '&' : '?') + 'class_id=' + encodeURIComponent(classId);
//             window.location.href = newUrl; // 直接跳转到目标页面并带上ClassID参数
//         });
//     });
// });