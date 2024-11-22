let oldNameSpace = window.oldNameSpace || {};
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
var old_data2 = false;
var old_data3 = false;
var old_haveGotSubjects = false;
var lastold_GotQ = new Array(3), nowold_GotQ = new Array('/', '/', '/'), lastold_GotQ2 = new Array(3), nowold_GotQ2 = new Array('/', '/', '/');
var old_questionIds = new Array(), questionIds = /*window.parent ? window.parent.old_questionIds : */new Array();

const  old_maxRows = 10;
old_toggleButton2.disabled = true;
old_content2.style.display = 'block';
old_toggleButton2.onclick = function () {
    old_toggleButton2.disabled = true;
    old_toggleButton3.disabled = false;
    old_content2.style.display = 'block';
    old_content3.style.display = 'none';
    if (!old_data2) oldNameSpace.getdata2();
};
old_toggleButton3.onclick = function () {
    old_toggleButton2.disabled = false;
    old_toggleButton3.disabled = true;
    old_content2.style.display = 'none';
    old_content3.style.display = 'block';
    if (!old_data3) oldNameSpace.getdata3();
};
document.getElementById('old_toggleButton7').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage > maxPage) old_pageNumber2.value = maxPage;
    else if (currentPage > minPage) old_pageNumber2.value = currentPage - 1;
    else old_pageNumber2.value = minPage;

    oldNameSpace.fillTable2(old_data2);
};

document.getElementById('old_toggleButton8').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage < minPage) old_pageNumber2.value = minPage;
    else if (currentPage > maxPage) old_pageNumber2.value = maxPage;

    oldNameSpace.fillTable2(old_data2);
};

document.getElementById('old_toggleButton9').onclick = function () {
    const currentPage = Number(old_pageNumber2.value);
    const minPage = Number(old_pageNumber2.min);
    const maxPage = Number(old_pageNumber2.max);

    if (currentPage < minPage) old_pageNumber2.value = minPage;
    else if (currentPage < maxPage) old_pageNumber2.value = currentPage + 1;
    else old_pageNumber2.value = maxPage;

    oldNameSpace.fillTable2(old_data2);
};
document.getElementById('old_toggleButton10').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage > maxPage) old_pageNumber3.value = maxPage;
    else if (currentPage > minPage) old_pageNumber3.value = currentPage - 1;
    else old_pageNumber3.value = minPage;

    oldNameSpace.fillTable3(old_data3);
};

document.getElementById('old_toggleButton11').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage < minPage) old_pageNumber3.value = minPage;
    else if (currentPage > maxPage) old_pageNumber3.value = maxPage;

    oldNameSpace.fillTable3(old_data3);
};

document.getElementById('old_toggleButton12').onclick = function () {
    const currentPage = Number(old_pageNumber3.value);
    const minPage = Number(old_pageNumber3.min);
    const maxPage = Number(old_pageNumber3.max);

    if (currentPage < minPage) old_pageNumber3.value = minPage;
    else if (currentPage < maxPage) old_pageNumber3.value = currentPage + 1;
    else old_pageNumber3.value = maxPage;

    oldNameSpace.fillTable3(old_data3);
};

oldNameSpace.changeQuestionList = function(element) {
    const qid = Number(element.dataset.qid)
    if (element.checked)
        old_questionIds.push(qid);
    else {
        const index = old_questionIds.indexOf(qid)
        if (index !== -1)
            old_questionIds.splice(index, 1);
    }
}

document.getElementById('import_button').onclick = async function () {
    console.log("old_questionIds:",old_questionIds);
    var i=old_questionIds.length-1;
    while(i>=0){
        await getData(old_questionIds[i]);
        i--;
    }
    document.getElementById("oldQuestionModal").style.display="none";
}

document.getElementById('close_button').onclick = function () {
    document.getElementById("oldQuestionModal").style.display="none";
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
                if (lastold_GotQ[0] != nowold_GotQ[0] || lastold_GotQ[1] != nowold_GotQ[1] || lastold_GotQ[2] != nowold_GotQ[2])
                    oldNameSpace.getdata2();
            }
            else old_dropdownMenu.style.display = "block";
            if (!old_haveGotSubjects) oldNameSpace.getSubjects();
            break;
        case 'old_dropdownButton2':
            if (old_dropdownMenu2.style.display === "block") {
                old_dropdownMenu2.style.display = "none";
                old_container4.classList.remove('open');
                old_container5.classList.remove('open');
                old_container6.classList.remove('open');
                if (lastold_GotQ2[0] != nowold_GotQ2[0] || lastold_GotQ2[1] != nowold_GotQ2[1] || lastold_GotQ2[2] != nowold_GotQ2[2])
                    oldNameSpace.getdata3();
            }
            else old_dropdownMenu2.style.display = "block";
            if (!old_haveGotSubjects) oldNameSpace.getSubjects();
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
                        nowold_GotQ[0] = clickedElement.textContent;
                        nowold_GotQ[1] = '/';
                        nowold_GotQ[2] = '/';
                        while (old_options2.children[1]) old_options2.children[1].remove();
                        while (old_options3.children[1]) old_options3.children[1].remove();
                        old_custom_select2.textContent = "课程：/"
                        old_custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await oldNameSpace.getCourses(old_custom_select1.textContent.slice(3));
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
                        nowold_GotQ[1] = clickedElement.textContent;
                        nowold_GotQ[2] = '/';
                        while (old_options3.children[1]) old_options3.children[1].remove();
                        old_custom_select3.textContent = "章节：/"
                        if (clickedElement.textContent != '/') {
                            (async () => {
                                const _data = await oldNameSpace.getSections(old_custom_select2.textContent.slice(3));
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
                        nowold_GotQ[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            oldNameSpace.getdata2();
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
                                const _data = await oldNameSpace.getCourses(old_custom_select4.textContent.slice(3));
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
                            oldNameSpace.getSections(old_custom_select5.textContent.slice(3));
                        (async () => {
                            const _data = await oldNameSpace.getSections(old_custom_select5.textContent.slice(3));
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
                        nowold_GotQ2[2] = clickedElement.textContent;
                        if (clickedElement.textContent != '/') {
                            oldNameSpace.getdata3();
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

oldNameSpace.fillTable2 = function (data) {
    const tbody = document.getElementById('old_myTable2').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (old_pageNumber2.value - 1) *  old_maxRows; i < old_pageNumber2.value *  old_maxRows; i++) {
        const row2 = document.createElement('tr');
        if (data[i]) {
            row2.innerHTML = `
                                        <td><input type="checkbox" name="selectRow" data-qid=${data[i].questionId} onclick="oldNameSpace.changeQuestionList(this)" ${questionIds.includes(data[i].questionId) ? 'checked disabled' : old_questionIds.includes(data[i].questionId) ? 'checked' : ''}></td>
                                        <td>${i + 1}</td>
                                        <td>${data[i].title}</td>
                                        <td>${data[i].LastChangeTime}</td>
                            `;
            console.log(old_questionIds.includes(data[i].questionId))
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

 oldNameSpace.fillTable3 = function(data) {
    const tbody = document.getElementById('old_myTable3').querySelector('tbody');
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    for (let i = (old_pageNumber3.value - 1) *  old_maxRows; i < old_pageNumber3.value *  old_maxRows; i++) {
        const row3 = document.createElement('tr');
        const tbody = document.getElementById('old_myTable3').querySelector('tbody');
        // 如果有数据，填充数据，否则填充空单元格
        if (data[i]) {
            row3.innerHTML = `
                                <td><input type="checkbox" name="selectRow" data-qid=${data[i].questionId} onclick="oldNameSpace.changeQuestionList(this)" ${old_questionIds.includes(data[i].questionId) ? 'checked' + questionIds.includes(data[i].questionId) ? ' disabled' : '' : ''}></td>
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

 oldNameSpace.getdata2 = function(){
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
            old_data2 = _data.data.question;
            console.log(old_data2)
            lastold_GotQ = nowold_GotQ.slice();
            old_pageNumber2.max = Math.floor(old_data2.length / 10) + 1;
            if (old_pageNumber2.max === 0) old_pageNumber2.max = 1;
            oldNameSpace.fillTable2(old_data2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

 oldNameSpace.getdata3 = function() {
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
            old_data3 = _data.data.question;
            lastold_GotQ2 = nowold_GotQ2.slice();
            old_pageNumber3.max = Math.floor(old_data3.length / 10) + 1;
            if (old_pageNumber3.max === 0) old_pageNumber3.max = 1;
            oldNameSpace.fillTable3(old_data3);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

 oldNameSpace.getSubjects = function() {
            if (_data.data.subjects[0]) old_haveGotSubjects = true;
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
}

oldNameSpace.getCourses = async function(subject) {
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

oldNameSpace.getSections = async function (course) {
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

oldNameSpace.getdata2();