// 示例数据，实际使用时应该通过API获取  
// const postData = {  
//     title: "示例帖子",  
//     photo: "img/photo.jpg",  
//     name: "发帖者",  
//     time: "2023-10-01 12:00",  
//     content: "这是帖子的内容。",  
//     isuser: true,  
//     like: 10,  
//     comment: 3,  
//     islike: true,  
//     picture: ["img/photo.jpg", "img/comment.jpg"],
//     comments: [  
//         {  
//             id: 1,  
//             name: "评论者1",  
//             photo: "img/photo.jpg",  
//             time: "2023-10-01 12:10",  
//             content: "这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。这是评论1的内容。",  
//             like: 5,  
//             islike: false,  
//             isuser: false  
//         },  
//         {  
//             id: 2,  
//             name: "评论者3",  
//             photo: "img/photo.jpg",  
//             time: "2023-10-03 12:10",  
//             content: "这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。这是评论3的内容。",  
//             like: 5,  
//             islike: true,  
//             isuser: false  
//         }, 
//         {  
//             id: 3,  
//             name: "评论者2",  
//             photo: "img/photo.jpg",  
//             time: "2023-10-01 12:20",  
//             content: "这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。这是评论2的内容。",  
//             like: 2,  
//             islike: true,  
//             isuser: true  
//         }  
//     ]  
// };  


var urlParams = new URLSearchParams(window.location.search);
var classId = urlParams.get('class_id');
var postId = urlParams.get('post_id');

let DeleteMessageId = 0;
var postData = {};

function get(){
    var data = {
        get_post_detail:{isRequest:true,post_id:parseInt(postId)},
        delete_post:{isRequest: false},
        delete_comment:{isRequest:false},
        like_post:{isRequest:false},
        like_comment:{isRequest:false},
        create_comment:{isRequest:false}
    }
    fetch('/post_detail',{
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json"
        }, // 设置请求头,
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.data);
            postData.title = data.data.post_detail.post_title;
            postData.time = data.data.post_detail.create_time;
            postData.name = data.data.post_detail.user_name;
            postData.content = data.data.post_detail.post_content;
            postData.isuser = data.data.post_detail.isself;
            postData.like = data.data.post_detail.post_likes;
            postData.comment = data.data.post_detail.post_comment;
            postData.islike = data.data.post_detail.islike;
            var photo_num = data.data.post_detail.photo_num;
            var post_id = data.data.post_detail.post_id;
            while (photo_num >0){
                postData.picture.push();
                photo_num--;
            }
            console.log("comment:",postData.comment)
            if(postData.comment!==0){
                postData.comments = data.data.comments.map(post => ({
                    id: post.comment_id,
                    name : post.user_name,
                    time : post.create_time,
                    content : post.comment_content,
                    like : post.comment_likes,
                    islike : post.islike,
                    isuser : post.isself
                }));
            }
            else if(postData.comment===0)
            {
                postData.comments = [];
            }
            renderPost(postData);
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

window.addEventListener('load', function () {
    // 页面完全加载后执行的代码
    get();
});

document.addEventListener('DOMContentLoaded', () => {
    renderPost(postData);
    document.getElementById('comment-content').addEventListener('input', () => {
        const commentContent = document.getElementById('comment-content').value;
        document.getElementById('addComment').disabled = !commentContent.trim();
    });
});

function renderPost(postData) {
    // 渲染帖子标题和删除按钮
    // const postTitle = document.querySelector('.post-title span:first-child');
    // postTitle.textContent = postData.title;
    document.getElementById('title').textContent = postData.title;
    const deleteBtn = document.querySelector('.post-delete-btn');
    if (postData.isuser) {
        deleteBtn.classList.add('active');
    } else {
        deleteBtn.classList.remove('active');
    }
    deleteBtn.addEventListener('click', () => confirmDelete1());

    // 渲染帖子信息
    document.querySelector('.post-info img').src = postData.photo;
    document.getElementById('name').textContent = postData.name;
    document.getElementById('time').textContent = postData.time;
    document.getElementById('content').textContent = postData.content;

    // 渲染帖子点赞按钮和点赞数
    const likeBtn = document.querySelector('.like-btn');

    if(postData.islike){
        likeBtn.src ='/img/islike.jpg';
    }else{
        likeBtn.src ='/img/like.jpg';
    }
    let likeBtnSpan = document.getElementById("like-btn-span");
    likeBtn.classList.toggle('liked', postData.islike);
    document.querySelector('.like-section span:last-child').textContent = postData.like;
    likeBtn.onclick = function (event) {

        var data = {
            get_post_detail:{isRequest:false},
            delete_post:{isRequest:false},
            delete_comment:{isRequest:false},
            like_post:{isRequest: true,post_id:parseInt(postId)},
            like_comment:{isRequest:false},
            create_comment:{isRequest:false}
        }
        fetch('/post_detail',{
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
                postData.islike = !postData.islike;
                postData.like += postData.islike ? 1 : -1;
                document.querySelector('.like-section span:last-child').textContent = postData.like;
                likeBtn.src = postData.islike ? 'img/islike.jpg' : 'img/like.jpg';
            })
            .catch(error => {
                console.error('Error:',error);
            });
    };

    document.querySelector('.comment-section span:last-child').textContent = postData.comment;

    const picturesContainer = document.getElementById('post-pictures');
    // picturesContainer.classList.add('post-pictures');
    picturesContainer.innerHTML = '';

    if (Array.isArray(postData.picture)) {
        postData.picture.forEach(pictureUrl => {
            const img = document.createElement('img');
            img.src = pictureUrl;
            img.alt = 'Post Picture';
            img.style.cursor = 'pointer'; // 添加鼠标指针样式
            img.addEventListener('click', () => openModal(pictureUrl)); // 添加点击事件
            picturesContainer.appendChild(img);
        });
    } else if (typeof postData.picture === 'string') {
        const img = document.createElement('img');
        img.src = postData.picture;
        img.alt = 'Post Picture';
        picturesContainer.appendChild(img);
    }

    if(postData.comment)
    {
        readerComment();
    }
}
function readerComment(){
    // 渲染评论列表
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';

    postData.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const commentUserInfo = document.createElement('div');
        commentUserInfo.classList.add('comment-userinfo');
        // 评论照片
        const commentPhoto = document.createElement('img');
        commentPhoto.src = comment.photo;
        commentPhoto.classList.add('comment-photo');
        commentUserInfo.appendChild(commentPhoto);

        // 评论信息
        const commentInfo = document.createElement('div');
        commentInfo.classList.add('comment-info');

        const commentNameTime = document.createElement('div');
        const commentName = document.createElement('span');
        commentName.textContent = comment.name;
        const commentTime = document.createElement('span');
        commentTime.textContent = comment.time;
        commentInfo.appendChild(commentName);
        commentInfo.appendChild(commentTime);
        commentUserInfo.appendChild(commentInfo);
        commentDiv.appendChild(commentUserInfo);

        // 评论内容和点赞按钮
        const commentContentWrapper = document.createElement('div');
        commentContentWrapper.classList.add('comment_Content');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');
        const commentText = document.createElement('span');
        commentText.textContent = comment.content;
        commentContent.appendChild(commentText);
        commentContentWrapper.appendChild(commentContent);

        const commentDeleteBtn = document.createElement('button');
        commentDeleteBtn.textContent = '删除';
        commentDeleteBtn.classList.add('comment-delete-btn');
        if (comment.isuser) {
            commentDeleteBtn.classList.add('active');
        } else {
            commentDeleteBtn.classList.remove('active');
        }
        commentDeleteBtn.addEventListener('click', () => confirmDelete2(comment.id));

        commentContentWrapper.appendChild(document.createTextNode(' ')); // 添加空格以分隔按钮
        commentContentWrapper.appendChild(commentDeleteBtn);

        const commentLikeBtn = document.createElement('img');
        commentLikeBtn.src = comment.islike ? 'img/islike.jpg' : 'img/like.jpg';
        commentLikeBtn.classList.add('comment-like-btn');
        const commentLike = document.createElement('span');
        commentLike.textContent = comment.like;
        commentLikeBtn.classList.toggle('liked', comment.islike);
        commentContentWrapper.appendChild(commentLikeBtn);
        commentContentWrapper.appendChild(commentLike);

        commentDiv.appendChild(commentContentWrapper);

        commentList.appendChild(commentDiv);

        // 评论点赞按钮点击事件
        commentLikeBtn.addEventListener('click', () => {
            var data = {
                get_post_detail:{isRequest:false},
                delete_post:{isRequest: false},
                delete_comment:{isRequest:false},
                like_post:{isRequest:false},
                like_comment:{isRequest:true,post_id:parseInt(postId),comment_id:parseInt(comment.id)},
                create_comment:{isRequest:false}
            }
            fetch('/post_detail',{
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
                    comment.islike = !comment.islike;
                    comment.like += comment.islike ? 1 : -1;
                    commentLike.textContent = comment.like;
                    commentLikeBtn.src = comment.islike ? 'img/islike.jpg' : 'img/like.jpg';
                })
                .catch(error => {
                    console.error('Error:',error);
                });
        });
    });
}
// 打开模态框并显示图片

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = imageSrc;
    modal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

function addComment() {
    const commentContent = document.getElementById('comment-content').value.trim();
    const time = new Date().toLocaleString();
    // const newComment = {
    //     id: 111111,
    //     name: 'aaaaaaaaaaa',
    //     photo: "img/photo.jpg", // 这里可以使用用户头像URL
    //     time: 'time',
    //     content: commentContent,
    //     like: 0,
    //     islike: false,
    //     isuser: true
    // };
    var data = {
        get_post_detail:{isRequest:false},
        delete_post:{isRequest: false},
        delete_comment:{isRequest:false},
        like_post:{isRequest:false},
        like_comment:{isRequest:false},
        create_comment:{isRequest:true,post_id:parseInt(postId), content:commentContent}
    }
    fetch('/post_detail',{
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
            var newComment = {};
            newComment.id = data.data.comment_id;
            newComment.name = "111";
            newComment.photo = "/avatar.jpg";
            newComment.time = formatDate(time);
            newComment.content = commentContent;
            newComment.like = 0;
            newComment.islike = false;
            newComment.isuser = true;
            postData.comments.push(newComment);
            postData.comment += 1;
            document.getElementById('comment-content').value = '';
            document.getElementById('comment').textContent = postData.comment;
            readerComment();
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function confirmDelete1(){
    let popup = document.querySelector('.modal_1');
    popup.classList.add('active');
}

function confirm1(){
    var data = {
        get_post_detail:{isRequest:false},
        delete_post:{isRequest: true, post_id:parseInt(postId)},
        delete_comment:{isRequest:false},
        like_post:{isRequest:false},
        like_comment:{isRequest:false},
        create_comment:{isRequest:false}
    }
    fetch('/post_detail',{
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
            var newUrl = `/class?class_id=${classId}`;
            // 跳转到新URL
            window.location.href = newUrl;
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function cancel1(){
    let popup = document.querySelector('.modal_1');
    popup.classList.remove('active');
}

function confirmDelete2(messageId){
    let popup = document.querySelector('.modal_2');
    popup.classList.add('active');
    DeleteMessageId = messageId;
}

function confirm2(){
    var data = {
        get_post_detail:{isRequest:false},
        delete_post:{isRequest: false},
        delete_comment:{isRequest:true,post_id:parseInt(postId),comment_id: parseInt(DeleteMessageId)},
        like_post:{isRequest:false},
        like_comment:{isRequest:false},
        create_comment:{isRequest:false}
    }
    fetch('/post_detail',{
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
            const index = postData.comments.findIndex(c => c.id === DeleteMessageId);
            if (index !== -1) {
                postData.comments.splice(index, 1);
                readerComment();
                postData.comment-=1;
                document.getElementById('comment').textContent = postData.comment;
            }
            let popup = document.querySelector('.modal_2');
            popup.classList.remove('active');
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

function cancel2(){
    let popup = document.querySelector('.modal_2');
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