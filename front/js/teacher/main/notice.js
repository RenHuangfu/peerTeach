// 示例通知数据
let notifications = [];


// 当前页码和每页显示的通知数
let currentPage = 1;
const notificationsPerPage = 5; // 每页显示的通知数

// 加载通知列表
function loadNotifications(page) {
    const notificationList = document.getElementById("notification-list");
    notificationList.innerHTML = '';

    // 计算当前页的通知范围
    const start = (page - 1) * notificationsPerPage;
    const end = start + notificationsPerPage;
    const pageNotifications = notifications.slice(start, end);


    // 创建通知项
    pageNotifications.forEach(notification => {
        const notificationItem = document.createElement("div");
        notificationItem.classList.add("notification-item");
        notificationItem.innerHTML = `
            <p class="message">${notification.text}</p>
            <p class="timestamp">接收时间：${formatDate(notification.send_time)}</p>
        `;
        console.log(notification.id)
        notificationItem.onclick = () => viewDetails(notification.id);
        notificationList.appendChild(notificationItem);
    });

    // 更新页码指示器
    document.getElementById("page-indicator").textContent = `${page}/${Math.ceil(notifications.length / notificationsPerPage)}`;
}

// 下一页
function nextPage() {
    if (currentPage < Math.ceil(notifications.length / notificationsPerPage)) {
        currentPage++;
        loadNotifications(currentPage);
    }
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadNotifications(currentPage);
    }
}

// 初始化加载第一页
loadNotifications(currentPage);


document.addEventListener("DOMContentLoaded", function() {
    // 获取通知数据
    let data = {
        get_notification:{isRequest:true}
    }

    fetch("/notice", {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        // 替换为实际的 API 地址
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data && data.data && data.data.notices) {
                notifications = data.data.notices;
                var noticeId=0;
                notifications.forEach(notification=>{
                    notification.id = noticeId;
                    noticeId++;
                })
                loadNotifications(1);
            } else {
                console.warn("未找到通知数据。");
            }
        })
        .catch(error => {
            console.error("获取通知数据失败:", error);
        });
});


// 查看详情
function viewDetails(id) {
    const notification = notifications.find(n => n.id === id);
    console.log("id:",id)
    if (notification) {
        // // 确保所有需要的信息都在这里
        // localStorage.setItem("notificationDetails", JSON.stringify(notification));
        // window.location.href = "notification_details_2.html"; // 确保这个路径是正确的
        document.getElementById("modal").style.display = "block";
        const detailsContainer = document.getElementById('notification-details');
        detailsContainer.innerHTML = `
            <p class="message"><strong>消息内容：</strong>${notification.text}</p>
            <p class="timestamp"><strong>接收时间：</strong>${formatDate(notification.send_time)}</p>
        `;
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}   

