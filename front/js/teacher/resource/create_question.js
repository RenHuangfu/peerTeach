const dropdown1 = document.getElementById('dropdown1');
const dropdown2 = document.getElementById('dropdown2');
const dropdown3 = document.getElementById('dropdown3');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const input3 = document.getElementById('input3');
const addButton2 = document.getElementById('addButton2');
const addButton3 = document.getElementById('addButton3');
const error_message = document.getElementById('error_message');
const option_list = new Array();
const pd = new Array();
var haveGotSubjects = false;
var tem_create_subject = document.getElementById('tem_create_subject');
var tem_create_course = document.getElementById('tem_create_course');
var tem_create_section = document.getElementById('tem_create_section');
var lastDrop1 = "-3", lastDrop2 = "-3", flag = true;

var subject_list = new Array();

function newOption() {
    const ele = document.createElement("span");
    const textElement = document.createElement("span");
    textElement.textContent = "在此编辑选项";
    textElement.contentEditable = true;

    const imgButton1 = document.createElement("img");
    imgButton1.src = "../../../images/teacher/resource/delete.png";
    imgButton1.style = "width: 24px; height: 24px;"
    imgButton1.alt = "删除";
    imgButton1.style.cursor = "pointer";
    imgButton1.style.float = "right";
    imgButton1.style.marginRight = "30px";
    imgButton1.onclick = function () {
        var i = imgButton1.parentElement.parentElement.firstChild.textContent[0].charCodeAt(0) - 65;
        option_list.splice(i, 1);
        repaint();
    };
    imgButton1.onmouseover = function () {
        layer.tips('删除', this, {
            tips: 1
          })
    }
    imgButton1.onmouseleave = function () {
        layer.closeAll('tips');
    }

    const imgButton2 = document.createElement("img");
    imgButton2.src = "../../../images/teacher/resource/insert.png";
    imgButton2.style = "width: 24px; height: 24px;"    
    imgButton2.alt = "插入";
    imgButton2.style.cursor = "pointer";
    imgButton2.style.float = "right";
    imgButton2.style.marginRight = "15px";
    imgButton2.onclick = function () {
        var i = imgButton2.parentElement.parentElement.firstChild.textContent[0].charCodeAt(0) - 65;
        option_list.splice(i, 0, newOption());
        repaint();
    };
    imgButton2.onmouseover = function () {
        layer.tips('插入', this, {
            tips: 1
          })
    }
    imgButton2.onmouseleave = function () {
        layer.closeAll('tips');
    }

    const imgButton3 = document.createElement("img");
    imgButton3.src = "../../../images/teacher/resource/correct.png";
    imgButton3.style = "width: 24px; height: 24px;"
    imgButton3.alt = "正确";
    imgButton3.style.cursor = "pointer";
    imgButton3.style.float = "right";
    imgButton3.style.display = "none";
    imgButton3.style.marginRight = "15px";
    imgButton3.onclick = function () {
        imgButton3.parentElement.children[3].style.display = "none";
        imgButton3.parentElement.children[4].style.display = "block";
    };
    imgButton3.onmouseover = function () {
        layer.tips('该选项为正确选项', this, {
            tips: 1
          })
    }
    imgButton3.onmouseleave = function () {
        layer.closeAll('tips');
    }

    const imgButton4 = document.createElement("img");
    imgButton4.src = "../../../images/teacher/resource/inCorrect.png";
    imgButton4.style = "width: 24px; height: 24px;"
    imgButton4.alt = "错误";
    imgButton4.style.cursor = "pointer";
    imgButton4.style.float = "right";
    imgButton4.style.marginRight = "15px";
    imgButton4.onclick = function () {
        imgButton3.parentElement.children[3].style.display = "block";
        imgButton3.parentElement.children[4].style.display = "none";
    };
    imgButton4.onmouseover = function () {
        layer.tips('该选项为错误选项', this, {
            tips: 1
          })
    }
    imgButton4.onmouseleave = function () {
        layer.closeAll('tips');
    }

    ele.appendChild(textElement);
    ele.appendChild(imgButton1);
    ele.appendChild(imgButton2);
    ele.appendChild(imgButton3);
    ele.appendChild(imgButton4);
    return ele;
}
function repaint() {
    const content = document.getElementById('options');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    var len = option_list.length;
    for (var i = 0; i < len; i++) {
        var ele = document.createElement('div');
        var ele2 = document.createElement('span');
        ele2.textContent = String.fromCharCode(65 + i) + '、';
        ele2.style.marginLeft = "30px"
        ele2.appendChild(option_list[i]);
        ele.style.margin = "20px";
        ele.appendChild(ele2)
        content.appendChild(ele);
    }

    const imgButton2 = document.createElement("img");
    imgButton2.src = "../../../images/teacher/resource/insert.png";
    imgButton2.style = "width: 24px; height: 24px;"
    imgButton2.alt = "插入";
    imgButton2.style.cursor = "pointer";
    imgButton2.style.marginRight = "15px";
    imgButton2.style.marginLeft = "45px";
    imgButton2.onclick = function () {
        option_list.splice(option_list.length, 0, newOption());
        repaint();
    };
    content.appendChild(imgButton2);
    imgButton2.onmouseover = function () {
        layer.tips('插入', this, {
            tips: 1
        })
    }
    imgButton2.onmouseleave = function () {
        layer.closeAll('tips');
    }
}
function repaint2() {
    const content = document.getElementById('options');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    for (var i = 0; i < 2; i++) {
        var ele = document.createElement('div');
        var ele2 = document.createElement('span');
        ele2.textContent = String.fromCharCode(65 + i) + '、';
        ele2.style.marginLeft = "30px"
        ele2.appendChild(pd[i]);
        ele.style.margin = "20px";
        ele.appendChild(ele2)
        content.appendChild(ele);
    }
}

for (var i = 0; i < 4; i++) {
    var ele = newOption();
    option_list.push(ele);
}
repaint();

for (var i = 0; i < 2; i++) {
    const ele = document.createElement("span");
    const textElement = document.createElement("span");
    if (i) textElement.textContent = "错";
    else textElement.textContent = "对";
    textElement.contentEditable = true;

    const imgButton3 = document.createElement("img");
    imgButton3.src = "path/to/your/image3.png";
    imgButton3.alt = "正确";
    imgButton3.style.cursor = "pointer";
    imgButton3.style.float = "right";
    imgButton3.style.display = "none";
    imgButton3.onclick = function () {
        imgButton3.parentElement.children[1].style.display = "none";
        imgButton3.parentElement.children[2].style.display = "block";
    };

    const imgButton4 = document.createElement("img");
    imgButton4.src = "path/to/your/image3.png";
    imgButton4.alt = "错误";
    imgButton4.style.cursor = "pointer";
    imgButton4.style.float = "right";
    imgButton4.onclick = function () {
        imgButton3.parentElement.children[1].style.display = "block";
        imgButton3.parentElement.children[2].style.display = "none";
    };

    ele.appendChild(textElement);
    ele.appendChild(imgButton3);
    ele.appendChild(imgButton4);

    pd.push(ele);
}

document.getElementById('option1').onclick = function () {
    repaint();
    flag = true;
};
document.getElementById('option2').onclick = function () {
    repaint2();
    flag = false;
};

function create_question() {
    const data = {
        create_question:{       
            isRequest: true,
            title: "",
            options: [],
            subject: "",
            section:"",
            course:"",
            IsPublic:true
        }
    };
        
    data.create_question.title = document.getElementById('title').textContent;
    console.log(flag)
    if(flag){
        const len = option_list.length;
        for (var i = 0; i < len; i++) {
            data.create_question.options.push({
                text: option_list[i].children[0].textContent,
                isCorrect: window.getComputedStyle(option_list[i].children[3]).display === "block"
            });
        }
    }
    else{
        for (var i = 0; i < 2; i++) {
            data.create_question.options.push({
                text: pd[i].children[0].textContent,
                isCorrect: window.getComputedStyle(pd[i].children[1]).display === "block"
            });
        }
    }
    var obj = document.getElementById('dropdown1')
    var index = obj.selectedIndex; // 选中索引
    data.create_question.subject = obj.options[index].text; // 选中文本

    obj = document.getElementById('dropdown3');
    index = obj.selectedIndex; // 选中索引
    data.create_question.section = obj.options[index].text;

    obj = document.getElementById('dropdown2');
    index = obj.selectedIndex; // 选中索引
    data.create_question.course = obj.options[index].text;

    data.create_question.IsPublic = document.getElementById('dropdown4').value;
    if(dropdown1.value == "")
    {
        error_message.textContent = "请选择科目";
    }
    else if(dropdown2.value == "")
    {
        error_message.textContent = "请选择课程";
    }
    else if(dropdown3.value == "")
    {
        error_message.textContent = "请选择章节";
    }else{
        error_message.textContent = "";
        console.log(data);
        post(data)
        //     window.location.href = 'myResource.html';
        // else
        //     error_message.textContent = "上传失败";
    }
}

async function post(data) {
    
    try {
        const response = await fetch('/resourceDetail', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)  // 请求体为 JSON 数据
        });

        if (!response.ok) {
            if (response.status === 200) {
                return response.json();
            }
            else if (response.status === 404) {
                throw new Error("Resource not found");
            }
            else
                throw new Errow("Request failed with status:" + response.status);
        }

        const responseData = await response.json();
        console.log(responseData);
        return true;
    } catch (error) {
        console.error('Error during fetch:', error);
        return false;
    }
}

function showPopup() {
    document.getElementById('popup').style.display = 'block';
    if (!haveGotSubjects) getSubjects();
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

function addItem1() {
    const newItem = input1.value.trim();
    if (newItem && newItem != '/') {
        var i = 2;
        while (dropdown1.children[i]) {
            if (dropdown1.children[i].textContent === newItem) {
                if (dropdown1.value != dropdown1.children[i].value)
                    getCourses(newItem);
                dropdown1.value = String(i - 2);
                tem_create_subject.style.display = "none";
                input1.value = '';
                return;
            }
            i++;
        }
        tem_create_subject.text = newItem;
        tem_create_subject.style.display = "block";
        dropdown1.value = "-1";
        dropdown2.value = "-2";
        dropdown3.value = "-2";
        addButton3.disabled = true;
        while (dropdown2.children[2]) dropdown2.children[2].remove();
        while (dropdown3.children[2]) dropdown3.children[2].remove();
        tem_create_course.style.display = "none";
        tem_create_section.style.display = "none";
        input1.value = '';
    }
    else {
        alert('非法名称');
    }
}

function addItem2() {
    const newItem = input2.value.trim();
    if (newItem && newItem != '/') {
        var i = 2;
        while (dropdown2.children[i]) {
            if (dropdown2.children[i].textContent === newItem) {
                if (dropdown2.value != dropdown2.children[i].value)
                    getSections(newItem);
                dropdown2.value = String(i - 2);
                tem_create_course.style.display = "none";
                return;
            }
            i++;
        }
        tem_create_course.text = newItem;
        tem_create_course.style.display = "block";
        dropdown2.value = "-1";
        dropdown3.value = "-2";
        while (dropdown3.children[2]) dropdown3.children[2].remove();
        tem_create_section.style.display = "none";
        input2.value = '';
    }
    else {
        alert('非法名称');
    }
}

function addItem3() {
    const newItem = input3.value.trim();
    if (newItem && newItem != '/') {
        var i = 2;
        while (dropdown3.children[i]) {
            if (dropdown3.children[i].textContent === newItem) {
                dropdown3.value = String(i - 2);
                tem_create_section.style.display = "none";
                return;
            }
            i++;
        }
        tem_create_section.text = newItem;
        tem_create_section.style.display = "block";
        dropdown3.value = "-1";
        input3.value = '';
    }
    else {
        alert('非法名称');
    }
}

function getSubjects() {
            if (subject_list.subjects[0]) haveGotSubjects = true;
            const row = document.getElementById('dropdown1');
            var i = 0;
            while (subject_list.subjects[i]) {
                const row2 = document.createElement('option');
                row2.textContent = subject_list.subjects[i].name;
                row2.value = subject_list.subjects[i].name;
                row.appendChild(row2);
                i++;
            }
}

function getCourses(subject) {
            var i = 0;
            console.log(subject);
            while (subject.courses[i]) {
                const row2 = document.createElement('option');
                row2.textContent = subject.courses[i].name;
                row2.value = subject.courses[i].name;
                dropdown2.appendChild(row2);
                i++;
            }
}

function getSections(course) {
            var i = 0;
            while (course.sections[i]) {
                const row2 = document.createElement('option');
                row2.textContent = course.sections[i];
                row2.value = course.sections[i];
                dropdown3.appendChild(row2);
                i++;
            }
}

function getClassification() {
    $(document).ready(function() {
        // 使用 $.getJSON 方法加载本地 JSON 文件
        $.getJSON('data.json', function(data) {
            // 成功加载 JSON 文件后的处理
            subject_list = data;
            console.log(subject_list);
            getSubjects();
        }).fail(function(xhr, status, error) {
            // 处理错误
            console.error('Error loading JSON file:', error);
        });
    });
}

dropdown1.addEventListener('change', function() {
    const selectedSubject = dropdown1.value;
    const subject = subject_list.subjects.find(sub => sub.name === selectedSubject);

    if (subject) {
        dropdown2.innerHTML = '<option value="">/</option>';
        dropdown3.innerHTML = '<option value="">/</option>';
        getCourses(subject); // 调用 getCourses 函数并传入课程列表
        dropdown2.disabled = false;
    }
    else{
        dropdown2.innerHTML = '<option value="">请选择学科</option>';
        dropdown3.innerHTML = '<option value="">请选择学科</option>';
        dropdown2.disabled = true;
        dropdown3.disabled = true;
    }
});

dropdown2.addEventListener('change', function() {
    const selectedSubject = dropdown1.value;
    const selectedCourse = dropdown2.value;
    const subject = subject_list.subjects.find(sub => sub.name === selectedSubject);
    const course = subject.courses.find(c => c.name === selectedCourse);

    if (course) {
        dropdown3.innerHTML = '<option value="">/</option>';
        getSections(course); // 调用 getSections 函数并传入课程列表
        dropdown3.disabled = false;
    }
    else{
        dropdown3.innerHTML = '<option value="">请选择课程</option>';
        dropdown3.disabled = true;
    }
});


getClassification();