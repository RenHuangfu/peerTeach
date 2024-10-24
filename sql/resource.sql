
insert into exams (id, created, updated, name, user_id)
    values (1,current_time,current_time,'111',1),
           (2,current_time,current_time,'222',1),
           (3,current_time,current_time,'333',1);

insert into questions
(id, created, updated, name, subject, section, course, type, is_public, options, user_id)
VALUES (1,current_time,current_time,'111','111','111','111','option',1,
        '{"Options":[{"text":"111","isCorrect":true},{"text":"222","isCorrect":false}]}',1),
       (2,current_time,current_time,'222','222','222','222','option',1,
        '{"Options":[{"text":"222","isCorrect":true},{"text":"999","isCorrect":false}]}',1);

insert into exam_questions (exam_id, question_id) VALUES (1,1),(2,1),(1,2);

select q.id as question_id,q.created as time,q.name as title,q.options as options
    from questions as q where q.id in
    (select q.id from exam_questions as q join exams as e on q.exam_id = e.id and e.id = 1);

delete from users where id = 1;

update questions set is_public = 0 where id = 1;


delete from questions where id =1;

select * from questions;




select p.id as paper_id, p.name as title, p.updated as time
    from exams as p where p.user_id = 1;

select q.id as question_id, q.name as title, q.updated as time
from questions as q where q.user_id = 1
    and subject like '%' and course like '%' and section like '%' ;

select q.id as question_id, q.name as title, q.updated as time
from questions as q where q.is_public is true
    and subject like '%' and course like '%' and section like '%' ;