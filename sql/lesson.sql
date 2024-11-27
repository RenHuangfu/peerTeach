
insert into lessons (id,created,name,class_id)
values (1,current_time,'777',1),(2,current_time,'888',1),(3,current_time,'666',2);

insert into lessons (id, created, name, school_time, exam_id, ppt_name, class_id)
    values (1,current_time,'111',current_time,1,'111',1);

insert into answer_records (id, created, correct_num, option_num, lesson_id)
    values (1,current_time,1,'1|1',1),
           (2,current_time,2,'2|0',1);

select * from lessons;
select * from classes;
select * from exam_questions;
select * from questions;

select count(class_users.user_id) as lesson_member_num
 from (select lessons.class_id as class_id from lessons where lessons.id = 1) as lci
     join class_users on class_users.class_id = lci.class_id;

select ar.correct_num, ar.option_num
from answer_records as ar where ar.lesson_id = 1;

delete from lessons where id <100;

