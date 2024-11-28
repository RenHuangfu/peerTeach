let socket = {}; // WebSocket对象 
let wsurl = 'ws://'+document.location.host+'/at_lesson/ws';
let lesson_id = 0;  //保存课堂id
let PPT_length = 0; //保存PPT幻灯片数量
let currentSlideIndex = 0; //保存当前幻灯片索引
let currentQuestionIndex = 0; //保存当前题目索引
let isShowPPT = true;   //当前选中的是否是幻灯片
let courseInput = '';
let classId = '';
let courseId = '';

let currentQuestion = {}; //保存当前题目
let totalResponses = 0;
let correctResponses = 0;
let optionResponses = [0, 0, 0, 0]; //保存每个选项的答题人数

let new_insert_question = {};

const alphabet = Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i));

const CHUNK_SIZE = 4*1024;
let totalChunks, currentChunk = 0;

let question_round = {}; //记录每道题发布了多少次

/*--------处理websocket--------*/
function startLesson() {
    courseId = document.getElementById('course').value;
    classId = document.getElementById('class').value;
    courseInput = document.getElementById('course-name').value;

    questions_list.forEach((question) => {
        question_round[question.questionId] = 0;
    });   //所有问题的发布次数为0


    if(!courseId || !classId){
        document.getElementById('error-message').textContent = '请选择课程和班级'
    } else if(courseInput==''){
        document.getElementById('error-message').textContent = '请输入课堂名称'
    } else if (courseId && classId && courseInput!='') {
        rePaint(); //重绘页面

        socket = new WebSocket(wsurl);  //建立连接
        console.log(wsurl)
        // 监听连接打开事件
        socket.onopen = function(event) {
            console.log('WebSocket is open now.');
        };

        socket.onmessage = function(event){
            console.log("get message from server")
            processMessage(event);
        }
    }

}

function postPPT() {
    totalChunks = Math.ceil(attachment.size / CHUNK_SIZE);  // 计算总块数
    currentChunk = 0;  // 重置当前块
    console.log(totalChunks)
    console.log(attachment.size)
    // 发送每个文件块
    sendNextChunk(attachment);
}

// 发送下一个文件块
function sendNextChunk() {
    const reader = new FileReader();
    const start = currentChunk * CHUNK_SIZE;
    const end = Math.min((currentChunk + 1) * CHUNK_SIZE, attachment.size);
    const chunk = attachment.slice(start, end);  // 获取文件的当前块

    reader.onload = function(e) {
        const data = e.target.result;

        // 通过 WebSocket 发送文件块
        socket.send(data);

        // 更新当前块索引，发送下一个块
        currentChunk++;
        if (currentChunk < totalChunks) {
            sendNextChunk(attachment);  // 递归发送下一个块
        } else {
            console.log(currentChunk)
            console.log('File upload complete');
        }
    };
    reader.readAsArrayBuffer(chunk);  // 读取文件块为 ArrayBuffer
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
        case 'start_lesson':{
            const data = {
                ready_lesson: {
                    is_request:true,
                    lesson_name: courseInput,
                    paper_id: parseInt(paperId),
                    class_id: parseInt(classId),
                    ppt_size: attachment.size
                }
            };
            console.log(data)
            const jsonString = JSON.stringify(data);
            console.log('start_lesson:',jsonString)
            socket.send(jsonString);
            break;
        }
        case 'ready_lesson':{   //开启课堂
            if(attachment && data.ready_lesson.is_start){
                lesson_id = parseInt(data.ready_lesson.lesson_id);
                postPPT();  //发送PPT
            }
            if(attachment && !data.ready_lesson.is_start){
                fetchImages();  //获取PPT
            }
            break;
        }
        case 'question_response':{  //获取答题情况
            updateChart(data);
            break;
        }
        case 'insert_question': {   //返回插入的题目的id
            questions_list.push({
                questionId: data.insert_question.question_id,
                options:{Options:new_insert_question.options.Options},
                title: new_insert_question.title
            })
            question_round[data.insert_question.question_id] = 0;  //设置新题目的轮次
            renderPaperDetail();  //重新渲染试卷
            break;
        } 
        case 'discussion_res':{   //获取讨论区内容
            handleServerUpdate(data.discussion_res);
            break;
        }
    }
}

function rePaint(){
    const container = document.querySelector('.part-container');

    // 创建新元素
    const newElement = document.createElement('div');
    newElement.className = "swiper-container";
    newElement.innerHTML= `<span style="
                font-size: 24px;
                text-align: center;
                display: block;
                margin-top: 20px;
              " >PPT预览</span >
                <div class="swiperproflie" id="swiperproflie1">
                <div id="slide-resolte-contaniner" >
                </div>
                </div>`;

    // 获取第一个子元素
    const firstChild = container.firstElementChild;

    // 在第一个子元素前插入新元素
    container.insertBefore(newElement, firstChild);
                    
    document.getElementById("slide-container").innerHTML = 
                    `<div class="slide-content">
                    </div>
                    <div class="discussion-container">
                        <div class="tabs" id="tabs"></div>
                        <div class="reason-display" id="reason-display">
                        讨论区关闭中，发布题目后开放
                        </div>
                    </div>
                    <div class="button-container">
                        <button onclick="prevSlide()">上一张</button>
                        <button onclick="openDialog4()">添加题目</button>
                        <button onclick="showToStudent()">展示</button>
                        <button onclick="nextSlide()">下一张</button>
                        <button onclick="endLesson()">下课</button>
                    </div>`
}


async function fetchImages(index = 0) {
    // 构建图片 URL

    const imageUrl = `/file/PPTJPG_${lesson_id}-${index+1}.jpg`;
    console.log("fetch:",imageUrl)

    // 尝试获取图片
    try {
        const response = await fetch(imageUrl);
        // 如果图片存在，继续获取下一张图片
        if (response.ok) {
            const slideContainer = document.getElementById("swiperproflie1");
            const slide = document.createElement("div");
            slide.className = "profile-slide";
        
            // 设置点击事件处理器
            slide.onclick = () => showSlide(index);
        
            // 创建一个新的img元素
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "ppt";
        
            // 将img元素添加到div元素中
            slide.appendChild(img);
        
            // 将div元素添加到容器中
            slideContainer.appendChild(slide);
            fetchImages(index + 1);
        } else {
            // 如果图片不存在，停止递归
            console.log(`No more images found after index ${index - 1}`);
            PPT_length = index;
        }
    } catch (error) {
        // 如果发生错误，停止递归
        console.error(`Error fetching image at index ${index}:`, error);
    }
}
 

function showSlide(index) { //在中间栏展示PPt 
    isShowPPT = true;
    currentSlideIndex = index; // 更新当前选中的图片索引
    var container = document.querySelector(".slide-content")
    container.innerHTML = `<img id="slideImage" src="/file/PPTJPG_${lesson_id}-${index + 1}.jpg" alt="ppt" style="width: 100%; height:100%">`
    //document.getElementById("slideImage").src = `/file/PPTJPG_${lesson_id}-${index + 1}.jpg`; // 显示图片
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
    } else {
        currentSlideIndex = PPT_length - 1; // 回到最后一张
    }
    showSlide(currentSlideIndex)
}

function nextSlide() {
    if (currentSlideIndex < PPT_length-1) {
        currentSlideIndex++;
    } else {
        currentSlideIndex = 0; // 回到第一张
    }
    showSlide(currentSlideIndex)
}

function showQuestion(id){  //在中间栏展示题目
    isShowPPT = false;
    currentQuestionIndex = id;
    var question = questions_list.find((item) => item.questionId === id);
    if(question){
        var container = document.querySelector(".slide-content")
        container.innerHTML = ``
        const questionDiv = document.createElement("div");
        questionDiv.className = "profile-slide";    
        const questionSpan = document.createElement("span");
        questionSpan.textContent = `${question.title}`;
        questionDiv.appendChild(questionSpan);
    
        question.options.Options.forEach((option,index) => {
            const optionSpan = document.createElement("span");
            optionSpan.textContent = `${alphabet[index]}. ${option.text}`;
            questionDiv.appendChild(optionSpan);
        });

        const answerSpan = document.createElement("span");
        answerSpan.textContent = `答案：${question.answer}`;
        questionDiv.appendChild(answerSpan);

        container.appendChild(questionDiv);
    }
}

function showToStudent(){  //发布给学生
    var data = {};
    if(isShowPPT){
        data = {
            show_ppt: {
                isRequest:true,
            show_id: currentSlideIndex  //当前展示的PPT的index，从0开始
            }
        };

        var jsonString = JSON.stringify(data);
        console.log("show_ppt:",jsonString)
        socket.send(jsonString);
    }
    else{
        document.getElementById("myDialog3").style.display = "block";
    }
}

function postQuestion() {   //发布题目  
    var minutes = document.getElementById('minutes').value;
    var seconds = document.getElementById('seconds').value;
    var time = parseInt(minutes) * 60 + parseInt(seconds);

    question_round[parseInt(currentQuestionIndex)]++;  //发布次数+1

    var data = {
        show_question: {
            isRequest:true,
            show_id: parseInt(currentQuestionIndex),
            round: question_round[parseInt(currentQuestionIndex)],
            time: time   //单位：秒
        }
    };
    console.log(data);
    var jsonString = JSON.stringify(data);
    console.log("show_question:",jsonString)
    socket.send(jsonString);
    closeDialog3();
    showResult(time);  //展示答题结果
}

function showResult(time){  //展示答题结果
    var question = questions_list.find((item) => item.questionId === currentQuestionIndex);
    currentQuestion = question;
    var container = document.querySelector(".slide-content")  //重新绘制中间栏
    container.innerHTML = `<div id="countdown">Loading...</div>
                            <span style="margin-bottom:15px">${question.title}</span>
                            <div id="chart-container"></div>`

    updateCountdown(time);
    totalResponses = 0;
    correctResponses = 0;
    optionResponses = question.options.Options.map(option => 0);
    generateChart();  //生成条形统计图
    generateDiscussion();  //生成讨论区
}

  // 更新倒计时
function updateCountdown(secondsRemaining) {
    const countdownElement = document.getElementById('countdown');
    // 如果倒计时结束，显示提示信息
    if (secondsRemaining <= 0) {
        countdownElement.textContent = '00:00';
        countdownElement.style.color = 'red';
        return;
    }

    // 计算剩余的分钟和秒数
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    // 格式化分钟和秒数，确保它们始终是两位数
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // 更新页面上的倒计时显示
    countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

    // 每秒更新一次倒计时
    setTimeout(() => updateCountdown(secondsRemaining - 1), 1000);
}

function generateChart(){
    var question = currentQuestion;
    // 初始化答题记录

    document.getElementById("chart-container").innerHTML = '';  //清空
    // 生成初始统计图
    const svgWidth = 500;
    const svgHeight = 200;
    const barHeight = 20;
    const barMargin = 5;

    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const data = optionResponses.map((count, index) => ({
        option: `${alphabet[index]}. ${question.options.Options[index].text}`,
        count,
        percentage: (count / totalResponses) * 100 || 0
    }));

    const correctPercentage = (correctResponses / totalResponses) * 100 || 0;
    data.push({
        option: '正确率',
        count: correctResponses,
        percentage: correctPercentage
    });

    svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * (barHeight + barMargin))
        .attr('width', d => d.percentage * 5)
        .attr('height', barHeight)
        .attr('fill', d => d.option === '正确率' ? '#2196F3' : '#4CAF50');

    svg.selectAll('text')
        .data(data)
        .join('text')
        .attr('x', d => {
            const barWidth = d.percentage * 5;
            return barWidth < 50 ? barWidth + 5 : 5; // 如果条形图宽度小于50，标签放在右侧，否则放在左侧
        })
        .attr('y', (d, i) => i * (barHeight + barMargin) + (barHeight / 2))
        .attr('dy', '0.35em')
        .attr('text-anchor', d => {
            const barWidth = d.percentage * 5;
            return barWidth < 50 ? 'start' : 'start'; // 如果条形图宽度小于50，标签左对齐，否则左对齐
        })
        .text(d => `${d.option}: ${d.percentage.toFixed(2)}%`);
}

// 更新统计图
function updateChart(data) {
    totalResponses += 1;
    correctResponses = data.question_response.correct_num;
    optionResponses = data.question_response.question_res.option_num;
    generateChart();
}

function ws_insert_question(){
    var data = {
        insert_question:{       
            isRequest: true,
            title: "",
            options: {Options:[]},
            subject: "",
            section:"",
            course:"",
            is_public:true
        }
    };

    data.insert_question.title = document.getElementById('title').textContent;
    console.log(flag)
    if(flag){
        const len = option_list.length;
        for (var i = 0; i < len; i++) {
            data.insert_question.options.Options.push({
                text: option_list[i].children[0].textContent,
                IsCorrect: window.getComputedStyle(option_list[i].children[3]).display === "block"
            });
        }
    }
    else{
        for (var i = 0; i < 2; i++) {
            data.insert_question.options.push({
                text: pd[i].children[0].textContent,
                IsCorrect: window.getComputedStyle(pd[i].children[1]).display === "block"
            });
        }
    }
    var obj = document.getElementById('dropdown1')
    var index = obj.selectedIndex; // 选中索引
    data.insert_question.subject = obj.options[index].text; // 选中文本

    obj = document.getElementById('dropdown3');
    index = obj.selectedIndex; // 选中索引
    data.insert_question.section = obj.options[index].text;

    obj = document.getElementById('dropdown2');
    index = obj.selectedIndex; // 选中索引
    data.insert_question.course = obj.options[index].text;

    console.log("isRepublic",document.getElementById('dropdown4').value)
    if(document.getElementById('dropdown4').value === 'true')
    {
        data.insert_question.is_public = true;
    }
    else
    {
        data.insert_question.is_public = false;
    }

    if(dropdown1.value === "")
    {
        error_message.textContent = "请选择科目";
    }
    else if(dropdown2.value === "")
    {
        error_message.textContent = "请选择课程";
    }
    else if(dropdown3.value === "")
    {
        error_message.textContent = "请选择章节";
    }else{
        error_message.textContent = "";
        console.log("insert_question:",data);

        new_insert_question = data.insert_question;

        const jsonString = JSON.stringify(data);
        socket.send(jsonString);

        hidePopup();
        closeDialog4();
    }
}

function endLesson(){
    var data = {
        over_lesson:{
            isRequest:true
        }
    }
    console.log("over_lesson:",JSON.stringify(data))
    socket.send(JSON.stringify(data))
    window.location.href = "/after_lesson";
}

let subject_list = {
    "subjects": [
        {
            "name": "软件工程",
            "courses": [
                {
                    "name": "软件工程基础",
                    "sections": ["软件生命周期", "需求分析", "软件设计", "软件测试", "软件维护"]
                },
                {
                    "name": "软件开发方法",
                    "sections": ["敏捷开发", "瀑布模型", "迭代开发", "螺旋模型", "极限编程", "Scrum"]
                },
                {
                    "name": "软件质量保证",
                    "sections": ["代码审查", "单元测试", "集成测试", "系统测试", "验收测试", "持续集成"]
                },
                {
                    "name": "软件项目管理",
                    "sections": ["项目计划", "风险管理", "进度管理", "成本管理", "质量管理"]
                },
                {
                    "name": "软件架构设计",
                    "sections": ["分层架构", "微服务架构", "事件驱动架构", "面向服务架构", "领域驱动设计"]
                }
            ]
        },
        {
            "name": "计算机网络",
            "courses": [
                {
                    "name": "网络基础",
                    "sections": ["网络拓扑", "OSI模型", "TCP/IP协议", "网络设备", "网络地址转换", "子网划分"]
                },
                {
                    "name": "网络协议",
                    "sections": ["HTTP协议", "FTP协议", "SMTP协议", "DNS协议", "DHCP协议", "SNMP协议"]
                },
                {
                    "name": "网络安全",
                    "sections": ["加密技术", "防火墙", "入侵检测", "VPN", "SSL/TLS", "网络安全协议"]
                },
                {
                    "name": "网络应用",
                    "sections": ["Web应用", "电子邮件", "文件传输", "远程访问", "云计算", "物联网"]
                },
                {
                    "name": "网络管理",
                    "sections": ["网络监控", "故障排除", "性能优化", "配置管理", "安全策略"]
                }
            ]
        },
        {
            "name": "数据结构",
            "courses": [
                {
                    "name": "基本数据结构",
                    "sections": ["数组", "链表", "栈", "队列", "哈希表", "集合"]
                },
                {
                    "name": "树与图",
                    "sections": ["二叉树", "堆", "图", "图的遍历", "最小生成树", "最短路径"]
                },
                {
                    "name": "算法",
                    "sections": ["排序算法", "查找算法", "动态规划", "贪心算法", "分治法", "回溯法"]
                },
                {
                    "name": "高级数据结构",
                    "sections": ["红黑树", "B树", "AVL树", "Trie树", "并查集", "线段树"]
                },
                {
                    "name": "算法设计与分析",
                    "sections": ["时间复杂度", "空间复杂度", "算法优化", "NP完全问题", "近似算法"]
                }
            ]
        },
        {
            "name": "计算机组成原理",
            "courses": [
                {
                    "name": "计算机系统结构",
                    "sections": ["冯·诺依曼结构", "指令系统", "存储系统", "输入输出系统", "总线系统", "中断系统"]
                },
                {
                    "name": "处理器",
                    "sections": ["CPU结构", "指令流水线", "多核处理器", "超标量处理器", "乱序执行", "分支预测"]
                },
                {
                    "name": "存储器",
                    "sections": ["主存储器", "高速缓存", "虚拟存储器", "存储器层次结构", "闪存", "磁盘存储"]
                },
                {
                    "name": "输入输出系统",
                    "sections": ["I/O接口", "DMA", "中断处理", "设备驱动", "总线协议"]
                },
                {
                    "name": "计算机体系结构",
                    "sections": ["RISC与CISC", "并行计算", "多处理器系统", "集群系统", "分布式系统"]
                }
            ]
        }
    ]
}