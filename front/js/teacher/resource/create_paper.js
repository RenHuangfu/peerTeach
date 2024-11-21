var insertSlot = 0;
var questionIds = new Array();
var unitList = new Array();
var data = [

];

const _main = document.getElementById('_main')
var row = document.createElement('p');
row.contentEditable = true;

row.textContent = "我的试卷一";

row.style.fontSize = "36px";
row.style.textAlign = "center"
_main.appendChild(row)

var insert_button = document.createElement('button');
var insert_img = document.createElement('img');
insert_img.src = "insert.png"
insert_img.alt = "插入";
insert_img.style = "width: 24px; height: 24px;"
insert_button.appendChild(insert_img);
insert_button.onclick = function () {
    document.getElementById('modal').style.display = 'block';
}
insert_button.style = "width: 100%; height: 48px;"
_main.appendChild(insert_button);

function insertQuestions(questionIds) {
    closeIframeModal();
    getData(questionIds);
}

function buildUnit(data) {
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
    while (data.options[i]) {
        var row2 = document.createElement('tr');
        row2.innerHTML = `
                                                                <td>${String.fromCharCode(65 + i)}</td>
                                                                <td>${data.options[i].text}</td>
                                                                `
        var row3 = document.createElement('td');
        if (data.options[i].isCorrect) {
            var init_img = document.createElement('img');
            init_img.src = "correct.png"
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
    insert_img.src = "insert.png"
    insert_img.alt = "插入";
    insert_img.style = "width: 24px; height: 24px;"
    insert_button.appendChild(insert_img);
    insert_button.onclick = function () {
        document.getElementById('modal').style.display = 'block';
    }
    insert_button.style = "width: 100%; height: 48px;"
    unit.appendChild(insert_button);

    return unit;
}

function insert(i, data) {
    console.log(data)
    var i = 0;
    while (data[i]) {
        unitList.splice(i, 0, buildUnit(data[i]));
        questionIds.splice(i, 0, data[i]);
        i++
    }
    repaint();
}

function repaint() {
    while (_main.children[2]) _main.children[2].remove();
    var i = 0;
    while (unitList[i]) {
        var tem = unitList[i];
        const row = document.createElement('span');
        row.textContent = i + 1 + '、';
        row.style.fontSize = "24px";
        tem.insertBefore(row, tem.firstChild);
        console.log(tem)
        _main.appendChild(tem);
        i++;
    }
}

function toggleIcon() {
    const img = this.querySelector('img');

    if (this.data_status === "correct") {
        img.src = "incorrect.png";
        img.alt = "不正确";
        this.data_status = "incorrect";
    } else {
        img.src = "correct.png";
        img.alt = "正确";
        this.data_status = "correct";
    }
}
// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openIframeModal() {
    // closeModal();
    const modal = document.getElementById('iframeModal');
    modal.style.display = 'flex';

    // 创建并插入 iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'create_paper_1.html';  // 目标页面 URL
    iframe.className = 'modal-iframe';

    // 把 iframe 添加到模态框内容区域
    const modalContent = modal.querySelector('.modal-content2');
    modalContent.appendChild(iframe);
}

function openIframeModal2() {
    // closeModal();
    const modal = document.getElementById('iframeModal');
    modal.style.display = 'flex';

    // 创建并插入 iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'create_question2.html';  // 目标页面 URL
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
    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=51619c5f60002', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(_data => {
            insert(insertSlot, _data.data.questions);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//监听子页面消息
addEventListener('message', e => {
    // e.data为子页面发送的数据
    console.log(e.data)
})

