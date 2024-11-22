const old_toggleButton2 = document.getElementById('old_toggleButton2');
const old_toggleButton3 = document.getElementById('old_toggleButton3');
const old_pageNumber2 = document.getElementById('old_pageNumber2');
const old_pageNumber3 = document.getElementById('old_pageNumber3');
const old_dropdownMenu = document.getElementById("old_dropdownMenu");
const old_dropdownButton = document.getElementById('old_dropdownButton');
const old_dropdownMenu2 = document.getElementById("old_dropdownMenu2");
const old_dropdownButton2 = document.getElementById('old_dropdownButton2');
const old_custom_select1 = document.getElementById('old_custom-select1');
const old_custom_select2 = document.getElementById('old_custom-select2');
const old_custom_select3 = document.getElementById('old_custom-select3');
const old_custom_select4 = document.getElementById('old_custom-select4');
const old_custom_select5 = document.getElementById('old_custom-select5');
const old_custom_select6 = document.getElementById('old_custom-select6');
const old_container1 = document.getElementById('old_customSelectContainer1');
const old_container2 = document.getElementById('old_customSelectContainer2');
const old_container3 = document.getElementById('old_customSelectContainer3');
const old_container4 = document.getElementById('old_customSelectContainer4');
const old_container5 = document.getElementById('old_customSelectContainer5');
const old_container6 = document.getElementById('old_customSelectContainer6');
const old_options1 = document.getElementById('old_customSelectOptions1');
const old_options2 = document.getElementById('old_customSelectOptions2');
const old_options3 = document.getElementById('old_customSelectOptions3');
const old_options4 = document.getElementById('old_customSelectOptions4');
const old_options5 = document.getElementById('old_customSelectOptions5');
const old_options6 = document.getElementById('old_customSelectOptions6');
var data2, data3, haveGotSubjects = false;
var lastGotQ = new Array(3), nowGotQ = new Array('/', '/', '/'), lastGotQ2 = new Array(3), nowGotQ2 = new Array('/', '/', '/');
var questionIds = new Array(), questionIds_added = /*window.parent ? window.parent.questionIds : */new Array();

const maxRows = 10;
old_toggleButton2.disabled = true;
old_content2.style.display = 'block';
old_toggleButton2.onclick = function () {
    old_toggleButton2.disabled = true;
    old_toggleButton3.disabled = false;
    old_content2.style.display = 'block';
    old_content3.style.display = 'none';
    if (!data2) getdata2();
};
old_toggleButton3.onclick = function () {
    old_toggleButton2.disabled = false;
    old_toggleButton3.disabled = true;
    old_content2.style.display = 'none';
    old_content3.style.display = 'block';
    if (!data3) getdata3();
};
document.getElementById('old_toggleButton7').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage > maxPage) old_pageNumber2.value = maxPage;
    else if (currentPage > minPage) old_pageNumber2.value = currentPage - 1;
    else old_pageNumber2.value = minPage;

    fillTable2(data2);
};

document.getElementById('old_toggleButton8').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage < minPage) old_pageNumber2.value = minPage;
    else if (currentPage > maxPage) old_pageNumber2.value = maxPage;

    fillTable2(data2);
};

document.getElementById('old_toggleButton9').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage < minPage) old_pageNumber2.value = minPage;
    else if (currentPage < maxPage) old_pageNumber2.value = currentPage + 1;
    else old_pageNumber2.value = maxPage;

    fillTable2(data2);
};
document.getElementById('old_toggleButton10').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage > maxPage) old_pageNumber3.value = maxPage;
    else if (currentPage > minPage) old_pageNumber3.value = currentPage - 1;
    else old_pageNumber3.value = minPage;

    fillTable3(data3);
};

document.getElementById('old_toggleButton11').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage < minPage) old_pageNumber3.value = minPage;
    else if (currentPage > maxPage) old_pageNumber3.value = maxPage;

    fillTable3(data3);
};

document.getElementById('old_toggleButton12').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage < minPage) old_pageNumber3.value = minPage;
    else if (currentPage < maxPage) old_pageNumber3.value = currentPage + 1;
    else old_pageNumber3.value = maxPage;

    fillTable3(data3);
};

function changeQuestionList(element) {
    const qid = Number(element.dataset.qid)
    if (element.checked)
        questionIds.push(qid);
    else {
        const index = questionIds.indexOf(qid)
        if (index !== -1)
            questionIds.splice(index, 1);
    }
}

document.getElementById('import_button').onclick = function () {
    
    if (window.parent) {
        console.log(questionIds)
        window.parent.postMessage(questionIds, '*');
    }
}

document.addEventListener('click', function (event) {
    const clickedElement = event.target;
    switch (clickedElement.id) {
        case 'old_dropdownButton':
            if (old_dropdownMenu.style.display === "block") {
                old_dropdownMenu.style.display = "none";
                old_container1.classList.remove('open');
                old_container2.classList.remove('open');
                old_container3.classList.remove('open');
                if (lastGotQ[0] != nowGotQ[0] || lastGotQ[1] != nowGotQ[1] || lastGotQ[2] != nowGotQ[2])
                    getdata2();
            }
            else old_dropdownMenu.style.display = "block";
            if (!haveGotSubjects) getSubjects();
            break;
        case 'old_dropdownButton2':
            if (old_dropdownMenu2.style.display === "block") {
                old_dropdownMenu2.style.display = "none";
                old_container4.classList.remove('open');
                old_container5.classList.remove('open');
                old_container6.classList.remove('open');
                if (lastGotQ2[0] != nowGotQ2[0] || lastGotQ2[1] != nowGotQ2[1] || lastGotQ2[2] != nowGotQ2[2])
                    getdata3();
            }
            else old_dropdownMenu2.style.display = "block";
            if (!haveGotSubjects) getSubjects();
            break;
        case 'old_custom-select1':
            old_container1.classList.toggle('open');
            old_container2.classList.remove('open');
            old_container3.classList.remove('open');
            break;
        case 'old_custom-select2':
            old_container2.classList.toggle('open');
            old_container1.classList.remove('open');
            old_container3.classList.remove('open');
            break;
        case 'old_custom-select3':
            old_container3.classList.toggle('open');
            old_container1.classList.remove('open');
            old_container2.classList.remove('open');
            break;
        case 'old_custom-select4':
            old_container4.classList.toggle('open');
            old_container5.classList.remove('open');
            old_container6.classList.remove('open');
            break;
        case 'old_custom-select5':
            old_container5.classList.toggle('open');
            old_container4.classList.remove('open');
            old_container6.classList.remove('open');
            break;
        case 'old_custom-select6':
            old_container6.classList.toggle('open');
            old_container4.classList.remove('open');
            old_container5.classList.remove('open');
            break;
        default:
            switch (clickedElement.parentElement.id) {
                case 'old_customSelectOptions1':
                    if (old_custom_select1.textContent != "学科：" + clickedElement.textContent) {
                        old_custom_select1.textContent = "学科：" + clickedElement.textContent;
                        nowGotQ[0] = clickedElement.textContent;
                        nowGotQ[1] = '/';
                        nowGotQ[2] = '/';
                        while (old_options2.children[1]) old_options2.children[1].remove();
                        while (old_options3.children[1]) old_options3.children[1].remove();
                        old_custom_select2.textContent = "课程：/"
                        old_custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await getCourses(old_custom_select1.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.courses[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.courses[i];
                                        old_options2.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
                        }
                    }
                    old_container1.classList.remove('open');
                    break;
                case 'old_customSelectOptions2':
                    if (old_custom_select2.textContent != "课程：" + clickedElement.textContent) {
                        old_custom_select2.textContent = "课程：" + clickedElement.textContent;
                        nowGotQ[1] = clickedElement.textContent;
                        nowGotQ[2] = '/';
                        while (old_options3.children[1]) old_options3.children[1].remove();
                        old_custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await getSections(old_custom_select2.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.sections[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.sections[i];
                                        old_options3.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
                        }
                    }
                    old_container2.classList.remove('open');
                    break;
                case 'old_customSelectOptions3':
                    old_pageNumber2.value = "1";
                    if (old_custom_select3.textContent != "章节：" + clickedElement.textContent) {
                        old_custom_select3.textContent = "章节：" + clickedElement.textContent;
                        nowGotQ[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            getdata2();
                            old_dropdownMenu.style.display = "none"
                        }
                    }
                    old_container3.classList.remove('open');
                    break;
                case 'old_customSelectOptions4':
                    if (old_custom_select4.textContent != "学科：" + clickedElement.textContent) {
                        old_custom_select4.textContent = "学科：" + clickedElement.textContent;
                        while (old_options5.children[1]) old_options5.children[1].remove();
                        while (old_options6.children[1]) old_options6.children[1].remove();
                        old_custom_select5.textContent = "课程：/"
                        old_custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await getCourses(old_custom_select4.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.courses[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.courses[i];
                                        old_options5.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
                        }
                    }
                    old_container4.classList.remove('open');
                    break;
                case 'old_customSelectOptions5':
                    if (old_custom_select5.textContent != "课程：" + clickedElement.textContent) {
                        old_custom_select5.textContent = "课程：" + clickedElement.textContent;
                        while (old_options6.children[1]) old_options6.children[1].remove();
                        old_custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/')
                            getSections(old_custom_select5.textContent.slice(3));
                        (async () => {
                            const _data = await getSections(old_custom_select5.textContent.slice(3));
                            if (_data != null) {
                                var i = 0;
                                while (_data.data.sections[i]) {
                                    const row = document.createElement('a');
                                    row.textContent = _data.data.sections[i];
                                    old_options6.appendChild(row);
                                    i++;
                                }
                            }
                        })();
                    }
                    old_container5.classList.remove('open');
                    break;
                case 'old_customSelectOptions6':
                    old_pageNumber3.value = "1";
                    if (old_custom_select6.textContent != "章节：" + clickedElement.textContent) {
                        old_custom_select6.textContent = "章节：" + clickedElement.textContent;
                        nowGotQ2[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            getdata3();
                            old_dropdownMenu2.style.display = "none"
                        }
                    }
                    old_container6.classList.remove('open');
                    break;
                default:
                    old_dropdownMenu.style.display = "none"
                    old_dropdownMenu2.style.display = "none"
                    old_container1.classList.remove('open');
                    old_container2.classList.remove('open');
                    old_container3.classList.remove('open');
                    old_container4.classList.remove('open');
                    old_container5.classList.remove('open');
                    old_container6.classList.remove('open');
            }
    }
});

function fillTable2(data) {
    const tbody = document.getElementById('old_myTable2').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (old_pageNumber2.value - 1) * maxRows; i < old_pageNumber2.value * maxRows; i++) {
        const row2 = document.createElement('tr');
        if (data[i]) {
            row2.innerHTML = `
                                        <td><input type="checkbox" name="selectRow" data-qid=${data[i].questionId} onclick="changeQuestionList(this)" ${questionIds.includes(data[i].questionId) ? 'checked' + questionIds_added.includes(data[i].questionId) ? ' disabled' : '' : ''}></td>
                                        <td>${i + 1}</td>
                                        <td><input type="checkbox" name="selectRow" data-qid=${data[i].questionId} onclick="changeQuestionList(this)" ${questionIds_added.includes(data[i].questionId) ? 'checked disabled' : questionIds.includes(data[i].questionId) ? 'checked' : ''}></td>
                                        <td>${data[i].LastChangeTime}</td>
                            `;
            console.log(questionIds.includes(data[i].questionId))
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
    const tbody = document.getElementById('old_myTable3').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (old_pageNumber3.value - 1) * maxRows; i < old_pageNumber3.value * maxRows; i++) {
        const row3 = document.createElement('tr');
        const tbody = document.getElementById('old_myTable3').querySelector('tbody');
        // 如果有数据，填充数据，否则填充空单元格
        if (data[i]) {
            row3.innerHTML = `
                                <td><input type="checkbox" name="selectRow" data-qid=${data[i].questionId} onclick="changeQuestionList(this)" ${questionIds.includes(data[i].questionId) ? 'checked' + questionIds_added.includes(data[i].questionId) ? ' disabled' : '' : ''}></td>
                                <td>${i + 1}</td>
                                <td>${data[i].title}</td>
                                <td>${data[i].LastChangeTime}</td>
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

function getdata2() {
    console.log("getdata2")
    var data = {
        get_question:{isRequest: true}
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
            data2 = _data.data.question;
            console.log(data2)
            questions = data2;  //本地保存题目信息
            lastGotQ = nowGotQ.slice();
            old_pageNumber2.max = Math.floor(data2.length / 10) + 1;
            if (old_pageNumber2.max === 0) old_pageNumber2.max = 1;
            fillTable2(data2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getdata3() {
    var data = {
        get_global_question:{isRequest: true}
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
            data3 = _data.data.question;
            lastGotQ2 = nowGotQ2.slice();
            old_pageNumber3.max = Math.floor(data3.length / 10) + 1;
            if (old_pageNumber3.max === 0) old_pageNumber3.max = 1;
            fillTable3(data3);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getSubjects() {
    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3c0e668ff56007', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(_data => {
            if (_data.data.subjects[0]) haveGotSubjects = true;
            var i = 0;
            while (_data.data.subjects[i]) {
                const row2 = document.createElement('a');
                row2.textContent = _data.data.subjects[i];
                const row3 = document.createElement('a');
                row3.textContent = _data.data.subjects[i];
                old_options1.appendChild(row2);
                old_options4.appendChild(row3);
                i++;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getCourses(subject) {
    try {
        const response = await fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3ed61525760000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject })
        });

        const _data = await response.json();
        return _data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getSections(course) {
    try {
        const response = await fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3f05a0fd76000c', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ course })
        });

        const _data = await response.json();
        return _data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

getdata2();