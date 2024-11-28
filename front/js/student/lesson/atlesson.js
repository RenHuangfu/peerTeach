var urlParams = new URLSearchParams(window.location.search);
var lessonId = parseInt(urlParams.get('lessonID'));
let socket = {}; // WebSocket对象 
let wsurl = 'ws://'+document.location.host+'/at_lesson/ws';
let slide_list=[];
let questions_list=[];
let currentIndex = 0;  //给每道题一个单独的index，因为可能会多次发送同一道题
let currentQuestion = {};
let havePPT = false; 
const alphabet = Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i));

// 获取图片的函数
function startLesson() {
    socket = new WebSocket(wsurl);  //建立连接
        
    // 监听连接打开事件
    socket.onopen = function(event) {
        console.log('WebSocket is open now.');

        const data = {
            ready_lesson: {
            is_request:true,
            lesson_id: lessonId
            }
        };

        const jsonString = JSON.stringify(data);
        socket.send(jsonString);
    };

    socket.onmessage = function(event){
        processMessage(event);
    }
}


function processMessage(event) {
    const data = JSON.parse(event.data);
    console.log('Received data:', data);
    var types = Object.keys(data);  //获取所有键值
    var type = "";
    types.forEach( key => {
        if(data[key].is_response === true){
            type = key;
            return;
        }
    })
    switch (type) {
        case 'PPTRes':{   //获取PPT编号
            renderPPT(data.PPTRes.PPtID);
            break;
        }
        case 'question_res':{   //获取问题id
            getQuestion(data.question_res.question, data.question_res.time, data.question_res.round)
            break;
        }
        case 'discussion_res':{  //获取所有讨论内容
            handleServerUpdate(data.discussion_res);
            break;
        }
    }
}

function renderPPT(index) {
    var i = 0;
    if(!havePPT){
        while (i<=index) {
            renderSinglePPT(i++);
        }
        havePPT = true;
    }
    else{
        renderSinglePPT(index);
    }
}

function renderSinglePPT(index){
    const slideContainer = document.getElementById("swiperproflie2");
    const slide = document.createElement("div");
    slide.className = "profile-slide";

    // 设置点击事件处理器
    slide.onclick = () => showSlide(index);

    // 创建一个新的img元素
    const img = document.createElement("img");
    img.src = `/file/PPTJPG_${lessonId}-${index+1}.jpg`;
    img.alt = "ppt";

    // 将img元素添加到div元素中
    slide.appendChild(img);

    // 将div元素添加到容器最上方
    slideContainer.prepend(slide);
}

function showSlide(index){
    var container = document.querySelector(".slide-content")
    container.innerHTML = `<img id="slideImage" src="./pic2.png" alt="ppt" style="width: 100%; height:100%">`
    document.getElementById("slideImage").src = `/file/PPTJPG_${lessonId}-${index+1}.jpg`; // 显示图片
}

function getQuestion(questionIds, time, round) {
    var data = {
        get_question_detail:{isRequest: true, question_id:parseInt(questionIds)}
    };

    fetch('/resourceDetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("get_question",_data);
            var q = _data.data;
            q.round = round;
            q.index = currentIndex++;  //给每道题一个单独的index，因为可能会多次发送同一道题
            questions_list.push(q);
            renderQuestion(q, time, round);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderQuestion(question, time){   //将题目渲染到右侧列表中
    const container = document.getElementById("swiperproflie2");

    const questionDiv = document.createElement("div");
    questionDiv.className = "profile-slide";
    questionDiv.onclick = function(){
        showQuestion(question.index);
    }
    
    const countdown = document.createElement("div");
    countdown.innerHTML = `<div class="countdown-small" index="${question.index}">倒计时</div>`;
    questionDiv.appendChild(countdown);

    const questionSpan = document.createElement("span");
    questionSpan.textContent = `${question.title}`;
    questionDiv.appendChild(questionSpan);

    question.options.Options.forEach((option,index) => {
    const optionSpan = document.createElement("span");
    optionSpan.textContent = `${alphabet[index]}. ${option.text}`;
    questionDiv.appendChild(optionSpan);
    });
    container.prepend(questionDiv);

    updateCountdown(question.index, time); //开始倒计时
}

function showQuestion(index){  //查看题目详情
    console.log("showQuestion ",index);
    var question = questions_list.find((item) => item.index === index);
    currentQuestion = question;
    if(question){
    const isMultipleChoice = question.options.Options.filter(opt => opt.IsCorrect).length > 1;

    const container = document.querySelector(".slide-content")
    container.innerHTML = ``
    container.setAttribute("index",index);  //给当前题目一个index，方便提交答案时获取
    //添加倒计时模块
    const countdown = document.createElement("div");
    const countdown2 = document.createElement("div");
    countdown2.id = "countdown";
    countdown2.textContent = "未开始";
    countdown2.setAttribute("index",index);
    countdown.appendChild(countdown2)
    container.appendChild(countdown);
    //添加题目
    const questionDiv = document.createElement("div");
    questionDiv.className = "profile-slide";    
    const questionSpan = document.createElement("span");
    questionSpan.textContent = `${question.title}`;
    questionDiv.appendChild(questionSpan);

    question.options.Options.forEach((opt, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = isMultipleChoice ? "checkbox" : "radio";
      input.name = "answer";
      input.value = index;

      const label = document.createElement("label");
      label.textContent =  `${alphabet[index]}. ${opt.text}`;

      const reasonInput = document.createElement("input");
      reasonInput.type = "text";
      reasonInput.placeholder = "请输入理由";
      reasonInput.className = "reason-input";
      reasonInput.setAttribute("index",index);   //给理由设置index，方便提交答案时获取

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      optionDiv.appendChild(reasonInput);

      questionDiv.appendChild(optionDiv);
    });
    container.appendChild(questionDiv);
    //添加提交按钮
    const buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = `<button type="button" class="submit-button" id="submit-button" onclick="submitAnswer()">提交答案</button>`;
    container.appendChild(buttonDiv);

    generateDiscussion();
    }
}

function updateCountdown(index, secondsRemaining) {   //默认一次只有一个倒计时
    const countdownElement = document.getElementById('countdown');
    const countdownElements = document.querySelectorAll('.countdown-small');
    var countdownElement2 = null;
    countdownElements.forEach(element => {
        if(element.getAttribute("index") == index){
            countdownElement2 = element;
            return
        }
    })

    // 计算剩余的分钟和秒数
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    // 格式化分钟和秒数，确保它们始终是两位数
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if(countdownElement && countdownElement.getAttribute("index") == index){
        // 如果倒计时结束，显示提示信息
        if (secondsRemaining <= 0) {
            countdownElement.textContent = '时间到';
            countdownElement.style.color = 'red';
            return;
        }
        // 更新页面上的倒计时显示
        countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    if(countdownElement2){
        // 如果倒计时结束，显示提示信息
        if (secondsRemaining <= 0) {
            countdownElement2.textContent = '时间到';
            countdownElement2.style.color = 'red';
            return;
        }
        // 更新页面上的倒计时显示
        countdownElement2.textContent = `答题时间剩余：${formattedMinutes}:${formattedSeconds}`;
    }
    
    // 每秒更新一次倒计时
    setTimeout(() => updateCountdown(index, secondsRemaining - 1), 1000);
}

function submitAnswer(){
    const answerbutton = document.getElementById('submit-button');
    answerbutton.disabled = true;

    const selectedOptions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => parseInt(input.value));
    const selectedOption = document.querySelector('input[type="radio"]:checked')?.value;
    const questionIndex = parseInt(document.querySelector('.slide-content').getAttribute('index'));
    const question = questions_list.find((item) => item.index === questionIndex);
    const isMultipleChoice = question.options.Options.filter(opt => opt.IsCorrect).length > 1;
    const selectedOptionIndex = isMultipleChoice ? selectedOptions : [parseInt(selectedOption)];
    console.log(selectedOptionIndex);

    //发送回答
    if(selectedOptionIndex.length !== 0){
        var flag = true;
        selectedOptionIndex.forEach(index => {
            if(!question.options.Options[index].IsCorrect){
                flag = false;
            }
        })
        var data1 = {
            answer_question:{
                isRequest: true,
                is_correct: flag,
                question_id: question.questionId,
                option: selectedOptionIndex,
                round: question.round
            }
        }
        console.log("data1:",data1);
        socket.send(JSON.stringify(data1));
    }
    

    //发送理由
    const reasonInputs = document.querySelectorAll('.reason-input');
    const reasons = Array.from(reasonInputs).filter(input => selectedOptionIndex.includes(parseInt(input.getAttribute("index")))).map(input => {if(input.value!=="") return question.questionId+"##"+input.getAttribute("index")+"##"+input.value; else return ""});
    console.log(reasons);

    if(reasons.length !== 0){
        reasons.forEach(reason => {
            if(reason!==""){
                var data2 = {
                    make_discuss:{
                        isRequest:true,
                        content:reason
                    }
                }
                console.log(" make_discuss:",data2)
                socket.send(JSON.stringify(data2));
            }
        })
    }
}

// 开始获取图片
//fetchImages();
startLesson();