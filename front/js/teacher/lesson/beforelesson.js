let exam_list =[];
let questions_list =[];
let havePaperList = false;
let paperId = "";  //为""表示没有选择试卷
let course = [];
let attachment = {};   //保存附件

function openDialog1() {  //上传课件
  var myDialog1 = document.getElementById("myDialog1");
  myDialog1.style.display = "block";
}
function openDialog2() {  //上传题目
  var myDialog2 = document.getElementById("myDialog2");
  myDialog2.style.display = "block";
  if(!havePaperList){
    getPaperList();
  }
}

function openDialog4(){
    var dialog = document.getElementById("question-container");
    dialog.style.display = "block";
}

function closeDialog1() {  
  var dialog = document.getElementById("myDialog1");
  dialog.style.display = "none";
}
function closeDialog2() {
  var dialog = document.getElementById("myDialog2");
  dialog.style.display = "none";
  document.getElementById("paper-select-error").textContent = '';
}

function closeDialog3(){
    var dialog = document.getElementById("myDialog3");
    dialog.style.display = "none";
    document.getElementById("timer-error").textContent = '';
}

function closeDialog4(){
    var dialog = document.getElementById("question-container");
    dialog.style.display = "none";
    document.getElementById("timer-error").textContent = '';
}

function getPaperList(){  //获取试卷列表
    var data = {
        get_paper:{isRequest: true}
    };

    fetch('https://mock.apipost.net/mock/3610001ac4e5000/mock/3610001ac4e5000/?apipost_id=23834377b60061', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("get_paper",_data.data)
            exam_list = _data.data.papers;
            havePaperList = true;
            renderPaper();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderPaper(){  //渲染试卷列表
    // 获取要插入列表项的容器
  const examContainer = document.getElementById("papername");

  // 清空容器（如果有之前的内容）
  examContainer.innerHTML = "";

  // 遍历考试列表并创建列表项
  exam_list.forEach((exam) => {
    // 创建一个新的列表项
    const listItem = document.createElement("div");

    // 创建一个单选按钮（在这个例子中可能不需要，但为了展示如何创建）
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "exam-choice"; // 注意：这个name与表单中的radio按钮不同，所以它们不会互斥
    radioButton.value = exam.paperId;
    radioButton.setAttribute("title", exam.title);

    // 创建一个文本节点来显示考试名称
    const textNode = document.createElement("label");
    textNode.htmlFor = `exam-${exam.paperId}`;
    textNode.textContent = `${exam.title}`; // 直接设置文本内容

    // 将单选按钮和文本节点添加到列表项中
    listItem.appendChild(radioButton);
    listItem.appendChild(document.createTextNode(" ")); // 添加一些空格以分隔按钮和文本
    listItem.appendChild(textNode);

    // 将列表项添加到容器中
    examContainer.appendChild(listItem);
  });
}

function renderPaperDetail(){
    const container = document.getElementById("swiperproflie2");
    container.innerHTML = ""; // 清空容器内容
    
    var index = 1;
    questions_list.forEach((question) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "profile-slide";
      questionDiv.onclick = function(){
        showQuestion(question.questionId);
      }
  
      const questionSpan = document.createElement("span");
      questionSpan.textContent = `${index++}.${question.title}`;
      questionDiv.appendChild(questionSpan);
  
      var answer=""
      question.option.forEach((option,index) => {
        const optionSpan = document.createElement("span");
        optionSpan.textContent = `${alphabet[index]}. ${option.text}`;
        questionDiv.appendChild(optionSpan);
        if(option.isCorrect){
            answer+=`${alphabet[index]}`
        }
      });
      
      const answerSpan = document.createElement("span");
      answerSpan.textContent = `答案：${answer}`;
      questionDiv.appendChild(answerSpan);

      container.appendChild(questionDiv);
    //   container.appendChild(ButtonDiv);
      question.answer = answer;
    });
}

function selectPaper() {  //选择试卷
    const radioButtons = document.querySelectorAll('input[name="exam-choice"]');

      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          console.log("Selected Exam ID:", radioButtons[i].value);
          document.getElementById("paper-name").textContent = "选择试卷："+radioButtons[i].getAttribute("title");
          closeDialog2();
          paperId = radioButtons[i].value;
          getPaper(radioButtons[i].value);
          return;
        }
      }
      document.getElementById("paper-select-error").textContent = "请选择一个试卷";
      console.log("No exam selected.");
}

function getPaper(paperId) {  //获取试卷详情
    var data = {
        get_paper_detail:{isRequest: true, paper_id: parseInt(paperId)}
    };

    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3afe5fb9b56011', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // 将响应的 JSON 数据解析成对象
        })
        .then(_data => {
            questions_list = _data.question;
            console.log("questions_list",questions_list)
            renderPaperDetail();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function selectPPT() {  //选择课件
    attachment = document.getElementById('input-ppt').files[0];
    if (attachment) {
        document.getElementById("ppt-name").textContent = "选择课件："+attachment.name;
        closeDialog1();
    }
}

function getCourses() {
    // 构建带有查询参数的 URL
    var url = "https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=21010a90f59003";
    var postData = {
        get_course: {isRequest: true}
    };

    // 发送 POST 请求
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

            courses = data.data.courses;

            let courseSelect = document.getElementById('course');
            courses.forEach(course => {
            let option = document.createElement('option');
            option.value = course.course_id; // 设置 option 的 value 属性为课程 ID
            option.innerText = course.course_name;

            courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function updateClasses() {
    let courseSelect = document.getElementById('course');
    let classSelect = document.getElementById('class');
    let courseId = courseSelect.value;
    classSelect.innerHTML = '<option value="">请选择班级</option>';

    if (courseId) {
        let selectedCourse = courses.find(course => course.course_id == courseId);
        selectedCourse.classes.forEach(cls => {
            let option = document.createElement('option');
            option.value = cls.id; // 设置 option 的 value 属性为班级 ID
            option.innerText = cls.name;
            classSelect.appendChild(option);
        });
    }
}

// 初始化课程下拉菜单
getCourses();