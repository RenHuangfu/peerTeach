const toggleButton1 = document.getElementById('toggleButton1');
const toggleButton2 = document.getElementById('toggleButton2');
const toggleButton3 = document.getElementById('toggleButton3');
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
var data, data2, data3, haveGotSubjects = false, lastGotQ = new Array(3), nowGotQ = new Array('/', '/', '/'), lastGotQ2 = new Array(3), nowGotQ2 = new Array('/', '/', '/');
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
            if (!haveGotSubjects) getSubjects();
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
                            (async () => {
                                const _data = await getCourses(custom_select1.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.courses[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.courses[i];
                                        options2.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
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
                            (async () => {
                                const _data = await getSections(custom_select2.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.sections[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.sections[i];
                                        options3.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
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
                        while (options5.children[1]) options5.children[1].remove();
                        while (options6.children[1]) options6.children[1].remove();
                        custom_select5.textContent = "课程：/"
                        custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await getCourses(custom_select4.textContent.slice(3));
                                if (_data != null) {
                                    var i = 0;
                                    while (_data.data.courses[i]) {
                                        const row = document.createElement('a');
                                        row.textContent = _data.data.courses[i];
                                        options5.appendChild(row);
                                        i++;
                                    }
                                }
                            })();
                        }
                    }
                    container4.classList.remove('open');
                    break;
                case 'customSelectOptions5':
                    if (custom_select5.textContent != "课程：" + clickedElement.textContent) {
                        custom_select5.textContent = "课程：" + clickedElement.textContent;
                        while (options6.children[1]) options6.children[1].remove();
                        custom_select6.textContent = "章节：/"
                        if (clickedElement.textContent != '/')
                            getSections(custom_select5.textContent.slice(3));
                        (async () => {
                            const _data = await getSections(custom_select5.textContent.slice(3));
                            if (_data != null) {
                                var i = 0;
                                while (_data.data.sections[i]) {
                                    const row = document.createElement('a');
                                    row.textContent = _data.data.sections[i];
                                    options6.appendChild(row);
                                    i++;
                                }
                            }
                        })();
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

function fillTable(data) {
    const tbody = document.getElementById('myTable1').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (pageNumber.value - 1) * maxRows; i < pageNumber.value * maxRows; i++) {
        const row = document.createElement('tr');
        row.onclick = function(){
            window.location.href=("/paperDetail?paper_id="+data[i].paperId)
        }
        if (data[i]) {
            row.innerHTML = `
                                        <td>${i + 1}</td>
                                        <td>${data[i].title}</td>
                                        <td>${formatDate(data[i].LastChangeTime)}</td>
                                        <td>
                                            <button class="btn-img" onclick="editRow()">
                                                <img src="" alt="编辑">
                                            </button>
                                            <button class="btn-img" onclick="deleteRow()">
                                                <img src="" alt="删除">
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
    const tbody = document.getElementById('myTable2').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (pageNumber2.value - 1) * maxRows; i < pageNumber2.value * maxRows; i++) {
        const row2 = document.createElement('tr');
        if (data[i]) {
            row2.innerHTML = `
                                        <td>${data[i].questionId}</td>
                                        <td>${data[i].title}</td>
                                        <td>${data[i].LastChangeTime}</td>
                                        <td>
                                            <button class="btn-img" onclick="editRow()">
                                                <img src="" alt="编辑">
                                            </button>
                                            <button class="btn-img" onclick="deleteRow()">
                                                <img src="" alt="删除">
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
                                <td>${data[i].questionId}</td>
                                <td>${data[i].title}</td>
                                <td>${data[i].LastChangeTime}</td>
                                <td>
                                    <button class="btn-img" onclick="editRow()">
                                        <img src="" alt="编辑">
                                        </button>
                                        <button class="btn-img" onclick="deleteRow()">
                                        <img src="" alt="删除">
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


function getdata() {//获取试卷概要
    var resourceData = {
        get_paper:{isRequest:true},
        get_question:{isRequest:false},
        get_global_question:{isRequest:false},
    }
    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
    })
        .then(response => response.json())
        .then(_data => {
            data = _data.data.papers;
            console.log(data);
            pageNumber.max = Math.floor(data.length / 10) + 1;
            if (pageNumber.max === 0) pageNumber.max = 1;
            fillTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getdata2() {//获取‘我的题库’
    var resourceData = {
        get_paper:{isRequest:false},
        get_question:{isRequest:true},
        get_global_question:{isRequest:false},
    }
    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
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

function getdata3() {//获取题库
    var resourceData = {
        get_paper:{isRequest:false},
        get_question:{isRequest:false},
        get_global_question:{isRequest:true},
    }
    fetch('/resource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
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
                options1.appendChild(row2);
                options4.appendChild(row3);
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

getdata();