const toggleButton1 = document.getElementById('toggleButton1');
const toggleButton2 = document.getElementById('toggleButton2');
const toggleButton3 = document.getElementById('toggleButton3');
const createPaper = document.getElementById('createPaper');
const createQuestion = document.getElementById('createQuestion');
const cancelCreateQuestion =  document.getElementById('cancelCreateQuestion');
const pageNumber = document.getElementById('pageNumber');
const pageNumber2 = document.getElementById('pageNumber2');
const pageNumber3 = document.getElementById('pageNumber3');
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu2 = document.getElementById("dropdownMenu2");
const dropdownButton2 = document.getElementById('dropdownButton2');
const custom_select1 = document.getElementById('custom-select1');
const custom_select2 = document.getElementById('custom-select2');
const custom_select3 = document.getElementById('custom-select3');
const custom_select4 = document.getElementById('custom-select4');
const custom_select5 = document.getElementById('custom-select5');
const custom_select6 = document.getElementById('custom-select6');
const container1 = document.getElementById('customSelectContainer1');
const container2 = document.getElementById('customSelectContainer2');
const container3 = document.getElementById('customSelectContainer3');
const container4 = document.getElementById('customSelectContainer4');
const container5 = document.getElementById('customSelectContainer5');
const container6 = document.getElementById('customSelectContainer6');
const options1 = document.getElementById('customSelectOptions1');
const options2 = document.getElementById('customSelectOptions2');
const options3 = document.getElementById('customSelectOptions3');
const options4 = document.getElementById('customSelectOptions4');
const options5 = document.getElementById('customSelectOptions5');
const options6 = document.getElementById('customSelectOptions6');
const cancelSavePaper = document.getElementById('cancelSavePaper');
const createPaperModal = document.getElementById("createPaperModal")
var data, data2, data3, haveGotSubjects = false, lastGotQ = new Array(3), nowGotQ = new Array('/', '/', '/'), lastGotQ2 = new Array(3), nowGotQ2 = new Array('/', '/', '/');
var subject_list = {};
var isCreatePaper = 0;  //指示当前是否为创建试卷动作
var deleteId = 0;
var isDeletePaper = true;

const maxRows = 10;
toggleButton1.disabled = true;
toggleButton1.onclick = function () {
    toggleButton1.disabled = true;
    toggleButton2.disabled = false;
    toggleButton3.disabled = false;
    content1.style.display = 'block';
    content2.style.display = 'none';
    content3.style.display = 'none';
    if (!data) getdata();
};
toggleButton2.onclick = function () {
    toggleButton1.disabled = false;
    toggleButton2.disabled = true;
    toggleButton3.disabled = false;
    content1.style.display = 'none';
    content2.style.display = 'block';
    content3.style.display = 'none';
    if (!data2) getdata2();
};
toggleButton3.onclick = function () {
    toggleButton1.disabled = false;
    toggleButton2.disabled = false;
    toggleButton3.disabled = true;
    content1.style.display = 'none';
    content2.style.display = 'none';
    content3.style.display = 'block';
    if (!data3) getdata3();
};

createPaper.onclick = function () {
    createPaperModal.style.display="block";
}

cancelSavePaper.onclick = function () {
    createPaperModal.style.display="none";
}

createQuestion.onclick = function () {
    openCreateQuestionModal(0);  //不是创建试卷页面
}

function openCreateQuestionModal(flag){
    document.getElementById('question-container').style.display = "block";
    isCreatePaper = flag;
}

cancelCreateQuestion.onclick = function () {
    closeCreateQuestionModal()
}

function closeCreateQuestionModal(){
    document.getElementById('question-container').style.display = "none";
}

document.getElementById('toggleButton4').onclick = function () {
    const currentPage = Number(pageNumber.value);
    const minPage = Number(pageNumber.min);
    const maxPage = Number(pageNumber.max);

    if (currentPage > maxPage) pageNumber.value = maxPage;
    else if (currentPage > minPage) pageNumber.value = currentPage - 1;
    else pageNumber.value = minPage;

    fillTable(data);
};

document.getElementById('toggleButton5').onclick = function () {
    const currentPage = Number(pageNumber.value);
    const minPage = Number(pageNumber.min);
    const maxPage = Number(pageNumber.max);

    if (currentPage < minPage) pageNumber.value = minPage;
    else if (currentPage > maxPage) pageNumber.value = maxPage;

    fillTable(data);
};

document.getElementById('toggleButton6').onclick = function () {
    const currentPage = Number(pageNumber.value);
    const minPage = Number(pageNumber.min);
    const maxPage = Number(pageNumber.max);

    if (currentPage < minPage) pageNumber.value = minPage;
    else if (currentPage < maxPage) pageNumber.value = currentPage + 1;
    else pageNumber.value = maxPage;
    fillTable(data);
};
document.getElementById('toggleButton7').onclick = function () {
    const currentPage = Number(pageNumber2.value);
    const minPage = Number(pageNumber2.min);
    const maxPage = Number(pageNumber2.max);

    if (currentPage > maxPage) pageNumber2.value = maxPage;
    else if (currentPage > minPage) pageNumber2.value = currentPage - 1;
    else pageNumber2.value = minPage;

    fillTable2(data2);
};

document.getElementById('toggleButton8').onclick = function () {
    const currentPage = Number(pageNumber2.value);
    const minPage = Number(pageNumber2.min);
    const maxPage = Number(pageNumber2.max);

    if (currentPage < minPage) pageNumber2.value = minPage;
    else if (currentPage > maxPage) pageNumber2.value = maxPage;

    fillTable2(data2);
};

document.getElementById('toggleButton9').onclick = function () {
    const currentPage = Number(pageNumber2.value);
    const minPage = Number(pageNumber2.min);
    const maxPage = Number(pageNumber2.max);

    if (currentPage < minPage) pageNumber2.value = minPage;
    else if (currentPage < maxPage) pageNumber2.value = currentPage + 1;
    else pageNumber2.value = maxPage;

    fillTable2(data2);
};
document.getElementById('toggleButton10').onclick = function () {
    const currentPage = Number(pageNumber3.value);
    const minPage = Number(pageNumber3.min);
    const maxPage = Number(pageNumber3.max);

    if (currentPage > maxPage) pageNumber3.value = maxPage;
    else if (currentPage > minPage) pageNumber3.value = currentPage - 1;
    else pageNumber3.value = minPage;

    fillTable3(data3);
};

document.getElementById('toggleButton11').onclick = function () {
    const currentPage = Number(pageNumber3.value);
    const minPage = Number(pageNumber3.min);
    const maxPage = Number(pageNumber3.max);

    if (currentPage < minPage) pageNumber3.value = minPage;
    else if (currentPage > maxPage) pageNumber3.value = maxPage;

    fillTable3(data3);
};

document.getElementById('toggleButton12').onclick = function () {
    const currentPage = Number(pageNumber3.value);
    const minPage = Number(pageNumber3.min);
    const maxPage = Number(pageNumber3.max);

    if (currentPage < minPage) pageNumber3.value = minPage;
    else if (currentPage < maxPage) pageNumber3.value = currentPage + 1;
    else pageNumber3.value = maxPage;

    fillTable3(data3);
};

document.addEventListener('click', function (event) {
    const clickedElement = event.target;
    switch (clickedElement.id) {
        case 'dropdownButton':
            if (dropdownMenu.style.display === "block") {
                dropdownMenu.style.display = "none";
                container1.classList.remove('open');
                container2.classList.remove('open');
                container3.classList.remove('open');
                if (lastGotQ[0] != nowGotQ[0] || lastGotQ[1] != nowGotQ[1] || lastGotQ[2] != nowGotQ[2])
                    getdata2();
            }
            else dropdownMenu.style.display = "block";
            if (!haveGotSubjects) {
                getSubjects()
            }
            break;
        case 'dropdownButton2':
            if (dropdownMenu2.style.display === "block") {
                dropdownMenu2.style.display = "none";
                container4.classList.remove('open');
                container5.classList.remove('open');
                container6.classList.remove('open');
                if (lastGotQ2[0] != nowGotQ2[0] || lastGotQ2[1] != nowGotQ2[1] || lastGotQ2[2] != nowGotQ2[2])
                    getdata3();
            }
            else dropdownMenu2.style.display = "block";
            if (!haveGotSubjects) getSubjects();
            break;
        case 'custom-select1':
            container1.classList.toggle('open');
            container2.classList.remove('open');
            container3.classList.remove('open');
            break;
        case 'custom-select2':
            container2.classList.toggle('open');
            container1.classList.remove('open');
            container3.classList.remove('open');
            break;
        case 'custom-select3':
            container3.classList.toggle('open');
            container1.classList.remove('open');
            container2.classList.remove('open');
            break;
        case 'custom-select4':
            container4.classList.toggle('open');
            container5.classList.remove('open');
            container6.classList.remove('open');
            break;
        case 'custom-select5':
            container5.classList.toggle('open');
            container4.classList.remove('open');
            container6.classList.remove('open');
            break;
        case 'custom-select6':
            container6.classList.toggle('open');
            container4.classList.remove('open');
            container5.classList.remove('open');
            break;
        default:
            switch (clickedElement.parentElement.id) {
                case 'customSelectOptions1':
                    if (custom_select1.textContent != "学科：" + clickedElement.textContent) {
                        custom_select1.textContent = "学科：" + clickedElement.textContent;
                        nowGotQ[0] = clickedElement.textContent;
                        nowGotQ[1] = '/';
                        nowGotQ[2] = '/';
                        while (options2.children[1]) options2.children[1].remove();
                        while (options3.children[1]) options3.children[1].remove();
                        custom_select2.textContent = "课程：/"
                        custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            
                                const _data = getCourses(custom_select1.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data[i].name;
                                        options2.appendChild(row);
                                        i++;
                                    }
                                }
                        }
                    }
                    container1.classList.remove('open');
                    break;
                case 'customSelectOptions2':
                    if (custom_select2.textContent != "课程：" + clickedElement.textContent) {
                        custom_select2.textContent = "课程：" + clickedElement.textContent;
                        nowGotQ[1] = clickedElement.textContent;
                        nowGotQ[2] = '/';
                        while (options3.children[1]) options3.children[1].remove();
                        custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                                const _data = getSections(custom_select1.textContent.slice(3),custom_select2.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data[i];
                                        options3.appendChild(row);
                                        i++;
                                    }
                                }
                        }
                    }
                    container2.classList.remove('open');
                    break;
                case 'customSelectOptions3':
                    pageNumber2.value = "1";
                    if (custom_select3.textContent != "章节：" + clickedElement.textContent) {
                        custom_select3.textContent = "章节：" + clickedElement.textContent;
                        nowGotQ[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            getdata2();
                            dropdownMenu.style.display = "none"
                        }
                    }
                    container3.classList.remove('open');
                    break;
                case 'customSelectOptions4':
                    if (custom_select4.textContent != "学科：" + clickedElement.textContent) {
                        custom_select4.textContent = "学科：" + clickedElement.textContent;
                        nowGotQ2[0] = clickedElement.textContent;
                        nowGotQ2[1] = '/';
                        nowGotQ2[2] = '/';
                        while (options5.children[1]) options5.children[1].remove();
                        while (options6.children[1]) options6.children[1].remove();
                        custom_select5.textContent = "课程：/"
                        custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                                const _data = getCourses(custom_select4.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data[i].name;
                                        options5.appendChild(row);
                                        i++;
                                    }
                                }
                        }
                    }
                    container4.classList.remove('open');
                    break;
                case 'customSelectOptions5':
                    if (custom_select5.textContent != "课程：" + clickedElement.textContent) {
                        custom_select5.textContent = "课程：" + clickedElement.textContent;
                        nowGotQ2[1] = clickedElement.textContent;
                        nowGotQ2[2] = '/';
                        while (options6.children[1]) options6.children[1].remove();
                        custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/'){
                            const _data = getSections(custom_select4.textContent.slice(3),custom_select5.textContent.slice(3));
                            if (_data != null) {
                                var i = 0;
                                while (_data[i]) {
                                    const row = document.createElement('a');
                                    row.textContent = _data[i];
                                    options6.appendChild(row);
                                    i++;
                                }
                            }
                        }
                    }
                    container5.classList.remove('open');
                    break;
                case 'customSelectOptions6':
                    pageNumber3.value = "1";
                    if (custom_select6.textContent != "章节：" + clickedElement.textContent) {
                        custom_select6.textContent = "章节：" + clickedElement.textContent;
                        nowGotQ2[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            getdata3();
                            dropdownMenu2.style.display = "none"
                        }
                    }
                    container6.classList.remove('open');
                    break;
                default:
                    dropdownMenu.style.display = "none"
                    dropdownMenu2.style.display = "none"
                    container1.classList.remove('open');
                    container2.classList.remove('open');
                    container3.classList.remove('open');
                    container4.classList.remove('open');
                    container5.classList.remove('open');
                    container6.classList.remove('open');
            }
    }
});

function turnPaperDetail(paperId){
    localStorage["paperId"] = paperId;
    window.location.href = "/paperDetail"
}

function fillTable(data) {
    const tbody = document.getElementById('myTable1').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (pageNumber.value - 1) * maxRows; i < pageNumber.value * maxRows; i++) {
        const row = document.createElement('tr');

        if (data[i]) {
            row.innerHTML = `
                                        <td>${i + 1}</td>
                                        <td>
                                            <a class="custom-link" onclick="turnPaperDetail(${data[i].paperId})">${data[i].title}</a>
                                        </td>
                                        <td>${formatDate(data[i].LastChangeTime)}</td>
                                        <td>
                                            <button class="btn-img" onclick="editRow()">
                                                <img src="/images/resource/edit.png" alt="编辑">
                                            </button>
                                            <button class="btn-img" onclick="deletePaper(${data[i].paperId})">
                                                <img src="/images/resource/delete.png" alt="删除">
                                            </button>
                                        </td>
                    `                   ;
        } else {
            row.innerHTML = `
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                    `               ;
        }

        tbody.appendChild(row);
    }
}

function fillTable2(data) {
    console.log("filltabel2",data)
    const tbody = document.getElementById('myTable2').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (pageNumber2.value - 1) * maxRows; i < pageNumber2.value * maxRows; i++) {
        const row2 = document.createElement('tr');
        if (data[i]) {
            row2.innerHTML = `
                                        <td>${i + 1}</td>
                                        <td>
                                            <a class="custom-link" onclick="openQuestionDetail(${data[i].questionId})">${data[i].title}</a>
                                        </td>
                                        <td>${formatDate(data[i].LastChangeTime)}</td>
                                        <td>
                                            <button class="btn-img" onclick="deleteQuestion(${data[i].questionId})">
                                                <img src="/images/resource/delete.png" alt="删除">
                                            </button>
                                        </td>
`                   ;
        } else {
            row2.innerHTML = `
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
`               ;
        }

        tbody.appendChild(row2);
    }
}

function fillTable3(data) {
    const tbody = document.getElementById('myTable3').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (pageNumber3.value - 1) * maxRows; i < pageNumber3.value * maxRows; i++) {
        const row3 = document.createElement('tr');
        const tbody = document.getElementById('myTable3').querySelector('tbody');
        // 如果有数据，填充数据，否则填充空单元格
        if (data[i]) {
            row3.innerHTML = `
                                <td>${i + 1}</td>
                                <td>
                                    <a class="custom-link" onclick="openQuestionDetail(${data[i].questionId})">${data[i].title}</a>
                                </td>
                                <td>${formatDate(data[i].LastChangeTime)}</td>
                                <td>
                                    <button class="btn-img" onclick="deleteQuestion(${data[i].questionId})">
                                        <img src="/images/resource/delete.png" alt="删除">
                                    </button>
                                </td>
                            `;
        } else {
            row3.innerHTML = `
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            `;
        }

        tbody.appendChild(row3);
    }
}



function getdata() {
    var data = {
        get_paper:{isRequest: true}
    };

    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("get_paper",_data.data)
            data = _data.data.papers;

            pageNumber.max = Math.floor(data.length / 10) + 1;
            if (pageNumber.max === 0) pageNumber.max = 1;
            fillTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getdata2() {
    console.log("nowGotQ",nowGotQ)
    var data = {
        get_question:{
            isRequest: true,
            subject:"",
            section:"",
            course:""
        }
    };
    if(nowGotQ[0]!=='/')
        data.get_question.subject = nowGotQ[0];
    if(nowGotQ[1]!=='/')
        data.get_question.course = nowGotQ[1];
    if(nowGotQ[2]!=='/')
        data.get_question.section = nowGotQ[2];

    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            data2 = _data.data.question;
            lastGotQ = nowGotQ.slice();
            pageNumber2.max = Math.floor(data2.length / 10) + 1;
            if (pageNumber2.max === 0) pageNumber2.max = 1;
            fillTable2(data2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getdata3() {
    console.log("nowGotQ2",nowGotQ2)
    var data = {
        get_global_question:{
            isRequest: true,
            subject:"",
            section:"",
            course:""
        }
    };
    if(nowGotQ2[0]!=='/')
        data.get_global_question.subject = nowGotQ2[0];
    if(nowGotQ2[1]!=='/')
        data.get_global_question.course = nowGotQ2[1];
    if(nowGotQ2[2]!=='/')
        data.get_global_question.section = nowGotQ2[2];

    console.log("getdata3",data)
    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            data3 = _data.data.question;
            lastGotQ2 = nowGotQ2.slice();
            pageNumber3.max = Math.floor(data3.length / 10) + 1;
            if (pageNumber3.max === 0) pageNumber3.max = 1;
            fillTable3(data3);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getSubjects() {
    if(!haveGotSubjects) {
        console.log("getSubjects:",subject_list);
        if (subject_list.subjects[0]) haveGotSubjects = true;
        var i = 0;
        while (subject_list.subjects[i]) {
            const row2 = document.createElement('a');
            row2.textContent = subject_list.subjects[i].name;
            row2.value = subject_list.subjects[i].name;
            const row3 = document.createElement('a');
            row3.textContent = subject_list.subjects[i].name;
            row3.value = subject_list.subjects[i].name;
            options1.appendChild(row2);
            options4.appendChild(row3);
            i++;
        }
    }
}

function getCourses(subject_name) {
    return subject_list.subjects.find(sub => sub.name === subject_name).courses;
}

function getSections(subject_name,course_name) {
    const subject = subject_list.subjects.find(sub => sub.name === subject_name);
    const course = subject.courses.find(c => c.name === course_name);
    return course.sections;
}

function getClassification() {
    console.log(subject_list);
}

function openQuestionDetail(id) {
    const modal = document.getElementById('questionDetailModal');
    modal.style.display = "block";
    QD_getData(id);
}

function closeQuestionDetail() {
    document.getElementById('questionDetailModal').style.display = "none";
}

function deletePaper(paperId){
    document.getElementById('confirmDeleteModal').style.display = "block";
    document.getElementById('deleteMessage').textContent = "是否删除试卷？"
    deleteId = paperId;
    isDeletePaper = true;
}

function deleteQuestion(questionId){
    document.getElementById('confirmDeleteModal').style.display = "block";
    document.getElementById('deleteMessage').textContent = "是否删除题目？"
    deleteId = questionId;
    isDeletePaper = false;
}

function confirmDelete(){
    if(isDeletePaper){
        var data = {
            delete_paper:{isRequest: true, paper_id: parseInt(deleteId)}
        };

        fetch('/resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(_data => {
                console.log("删除试卷成功")
                cancelDelete();
                getdata();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else{
        data = {
            delete_question:{isRequest: true, question_id: parseInt(deleteId)}
        };

        fetch('/resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(_data => {
                console.log("删除题目成功")
                cancelDelete();
                getdata2();
                getdata3();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function cancelDelete(){
    document.getElementById('confirmDeleteModal').style.display = "none";
}

subject_list = {
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

getClassification();
getdata();

