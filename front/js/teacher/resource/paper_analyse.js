var options = document.getElementById('classes');
var lastChoose = -1;
var paperId = 0;

options.onclick = function (event) {
    if (Number(event.target.value) != lastChoose) {
        lastChoose = event.target.value;
        getPaper(paperId, event.target.value);
    }
}

function func1(data) {
    var i = 0;
    while (data.courses[i]) {
        var option = document.createElement('option');
        option.value = data.courses[i].courseId;
        option.textContent = data.courses[i].name;
        options.appendChild(option);
        i++;
    }
}

function func2(data) {
    const _main = document.getElementById('_main')
    var title = document.getElementById('title');
    title.textContent = data.name;
    title.style.fontSize = "36px";
    title.style.textAlign = "center"

    while (_main.children[2]) _main.children[2].remove();

    var i = 0;
    while (data.question[i]) {
        var row = document.createElement('span');
        row.textContent = i + 1 + "、" + data.question[i].title;
        row.style.fontSize = "24px";
        _main.appendChild(row)


        var row = document.createElement('table');

        row.innerHTML = `
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>选项</th>
                                        <th>正确答案</th>
                                        <th>小计</th>
                                        <th>比例</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            `
        var j = 0;
        var sum = 0;
        var correct_sum = 0;
        while (data.question[i].option[j]) {
            sum += data.question[i].option[j].count;
            if (data.question[i].option[j].isCorrect)
                correct_sum += data.question[i].option[j].count;
            j++;
        }
        var j = 0;
        while (data.question[i].option[j]) {
            var row2 = document.createElement('tr');
            row2.innerHTML = `
             <td >${String.fromCharCode(65 + j)}</td>
             <td>${data.question[i].option[j].text}</td>
        `
            var row3 = document.createElement('td');
            if (data.question[i].option[j].isCorrect) {
                var init_img = document.createElement('img');
                init_img.src = "correct.png"
                init_img.alt = "正确";
                init_img.style = "width: 24px; height: 24px;"
                row3.appendChild(init_img);
            }
            row2.appendChild(row3);
            var row3 = document.createElement('td');
            row3.textContent = data.question[i].option[j].count;
            row2.appendChild(row3);
            var row3 = document.createElement('td');
            row3.textContent = data.question[i].option[j].count / sum;
            row2.appendChild(row3);
            row.appendChild(row2)
            j++;
        }
        var row2 = document.createElement('tr');
        row2.innerHTML = `
        <td colspan="4">正确率</td>
        <td>${correct_sum / sum}</td>
    `
        row.appendChild(row2);
        _main.appendChild(row);

        i++;
    }
}

function getPaperCourse() {
    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3dbe553360005')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // 将响应的 JSON 数据解析成对象
        })
        .then(_data => {
            func1(_data.data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getPaper(paperId, courseId) {
    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=23900fa236006d&paperId=')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // 将响应的 JSON 数据解析成对象
        })
        .then(_data => {
            func2(_data.data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

getPaperCourse();
getPaper(paperId, -1);