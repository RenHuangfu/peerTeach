
insert into exams (id, created, updated, name, user_id)
    values (1,current_time,current_time,'111',1),
           (2,current_time,current_time,'222',1),
           (3,current_time,current_time,'333',1);

insert into questions
(id, created, updated, name, subject, section, course, type, is_public, options, user_id)
VALUES (1,current_time,current_time,'111','111','111','111','option',true,
        '{"Options":[{"text":"111","isCorrect":true},{"text":"222","isCorrect":false}]}',1),
       (2,current_time,current_time,'222','222','222','222','option',true,
        '{"Options":[{"text":"222","isCorrect":true},{"text":"999","isCorrect":false}]}',1);

insert into exam_questions (exam_id, question_id) VALUES (1,1),(1,2),(1,3),(1,4);
delete from exams where id<100;

select q.id as question_id,q.created as time,q.name as title,q.options as options
    from questions as q where q.id in
    (select q.question_id from exam_questions as q join exams as e on q.exam_id = e.id and e.id = 4);

select q.question_id from exam_questions as q join exams as e on q.exam_id = e.id and e.id = 4;

select * from exam_questions;

delete from users where id = 1;

update questions set is_public = 0 where id = 1;


delete from questions where id < 100;

select * from questions;
select * from exams;

delete from lessons where id >10;
select * from answer_records;

select * from lessons where id = 95;


select count(class_users.user_id) as lesson_member_num
from (select lessons.class_id as class_id from lessons where lessons.id = 95) as lci
    join class_users on class_users.class_id = lci.class_id;

select ar.correct_num, ar.option_num from answer_records as ar where ar.lesson_id = 95;


select p.id as paper_id, p.name as title, p.updated as time
    from exams as p where p.user_id = 1;

select q.id as question_id, q.name as title, q.updated as time
from questions as q where q.user_id = 1
    and subject like '%' and course like '%' and section like '%' ;

select q.id as question_id, q.name as title, q.updated as time
from questions as q where q.is_public is true
    and subject like '%' and course like '%' and section like '%' ;

insert into managers (id, created, updated, password, name) VALUES
        (1,current_time,current_time,'000','000');

insert into notifications (id, created, updated, content, manager_id) VALUES
    (1,current_time,current_time,'555',1);

insert into notifications (id, created, updated, content, manager_id) VALUES
    (2,current_time,current_time,'yyyy',1),
    (3,current_time,current_time,'yysy',1);

insert into notification_users(notification_id, user_id, created_at)
    values (1,1,current_time),(1,2,current_time);

insert into notification_users(notification_id, user_id, created_at)
values (2,1,current_time),(3,1,current_time);

select * from notifications;
select * from notification_users;

select n.content,n.created from notifications as n
    join notification_users as n_u on n_u.notification_id = n.id
		and n_u.user_id = 1;

select *from questions ;

delete from questions where id <=7 and id >=3;

select * from exam_questions;

delete from exams where name  = '';

INSERT INTO questions (created, updated, name, subject, section, course, type, is_public, options, user_id) VALUES
(NOW(3), NOW(3), '软件生命周期的阶段有哪些？', '软件工程', '软件生命周期', '软件工程基础', NULL, RAND() > 0.5, '{"Options":[{"text":"需求分析","isCorrect":false},{"text":"设计","isCorrect":false},{"text":"编码","isCorrect":false},{"text":"测试","isCorrect":true}]}', 1),
(NOW(3), NOW(3), '敏捷开发的核心原则是什么？', '软件工程', '敏捷开发', '软件开发方法', NULL, RAND() > 0.5, '{"Options":[{"text":"客户合作","isCorrect":true},{"text":"文档优先","isCorrect":false},{"text":"计划驱动","isCorrect":false},{"text":"固定时间表","isCorrect":false}]}', 1),
(NOW(3), NOW(3), 'HTTP协议的默认端口是多少？', '计算机网络', 'HTTP协议', '网络协议', NULL, RAND() > 0.5, '{"Options":[{"text":"80","isCorrect":true},{"text":"443","isCorrect":false},{"text":"21","isCorrect":false},{"text":"22","isCorrect":false}]}', 1),
(NOW(3), NOW(3), '二叉树的遍历方式有哪些？', '数据结构', '二叉树', '树与图', NULL, RAND() > 0.5, '{"Options":[{"text":"前序遍历","isCorrect":true},{"text":"中序遍历","isCorrect":true},{"text":"后序遍历","isCorrect":true},{"text":"层次遍历","isCorrect":true}]}', 1),
(NOW(3), NOW(3), '冯·诺依曼结构的主要组成部分有哪些？', '计算机组成原理', '冯·诺依曼结构', '计算机系统结构', NULL, RAND() > 0.5, '{"Options":[{"text":"控制器","isCorrect":true},{"text":"运算器","isCorrect":true},{"text":"存储器","isCorrect":true},{"text":"输入输出设备","isCorrect":true}]}', 1),
(NOW(3), NOW(3), '瀑布模型的主要缺点是什么？', '软件工程', '瀑布模型', '软件开发方法', NULL, RAND() > 0.5, '{"Options":[{"text":"需求变更困难","isCorrect":true},{"text":"迭代周期长","isCorrect":true},{"text":"客户参与度低","isCorrect":true},{"text":"测试滞后","isCorrect":true}]}', 1),
(NOW(3), NOW(3), 'TCP/IP协议栈包括哪些层次？', '计算机网络', 'TCP/IP协议', '网络基础', NULL, RAND() > 0.5, '{"Options":[{"text":"应用层","isCorrect":true},{"text":"传输层","isCorrect":true},{"text":"网络层","isCorrect":true},{"text":"数据链路层","isCorrect":true}]}', 1),
(NOW(3), NOW(3), '堆排序的时间复杂度是多少？', '数据结构', '堆', '树与图', NULL, RAND() > 0.5, '{"Options":[{"text":"O(n)","isCorrect":false},{"text":"O(n log n)","isCorrect":true},{"text":"O(n^2)","isCorrect":false},{"text":"O(log n)","isCorrect":false}]}', 1),
(NOW(3), NOW(3), 'CPU的主要功能是什么？', '计算机组成原理', 'CPU结构', '处理器', NULL, RAND() > 0.5, '{"Options":[{"text":"执行指令","isCorrect":true},{"text":"存储数据","isCorrect":false},{"text":"控制外设","isCorrect":false},{"text":"管理内存","isCorrect":false}]}', 1),
(NOW(3), NOW(3), 'DNS协议的主要功能是什么？', '计算机网络', 'DNS协议', '网络协议', NULL, RAND() > 0.5, '{"Options":[{"text":"域名解析","isCorrect":true},{"text":"文件传输","isCorrect":false},{"text":"邮件传输","isCorrect":false},{"text":"网页浏览","isCorrect":false}]}', 1);
