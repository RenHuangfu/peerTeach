let course_list = [];   //课程班级信息
let courseName_set = new Set();

// 获取自定义弹窗元素
const modal = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');
const closeSpan = document.getElementsByClassName('close')[0];

// 获取编辑课程名称弹窗元素
const editCourseModal = document.getElementById('editCourseModal');
const courseNameInput = document.getElementById('courseNameInput');
const saveCourseName = document.getElementById('saveCourseName');
const cancelEditCourse = document.getElementById('cancelEditCourse');
const closeEditCourseSpan = editCourseModal.getElementsByClassName('close')[0];

// 显示自定义弹窗
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// 隐藏自定义弹窗
function hideModal() {
    modal.style.display = 'none';
}

// 显示编辑课程名称弹窗
function showEditCourseModal(courseName) {
    courseNameInput.value = courseName;
    editCourseModal.style.display = 'block';
}

// 隐藏编辑课程名称弹窗
function hideEditCourseModal() {
    editCourseModal.style.display = 'none';
}

// 关闭弹窗
closeSpan.onclick = hideModal;
modalCancel.onclick = hideModal;

// 关闭编辑课程名称弹窗
closeEditCourseSpan.onclick = hideEditCourseModal;
cancelEditCourse.onclick = hideEditCourseModal;

// 确认删除课程
function confirmDeleteCourse(id, title) {
    showModal(`确认删除课程 ${title} 吗？`);
    modalConfirm.onclick = function() {
        hideModal();
        deleteCourse(id);
    };
}

// 确认删除班级
function confirmDeleteClass(id, name) {
    showModal(`确认删除班级 ${name} 吗？`);
    modalConfirm.onclick = function() {
        hideModal();
        deleteClass(id);
    };
}

// 构建带有查询参数的 URL
var url = "/course";
var postData = {
    get_course: {isRequest: true},
    delete_class: {isRequest: false},
    delete_course: {isRequest: false},
    edit_course: {isRequest: false},
    create_course: {isRequest: false},
    create_class:{isRequest: false},
    group_post: {isRequest: false}
};

// 发送 POST 请求
fetch(url, {
    method: "POST", // 指定请求方法为 POST
    headers: {
        "Content-Type": "application/json" // 设置请求头
    },
    body: JSON.stringify(postData) // 将数据转换为 JSON 字符串并作为请求体发送
})
    .then(response => {
        if (response.status === 200) { // 200 表示请求成功
            return response.json(); // 解析响应为 JSON
        } else if (response.status === 404) { // 404 表示资源未找到
            throw new Error("Resource not found");
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    })
    .then(data => {
        if(data.code === 0){    //code等于0表示正确，其他内容表示有错误
            const container = document.querySelector('.table-container');
            container.innerHTML = '';
            course_list = data.data.courses;
            courseName_set.clear();
            data.data.courses.forEach(course => {
                generateTable(course.classes, course.course_name, course.course_id);   //绘制表格
                courseName_set.add(course.course_name);
            });
        }
        else{
            alert(`服务器错误：${data.msg}`)
        }
    })
    .catch(error => {
        alert(`There was a problem with the fetch operation: ${error}`);
    });

// 生成表格的函数
function generateTable(tasks, title, tableId) {
    // 获取 table-container 元素
    const container = document.querySelector('.table-container');

    // 创建包含标题和表格的 div 元素
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.id = tableId;

    // 创建标题元素
    const h2 = document.createElement('h2');
    h2.textContent = title;
    tableWrapper.appendChild(h2);

    // 创建包含按钮的 div 元素
    const titleButton = document.createElement('div');
    titleButton.className = 'title-button';

    //创建编辑和删除按钮
    const editButton = document.createElement('button');
    //editButton.textContent = '编辑课程';
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = 'edit-button';
    editButton.setAttribute('title', '编辑课程');
    editButton.id = tableId;  //把按钮id设置成课程id
    editButton.onclick = function(){showEditCourseModal(title);}
    titleButton.appendChild(editButton);

    const deleteButton = document.createElement('button');
    //deleteButton.textContent = '删除课程';
    deleteButton.id = tableId;  //把按钮id设置成课程id
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.className = 'trash-button';
    deleteButton.setAttribute('title', '删除课程');
    deleteButton.onclick = function(){confirmDeleteCourse(tableId, title);}
    titleButton.appendChild(deleteButton);

    tableWrapper.appendChild(titleButton);

    if(tasks.length!=0) {   //如果有班级
        // 创建表格元素
        const table = document.createElement('table');
        table.id = tableId;    //把表格的id设置为tableId
        tableWrapper.appendChild(table);

        // 创建表头
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const headers = ['班级名称', ''];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        // 创建表体
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // 遍历任务数组并创建表格行
        for (const task of tasks) {
            const tr = document.createElement('tr');
            tr.id = task.id;    //把行的id设置为task.id
            tr.className = "class-tr";
            tr.onclick = function(event){
                console.log(event.target.className);
                if(event.target.className !== "fas fa-trash"){
                    console.log(tr.id);
                    window.location.href = '/class?class_id='+tr.id;
                }
            }

            // 创建任务名称单元格
            const nameCell = document.createElement('td');
            nameCell.textContent = task.name;
            tr.appendChild(nameCell);

            // 创建操作单元格
            const actionCell = document.createElement('td');
            const button = document.createElement('button');
            //button.textContent = '删除班级';
            button.innerHTML = '<i class="fas fa-trash"></i>';
            button.className = 'trash-button';
            button.setAttribute('title', '删除班级');
            button.id = task.id;  //把按钮id设置成班级id
            button.onclick = function(){confirmDeleteClass(task.id, task.name);}
            actionCell.appendChild(button);
            tr.appendChild(actionCell);

            // 将行添加到 tbody
            tbody.appendChild(tr);
        }
    }
    else {  //如果没有班级
        const createClass = document.createElement('button');
        createClass.innerHTML = '<i class="fas fa-plus"></i> 创建班级';
        createClass.onclick = function(){openCreateClassModal();}
        tableWrapper.appendChild(createClass);
    }

    // 将包含标题和表格的 div 元素添加到 container
    container.appendChild(tableWrapper);
}

function deleteCourse(id) {  //删除课程
    console.log('删除课程:', id);

    var data = {
        get_course: {isRequest: false},
        delete_class: {isRequest: false},
        delete_course: {isRequest: true, course_id: id},
        edit_course: {isRequest: false},
        create_course: {isRequest: false},
        create_class:{isRequest: false},
        group_post: {isRequest: false}
    };

    var url = "/course";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                // 删除成功后，更新页面上的课程列表
                var elements = document.getElementsByClassName('table-wrapper');
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].id == id) {
                        elements[i].remove(); // 删除匹配的元素
                        break;
                    }
                }
                //更新课程班级列表
                for(var i=0; i< course_list.length; i++) {
                    if (course_list[i].course_id == id) {
                        course_list.splice(i,1);
                        //更新课程名称集合
                        courseName_set.delete(course_list[i].course_name);
                        break;
                    }
                }
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}

function deleteClass(id) {  //删除班级
    console.log('删除班级:', id);
    var data = {
        get_course: {isRequest: false},
        delete_class: {isRequest: true, class_id: id},
        delete_course: {isRequest: false},
        edit_course: {isRequest: false},
        create_course: {isRequest: false},
        create_class:{isRequest: false},
        group_post: {isRequest: false}
    };

    var url = "/course";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                // 删除成功后，更新页面上的班级列表
                var elements = document.getElementsByClassName('class-tr');
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].id == id) {
                        elements[i].remove(); // 删除匹配的元素
                        break;
                    }
                }
                //更新课程班级列表数组
                for(var i=0; i< course_list.length; i++) {
                    for(var j=0; j< course_list[i].classes.length; j++) {
                        if(course_list[i].classes[j].id==id){
                            course_list[i].classes.splice(j,1);
                            break;
                        }
                    }
                }
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}

function editCourse(id, newName) {  //编辑课程
    console.log('编辑课程:', id, newName);
    var data = {
        get_course: {isRequest: false},
        delete_class: {isRequest: false},
        delete_course: {isRequest: false},
        edit_course: {isRequest: true, course_id: id, course_name: newName},
        create_course: {isRequest: false},
        create_class:{isRequest: false},
        group_post: {isRequest: false}
    };

    var url = "/course";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                var elements = document.getElementsByClassName('table-wrapper');
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].id == id) {
                        var h2Element = elements[i].querySelector('h2');  //获取h2元素
                        console.log(h2Element);
                        h2Element.innerText = newName;
                        break;
                    }
                }
                for(var i=0; i< course_list.length; i++) {
                    if (course_list[i].course_id == id) {
                        course_list[i].course_name = newName; // 修改课程名
                        courseName_set.delete(course_list[i].course_name);
                        courseName_set.add(newName);
                        break;
                    }
                }
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}

// 保存课程名称
saveCourseName.onclick = function() {
    const newName = courseNameInput.value;
    if (newName) {
        const courseId = document.querySelector('.title-button button:first-child').id;
        editCourse(parseInt(courseId), newName);
        hideEditCourseModal();
    } else {
        alert('请输入新的课程名称');
    }
};

//创建课程弹窗
const createCourseModalButton = document.getElementById('createCourseModalButton');
const createCourseModal = document.getElementById('createCourseModal');
const closeCreateCourseModal = createCourseModal.getElementsByClassName('close')[0];
const createCourseButton = document.getElementById('createCourse');

createCourseModalButton.onclick = function() {
    createCourseModal.style.display = 'block';
}
closeCreateCourseModal.onclick = function() {
    createCourseModal.style.display = 'none';
}
createCourseButton.onclick = function() {
    const courseName = document.getElementById('course-name').value;

    if(courseName_set.has(courseName)){   //如果课程重名
        let formContainer = document.getElementById('createCourse-container');
        // 创建一个新的错误信息标签
        let errorLabel = document.createElement('label');
        errorLabel.textContent = "该课程已存在";
        errorLabel.style.color = 'red';
        errorLabel.style.marginTop = '10px';
        // 插入错误信息标签到输入框下方
        let courseNameInput = document.getElementById('course-name');
        formContainer.insertBefore(errorLabel, courseNameInput.nextSibling);
        courseNameInput.style.borderColor = 'red';
    }
    else{
        createCourse();
        createCourseModal.style.display = 'none';
    }
}

function createCourse() {
    const courseName = document.getElementById('course-name').value;
    //alert(`您创建的课程名称是：${courseName}`);
    // 定义请求体
    var data = {
        get_course: {isRequest: false},
        delete_class: {isRequest: false},
        delete_course: {isRequest: false},
        edit_course: {isRequest: false},
        create_course: {isRequest: true, course_name: courseName},
        create_class:{isRequest: false},
        group_post: {isRequest: false}
    };

    var url = "/course";

    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                //将新课程添加到页面上
                var course_id = data.data.course_id;
                var classes = [];
                var new_course = {
                    course_id: course_id,
                    course_name: courseName,
                    classes: []
                }
                generateTable(classes, courseName, course_id);
                course_list.push(new_course);  //插入新元素
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}


//创建班级弹窗
const createClassModalButton = document.getElementById('createClassModalButton');
const createClassModal = document.getElementById('createClassModal');
const closeCreateClassModalButton = createClassModal.getElementsByClassName('close')[0];
const createClassButton = document.getElementById('confirm');

createClassModalButton.onclick = function() {
    openCreateClassModal()
}
closeCreateClassModalButton.onclick = function() {
    closeCreateClassModal();
}
createClassButton.onclick = function() {
    confirmClasses();
    closeCreateClassModal();
}

function openCreateClassModal()
{
    const courseSelect = document.getElementById('course');
    course_list.forEach(course => {
        const option = document.createElement('option');
        option.value = course.course_id;
        option.textContent = course.course_name;
        option.className = "class-option";
        courseSelect.appendChild(option);
    });
    createClassModal.style.display = 'block';
}

function closeCreateClassModal()
{
    var options = document.getElementsByClassName('class-option');
    console.log(options);
    for(var j = options.length-1; j>=0; j--){
        options[j].remove();
    }

    var elements = document.getElementsByClassName('form-group');
    for(var i = elements.length-1; i>=2; i--){
        elements[i].remove();
    }

    var input_elements = document.getElementById('className');
    input_elements.value = '';

    createClassModal.style.display = 'none';
}

// 添加新班级输入框
function addNewClassInput() {
    const container = document.getElementById('class-form-container');
    const newFormGroup = document.createElement('div');
    newFormGroup.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', 'className');
    label.textContent = '班级名称';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'className';
    input.placeholder = '输入班级名称';

    newFormGroup.appendChild(label);
    newFormGroup.appendChild(input);

    container.insertBefore(newFormGroup, container.lastElementChild);
}

// 确定按钮点击事件
function confirmClasses() {
    // 获取所有班级名称
    const courseSelect = document.getElementById('course');
    const classInputs = document.querySelectorAll('.form-group input');
    const classNames = Array.from(classInputs).map(input => input.value);
    var course_id = parseInt(courseSelect.value);
    classNames.forEach(classItem => {
        if(classItem!='')  //如果不为空
            postClass(course_id, classItem)
    })
}

function postClass(course_id, classItem)
{
    var url = "/course";
    var bodydata = {
        get_course: {isRequest: false},
        delete_class: {isRequest: false},
        delete_course: {isRequest: false},
        edit_course: {isRequest: false},
        create_course: {isRequest: false},
        create_class:{isRequest: true, course_id: course_id, class_name: classItem},
        group_post: {isRequest: false}
    }

    console.log(bodydata);
    // 发送请求到后端
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodydata)
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                console.log(data)
                console.log(course_id)
                var elements = document.getElementsByClassName('table-wrapper');
                Array.from(elements).forEach(element=>{element.remove();})

                for(var i=0; i< course_list.length; i++) {
                    if (course_list[i].course_id == course_id) {
                        course_list[i].classes.push({name:classItem, id:data.data.id}); //将新的班级添加到原来的数组
                        break;
                    }
                }
                course_list.forEach(course=> {
                    generateTable(course.classes, course.course_name, course.course_id)
                })
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert(`There was a problem with the fetch operation: ${error}`);
        });
}

/*---------群发公告-----------*/
let selectedClasses = [];
const groupPostModalButton = document.getElementById('groupPostModalButton');
const groupPostModal = document.getElementById('groupPostModal');
const closegroupPostModalButton = groupPostModal.getElementsByClassName('close')[0];
const groupPostButton = document.getElementById('confirm-post');
const chooseClassModal = document.getElementById('choose-class-modal');

groupPostModalButton.onclick = function() {
    openGroupPostModal();
}
closegroupPostModalButton.onclick = function() {
    closeGroupPostModal();
}
groupPostButton.onclick = function() {
    groupPost();
}

function openGroupPostModal(){
    groupPostModal.style.display = 'block';
    generateCourseList();
    restoreSelectedClasses();
}

function closeGroupPostModal(){
    groupPostModal.style.display = 'none';
    // 清空表单
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('attachment').value = '';
    document.getElementById('selected-classes').innerText = '';
    document.getElementById('selected-class-list').innerText = '';
    selectedClasses = [];
}

function openChooseClassModal(){
    chooseClassModal.style.display = 'block';
}

function closeChooseClassModal(){
    chooseClassModal.style.display = 'none';
}


function generateCourseList() {    //生成班级列表
    //清空班级列表
    let courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    //生成新的班级列表
    course_list.forEach(course => {

        let courseLi = document.createElement('li');
        courseLi.className = 'course';
        courseLi.innerText = course.course_name;
        courseLi.onclick = () => toggleCourse(courseLi);
        courseList.appendChild(courseLi);

        let classList = document.createElement('ul');
        classList.style.display = 'none'; // 默认折叠
        course.classes.forEach(cls => {
            let classLi = document.createElement('li');
            classLi.className = 'class';
            classLi.innerText = cls.name;
            classLi.setAttribute('data-id', cls.id); // 添加班级ID作为唯一标识
            classLi.setAttribute('data-course', course.course_name); // 添加课程名称
            classLi.onclick = () => toggleClass(classLi);
            classList.appendChild(classLi);
        });
        courseList.appendChild(classList);
    });
}

function toggleCourse(course) {   //折叠&展开课程
    course.classList.toggle('open');
    let classes = course.nextElementSibling;
    while (classes && !classes.classList.contains('course')) {
        classes.style.display = course.classList.contains('open') ? 'block' : 'none';
        classes = classes.nextElementSibling;
    }
}

function toggleClass(cls) {
    let classId = cls.getAttribute('data-id');
    if (cls.classList.contains('selected')) {
        cls.classList.remove('selected');
        selectedClasses = selectedClasses.filter(id => id !== classId);
    } else {
        cls.classList.add('selected');
        selectedClasses.push(parseInt(classId));
    }
    updateSelectedClasses();
}

function updateSelectedClasses() {
    let selectedClassList = document.getElementById('selected-class-list');
    selectedClassList.innerHTML = '';
    selectedClasses.forEach(classId => {
        let classLi = document.querySelector(`.class[data-id="${classId}"]`);
        if (classLi) {
            let courseName = classLi.getAttribute('data-course');
            let className = classLi.innerText;
            let li = document.createElement('li');
            li.innerText = `${courseName}-${className}`;
            selectedClassList.appendChild(li);
        }
    });
}

function restoreSelectedClasses() {
    let classList = document.querySelectorAll('.class');
    classList.forEach(cls => {
        if (selectedClasses.includes(cls.getAttribute('data-id'))) {
            cls.classList.add('selected');
        } else {
            cls.classList.remove('selected');
        }
    });
}

function confirmSelection() {
    let selectedClassNames = selectedClasses.map(classId => {
        let classLi = document.querySelector(`.class[data-id="${classId}"]`);
        if (classLi) {
            let courseName = classLi.getAttribute('data-course');
            let className = classLi.innerText;
            return `${courseName}-${className}`;
        }
        return '';
    });
    document.getElementById('selected-classes').innerText = selectedClassNames.join(', ');
    closeChooseClassModal();
}

function groupPost() {
    // 获取表单数据
    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let attachment = document.getElementById('attachment').files;
    let file_number = attachment.length;

    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Attachment:', attachment);
    console.log('Selected Classes:', selectedClasses);

    var data = {
        get_course: {isRequest: false},
        delete_class: {isRequest: false},
        delete_course: {isRequest: false},
        edit_course: {isRequest: false},
        create_course: {isRequest: false},
        create_class:{isRequest: false},
        group_post: {isRequest: true, title: title, content: content, classes_id: selectedClasses, file_number: file_number},   //附件数量
    };

    console.log(data);

    var url = "/course";
    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json" // 设置请求头
        },
        body: JSON.stringify(data) // 将数据转换为 JSON 字符串并作为请求体发送
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                console.log("公告发送成功",data.data.announcement_id);
                postAttachment(attachment, data.data.announcement_id);   //调用函数发送附件
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            alert("There was a problem with the fetch operation:"+ error);
        });

}

function postAttachment(attachment, id)
{
    console.log("发公告")
    console.log(attachment)
    var formData = new FormData();
    for(var i=0; i<attachment.length; i++){
        var file = attachment[i];
        const newFileName = `Announcement_${id}_${i + 1}_${file.name}`;
        console.log(newFileName);
        formData.append('file', file, newFileName);
    }

    var url = "/file";
    // 发送 POST 请求
    fetch(url, {
        method: "POST", // 指定请求方法为 POST
        body: formData
    })
        .then(response => {
            if (response.status === 200) { // 200 表示请求成功
                return response.json(); // 解析响应为 JSON
            } else if (response.status === 404) { // 404 表示资源未找到
                throw new Error("Resource not found");
            } else {
                throw new Error("Request failed with status: " + response.status);
            }
        })
        .then(data => {
            if(data.code === 0){
                console.log("文件发送成功");
                closeGroupPostModal();  //此时再关闭窗口
            }
            else{
                alert(`服务器错误：${data.msg}`)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}