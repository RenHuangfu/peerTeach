var insertSlot = 0;
var questionIds = new Array();
var unitList = new Array();
var data = [

];

const _main = document.getElementById('_main')
var row = document.createElement('p');
row.contentEditable = true;

row.textContent = "我的试卷一";
row.id = "paperTitle";

row.style.fontSize = "36px";
row.style.textAlign = "center"
_main.appendChild(row)

var insert_button = document.createElement('button');
var insert_img = document.createElement('img');
insert_img.src = "/images/resource/insert.png"
insert_img.alt = "插入";
insert_img.style = "width: 24px; height: 24px;"
insert_button.appendChild(insert_img);
insert_button.setAttribute("index","0")
insert_button.onclick = function () {
    document.getElementById('modal').style.display = 'block';
}
insert_button.style = "width: 100%; height: 48px;"
_main.appendChild(insert_button);


function buildUnit(data) {
    console.log(data)
    var unit = document.createElement('div');

    var row = document.createElement('span');
    row.textContent = data.title;
    row.style.fontSize = "24px";
    unit.appendChild(row);

    var row = document.createElement('table');
    row.innerHTML = `
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>选项</th>
                                                                    <th>正确答案</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            </tbody>
                                                        `
    var i = 0;
    while (data.options.Options[i]) {
        var row2 = document.createElement('tr');
        row2.innerHTML = `
                                                                <td>${String.fromCharCode(65 + i)}</td>
                                                                <td>${data.options.Options[i].text}</td>
                                                                `
        var row3 = document.createElement('td');
        if (data.options.Options[i].IsCorrect) {
            var init_img = document.createElement('img');
            init_img.src = "/images/resource/correct.png"
            init_img.alt = "正确";
            init_img.style = "width: 24px; height: 24px;"
            row3.appendChild(init_img);
        }
        row2.appendChild(row3);
        row.appendChild(row2);
        i++;
    }

    unit.appendChild(row);

    var insert_button = document.createElement('button');
    var insert_img = document.createElement('img');
    insert_img.src = "/images/resource/insert.png"
    insert_img.alt = "插入";
    insert_img.style = "width: 24px; height: 24px;"
    insert_button.appendChild(insert_img);
    insert_button.onclick = function () {
        document.getElementById('modal').style.display = 'block';
        insertSlot = parseInt(insert_button.getAttribute("index"));
    }
    insert_button.style = "width: 100%; height: 48px;"
    unit.appendChild(insert_button);

    console.log(unit)
    return unit;
}

function insert(i, data) {
    unitList.splice(i, 0, buildUnit(data));
    questionIds.splice(i, 0, data.questionId);
    console.log("questionIds:",questionIds)
    paper_repaint();
}

function paper_repaint() {
    console.log("paper_repaint")
    while (_main.children[2]) _main.children[2].remove();
    var i = 0;
    while (unitList[i]) {
        var tem = unitList[i];
        const row = document.createElement('span');
        row.textContent = i + 1 + '、';
        row.style.fontSize = "24px";
        row.className = "indexSpan";
        tem.lastChild.setAttribute("index",i + 1);  //定义index属性
        if(tem.firstChild.className==="indexSpan"){
            tem.firstChild.textContent = i + 1 + '、';
        }else{
            tem.insertBefore(row, tem.firstChild);
        }
        _main.appendChild(tem);
        i++;
    }
}

function toggleIcon() {
    const img = this.querySelector('img');

    if (this.data_status === "correct") {
        img.src = "/images/resource/incorrect.png";
        img.alt = "不正确";
        this.data_status = "incorrect";
    } else {
        img.src = "/images/resource/correct.png";
        img.alt = "正确";
        this.data_status = "correct";
    }
}
// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openIframeModal() {
    document.getElementById("oldQuestionModal").style.display = "block"
    oldNameSpace.fillTable2(old_data2);
    old_questionIds = new Array();
}

function openIframeModal2() {
    // closeModal();
    const modal = document.getElementById('iframeModal');
    modal.style.display = 'flex';

    // 创建并插入 iframe
    const iframe = document.createElement('iframe');
    iframe.src = '/html/teacher/resource/create_paper_newQuestion.html';  // 目标页面 URL
    iframe.className = 'modal-iframe';

    // 把 iframe 添加到模态框内容区域
    const modalContent = modal.querySelector('.modal-content2');
    modalContent.appendChild(iframe);
}

// 关闭模态框并移除 iframe
function closeIframeModal() {
    const modal = document.getElementById('iframeModal');
    modal.style.display = 'none';

    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.remove();
    }
}

function getData(questionIds) {
    var data = {
        get_question_detail:{isRequest: true, question_id:parseInt(questionIds)}
    };

    return fetch('/resourceDetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("get_question",_data)
            insert(insertSlot, _data.data);
            return true;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function savePaper(){  //保存试卷
    var ids = questionIds.map(item => item);
    console.log("questionIds",questionIds)
    var data = {
        create_paper:{
            isRequest: true,
            title: document.getElementById("paperTitle").textContent,
            question_id: ids
        }
    };
    console.log("savePaper:",data)
    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("Paper save")
            unitList.forEach(div=>{
                div.remove();
            })
            questionIds = [];
            createPaperModal.style.display="none";  //关闭窗口
            getdata();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

