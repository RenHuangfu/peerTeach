// const message = {   
//     title: '下周进行中期汇报',   
//     time: '2024-10-28 21:07',   
//     content: '汇报内容为……',
//     files: [  
//         { name: '报告PPT.pptx', url: 'js/announcement.js' },  
//         { name: '数据表格.xlsx', url: 'css/announcement.css' }  
//     ]
// };

var urlParams = new URLSearchParams(window.location.search);
var classId = urlParams.get('class_id');
var announcementId = urlParams.get('announcementid');

var message = {};

let data ={
    get_announce_detail:{isRequest: true, announce_id: parseInt(announcementId)}
}

fetch('/announcement_detail',{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)}
)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.data===null){
            document.querySelector(".announcement-actions").style.display="none";
        }
        else{
            message.title = data.data.title;
            message.time = data.data.time;
            message.content = data.data.content;
            message.files = [];
            for(var i=1; i<=data.data.file_num; i++)
            {
                var url="/file/Announcement_"+announcementId+"_"+i;

            }
            loadAnno()
        }
    })
    .catch(error => {
        console.error('Error:',error);
    });

function loadAnno() {
    document.getElementById('announcement-title').textContent = message.title;
    document.getElementById('announcement-time').textContent = `发布时间：${formatDate(message.time)}`;
    document.getElementById('announcement-content').querySelector('p').textContent = message.content;
    const filesDiv = document.getElementById('files');
    filesDiv.innerHTML = ''; // 清空之前的文件列表

    // message.files.forEach(file => {
    //     const link = document.createElement('a');
    //     link.href = file.url;
    //     link.download = file.name;
    //     link.textContent = file.name;
    //     link.className = 'file-link';
    //     filesDiv.appendChild(link);
    // });
}

function deleteAnno(){
    let popup = document.querySelector('.modal');
    popup.classList.add('active');
}

function confirm(){
    var data = {
        delete_announcement: {isRequest: true, announce_id: parseInt(announcementId)}
    }
    fetch("/announcement_detail",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
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
            document.getElementById('announcement-title').textContent = '该公告已被删除';
            document.getElementById('announcement-time').textContent = '';
            document.getElementById('announcement-content').querySelector('p').textContent = '';
            let popup = document.querySelector('.modal');
            popup.classList.remove('active');
            const filesDiv = document.getElementById('files');
            filesDiv.innerHTML = ''; // 清空之前的文件列表
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function cancel(){
    let popup = document.querySelector('.modal');
    popup.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有的列表项
    var listItems = document.querySelectorAll('.horizontal-list li');
    // 更好的点击事件处理（不依赖查询参数）
    listItems.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            var targetPage = this.getAttribute('data-page');
            var newUrl = targetPage + (targetPage.includes('?') ? '&' : '?') + 'class_id=' + encodeURIComponent(classId);
            window.location.href = newUrl; // 直接跳转到目标页面并带上ClassID参数  
        });
    });
});
