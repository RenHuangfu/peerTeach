
function turnResource(){
    window.location.href = "/resource";
}

function turnCourse(){
    window.location.href = "/course";
}

function turnUserInfo(){
    window.location.href = "/user_info";
}

function formatDate(dateString){
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

   return `${year}-${month}-${day} ${hours}:${minutes}`;
}
