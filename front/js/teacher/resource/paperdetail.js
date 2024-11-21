const urlParams = new URLSearchParams(window.location.search);
const paperId = urlParams.get("paperId");

function jumpToAnalysePage() {
    window.location.href = `paper_analyse.html?paperId=${paperId}`
}

function func1(data) {
    const _main = document.getElementById('_main');

    var row = document.createElement('p');
    console.log(data)
    row.textContent = data.name;
    row.style.fontSize = "36px";
    row.style.textAlign = "center"
    _main.appendChild(row)

    let i = 0;
    while (data.question[i]) {
        var row = document.createElement('span');
        row.textContent = i + 1 + "、";
        row.style.fontSize = "24px";
        row.style.display = "inline-flex";
        _main.appendChild(row)
        var row = document.createElement('span');

        row.textContent = data["question"][i].title;
        row.style.fontSize = "24px";
        _main.appendChild(row)

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
        var j = 0;
        while (data.question[i].option[j]) {
            var row2 = document.createElement('tr');
            row2.innerHTML = `
                                            <td>${String.fromCharCode(65 + j)}</td>
                                            <td>${data.question[i].option[j].text}</td>
                                            `
            if (data.question[i].option[j].isCorrect) {
                var init_img = document.createElement('img');
                init_img.src = "correct.png"
                init_img.alt = "正确";
                init_img.style = "width: 24px; height: 24px;";
            }
            else {
                var init_img = document.createElement('img');
                init_img.src = "incorrect.png"
                init_img.alt = "不正确";
                init_img.style = "width: 24px; height: 24px;";
            }
            var row3 = document.createElement('td');
            row3.appendChild(init_img);
            row2.appendChild(row3);
            row.appendChild(row2)
            j++;
        }

        _main.appendChild(row);
        i++;
    }
}

function getPaper() {
    var data = {
        paperId: -1
    }
    data.paperId = paperId;
    fetch('https://mock.apipost.net/mock/3610001ac4e5000/?apipost_id=3afe5fb9b56011')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // 将响应的 JSON 数据解析成对象
        })
        .then(_data => {
            func1(_data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

getPaper();
