let questionData ;
let answerData ;
let urlParams = new URLSearchParams(window.location.search);
let lesson_id = urlParams.get('lessonID');

const questionListContainer = document.getElementById('question-list');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-btn');
const pieChartContainer = document.getElementById('pie-chart');
const progressBarsContainer = document.getElementById('progress-bars');
const questionTitle = document.getElementById('question-title');
// document.addEventListener('DOMContentLoaded',
window.onload = function(){
    var data = {
        lesson_answer_record:{isRequest: true, lesson_id: parseInt(lesson_id)},  //获取课堂列表
    }
    fetch('/after_lesson' ,{
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            answerData = data.data
            TakeQuestion()
        })
        .catch(error => {
            console.error('Error:',error);
        });
    // 关闭弹窗
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

function TakeQuestion(){
    var data = {
        get_paper_detail:{isRequest: true, paper_id: parseInt(answerData.paper_id)}
    };
    fetch('/resourceDetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            questionData = data.data
            // 初始化
            console.log(answerData)
            console.log(questionData)
            createQuestionItems();
        })
        .catch(error => {
            console.error('Error:',error);
        });
}

// 创建题目列表
function createQuestionItems() {
    console.log("questionData:",questionData)
    questionData.question.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.classList.add('question-item');
        questionItem.textContent = `${question.title} - 正确率: ${((answerData.question_answer_record[index].correct_num / answerData.lesson_member_num) * 100).toFixed(2)}%`;

        // 点击题目时打开弹窗
        questionItem.addEventListener('click', function() {
            openModal(question, index);
        });

        questionListContainer.appendChild(questionItem);
    });
}

// 打开弹窗并显示详细数据
function openModal(question, index) {
    questionTitle.textContent = question.title;

    // 绘制扇形图（饼图）
    drawPieChart(question, index);

    // 绘制选项进度条
    drawProgressBars(question, index);

    modal.style.display = 'flex';
}

// 绘制饼图显示正确率
function drawPieChart(question, index) {
    const correctRate = answerData.question_answer_record[index].correct_num / answerData.lesson_member_num;
    const incorrectRate = 1 - correctRate;

    const ctx = pieChartContainer.getContext('2d');
    const pieData = {
        labels: ['正确', '错误'],
        datasets: [{
            data: [correctRate * 100, incorrectRate * 100],
            backgroundColor: ['#4CAF50', '#F44336'],
            hoverOffset: 4
        }]
    };

    if (window.pieChart) {
        window.pieChart.destroy(); // 销毁旧的图表
    }

    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: pieData
    });
}

// 绘制选项进度条
function drawProgressBars(question, index) {
    progressBarsContainer.innerHTML = ''; // 清空进度条容器

    question.options.Options.forEach((option, optionIndex) => {
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        console.log(answerData)
        const selectedCount = answerData.question_answer_record[index].option_num[optionIndex];
        const percentage = (selectedCount / answerData.lesson_member_num) * 100;
        progressBar.style.width = percentage*2;
        const optionSpan = document.createElement('span');
        optionSpan.innerText = `${option.text} (${percentage.toFixed(2)}%)`
            //`<span style="font-size: 10px; background-color: #2196F3; color: #1f1f1f">${option.text} (${percentage.toFixed(2)}%)</span>`;
        progressBarsContainer.appendChild(optionSpan);
        progressBarsContainer.appendChild(progressBar);
    });
}
