var lastDrop1 = "-3", lastDrop2 = "-3", flag = true;

function paint(data) {
    var row = document.getElementById('div1');
    var row1 = document.createElement('p');
    row1.style = "text-align:center; font-size:24px";
    row1.textContent = data.title;
    row.appendChild(row1);

    const content = document.createElement('div');
    var len = data.options.length;
    for (var i = 0; i < len; i++) {
        var ele = document.createElement('div');
        var ele2 = document.createElement('span');
        ele2.textContent = String.fromCharCode(65 + i) + '、' + data.options[i].text;
        ele2.style.marginLeft = "30px"
        ele.appendChild(ele2);

        if (data.options[i].isCorrect) {
            const imgButton3 = document.createElement("img");
            imgButton3.src = "../../../images/teacher/resource/correct.png";
            imgButton3.style = "width: 24px; height: 24px;"
            imgButton3.alt = "正确";
            imgButton3.style.cursor = "pointer";
            imgButton3.style.float = "right";
            imgButton3.style.marginRight = "30px";
            ele.appendChild(imgButton3);
        }
        else {
            const imgButton4 = document.createElement("img");
            imgButton4.src = "../../../images/teacher/resource/inCorrect.png";
            imgButton4.style = "width: 24px; height: 24px;"
            imgButton4.alt = "错误";
            imgButton4.style.cursor = "pointer";
            imgButton4.style.float = "right";
            imgButton4.style.marginRight = "30px";
            ele.appendChild(imgButton4);
        }
        ele.style.margin = "20px";
        content.appendChild(ele);
    }
    row.appendChild(content)
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
            paint(_data.data.questions[0]);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

getData(1);