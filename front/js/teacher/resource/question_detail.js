function QD_paint(data) {
    var row = document.getElementById('div1');
    var row1 = document.createElement('p');
    row.innerHTML = ''
    row1.style = "text-align:center; font-size:24px";
    row1.textContent = data.title;
    row.appendChild(row1);

    const content = document.createElement('div');
    var len = data.options.Options.length;
    for (var i = 0; i < len; i++) {
        var ele = document.createElement('div');
        var ele2 = document.createElement('span');
        ele2.textContent = String.fromCharCode(65 + i) + '、' + data.options.Options[i].text;
        ele2.style.marginLeft = "30px"
        ele.appendChild(ele2);

        if (data.options.Options[i].IsCorrect) {
            const imgButton3 = document.createElement("img");
            imgButton3.src = "/images/resource/correct.png";
            imgButton3.style = "width: 24px; height: 24px;"
            imgButton3.alt = "正确";
            imgButton3.style.cursor = "pointer";
            imgButton3.style.float = "right";
            imgButton3.style.marginRight = "30px";
            ele.appendChild(imgButton3);
        }
        else {
            const imgButton4 = document.createElement("img");
            imgButton4.src = "/images/resource/inCorrect.png";
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

function QD_getData(questionIds) {
    var data = {
        get_question_detail:{isRequest: true, question_id:parseInt(questionIds)}
    };

    fetch('/resourceDetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(_data => {
            console.log("get_question",_data)
            QD_paint(_data.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}