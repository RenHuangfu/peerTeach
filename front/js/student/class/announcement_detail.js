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
fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=2131cdd2359160')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        message.title = data.Title;
        message.time = data.time;
        message.content = data.content;
        message.files = data.Files.map(post => ({
            name: post.name,
            url : post.url
        }));
        loadAnno();
    })
    .catch(error => {
        console.error('Error:',error);
    });  
  
function loadAnno() {  
    document.getElementById('announcement-title').textContent = message.title;  
    document.getElementById('announcement-time').textContent = `发布时间：${message.time}`;  
    document.getElementById('announcement-content').querySelector('p').textContent = message.content;  
    const filesDiv = document.getElementById('files');  
    filesDiv.innerHTML = ''; // 清空之前的文件列表  
  
    message.files.forEach(file => {  
        const link = document.createElement('a');  
        link.href = file.url;  
        link.download = file.name;  
        link.textContent = file.name;  
        link.className = 'file-link'; 
        filesDiv.appendChild(link);  
    });   
}  

// window.addEventListener('load', function () {      
//     // 页面完全加载后执行的代码      
//     loadAnno();     
// });

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
