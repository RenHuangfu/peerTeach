insert into users (id,password,name,email,identity)
    values(1,'000','000','000@qq.com','teacher'),
          (2,'000','111','111@qq.com','teacher'),
          (3,'000','222','222@qq.com','student'),
          (4,'000','333','333@qq.com','student'),
          (5,'000','444','444@qq.com','student'),
          (6,'000','555','555@qq.com','student');

insert into courses (id,created,updated,name,user_id)
    values (1,current_time,current_time,'os',1),
           (2,current_time,current_time,'cs',1),
           (3,current_time,current_time,'cs',2);

insert into classes (id,name,course_id)
    values (1,'class_1',1),(2,'class_2',1),(3,'class_3',1),
           (4,'class_1',2),(5,'class_2',2),(6,'class_3',3);

insert into class_rooms (id,created,name,class_id)
    values (1,current_time,'777',1),(2,current_time,'888',1),(3,current_time,'666',2);

INSERT INTO `class_users` (`class_id`,`user_id`,`created_at`)
    VALUES (3,3,'2024-11-13 19:19:19.805'),(1,3,current_time),(1,4,current_time);;



insert into announcements (id,created,title,user_id,file_num)
    values (1,current_time,'111111111',1,0),(2,current_time,'title',1,0);

insert into announcement_classes (announcement_id, class_id)
    values (1,1),(1,2),(2,1);


insert into posts(id, created, title,content, likes, comment, user_id, class_id)
    values (1,current_time,'hhh','哈哈哈哈哈哈哈',12,3,3,1),(2,current_time,'55','555555555555',12,3,3,1);

insert into comments(id, created, updated, content, likes, post_id, user_id)
    values (1,current_time,current_time,'hhhhhh',3,1,3),(2,current_time,current_time,'55555555',6,1,1);

insert into post_users (post_id, user_id) values (1,3),(1,1);
insert into comment_users (comment_id, user_id) values (1,3),(1,1);

select IF(count(p_u.post_id) = 0 , 0, 1) from post_users as p_u where p_u.post_id = 1 and p_u.user_id = 3;

update posts set comment = content + 1 where id = 1;

select * from users;
select * from courses;
select * from classes;
select * from class_users;
select * from class_rooms;
select * from announcements;
select * from announcement_classes;
select * from posts;
select * from post_users;
select * from comment_users;

select IF(count(c_u.comment_id) = 0 , 0, 1) from comment_users as c_u where c_u.comment_id = 2 and c_u.user_id = 1;
update comments set likes = likes + 1 where id = 2;
update comments set likes = likes - 1 where id = 2;
update comments set likes = 0 where id = 2;
select comments.id,comments.likes from comments where comments.id = 2;
select * from comment_users where comment_users.comment_id = 2;
delete from comment_users where user_id = 1;
update comments set likes = (select count(comment_id) from comment_users where comment_id = 2) where id = 2;

delete from users where id<100;
# delete from courses where id<100;
# delete from classes where id<100;
delete from class_users where user_id=3 and class_id=3;
delete from announcements where id<100;

select cl.id as class_id,cl.name as class_name,cr.id as course_id,
       cr.name as course_name,t.name as teacher_name
from classes as cl,courses as cr,users as t,users as s,class_users as cu
where cu.user_id = s.id and cu.class_id = cl.id and cl.course_id =cr.id
    and cr.user_id = t.id and s.id = 3;

show create table class_users;

select a.id as id,a.created as time,a.title as title,u.name as teacher_name
from announcements as a,users as u,announcement_classes as ac,classes as c,courses as cr
where ac.class_id = c.id and ac.announcement_id = a.id and cr.user_id = u.id
    and c.course_id = cr.id and c.id = 1;

select p.post_id,p.create_time,p.post_title,p.post_likes
     ,p.post_comment,p.user_id,p.user_name, IF(p1.user_id is null ,false,true) as is_like
from (
    select p.id as post_id,p.created as create_time,p.title as post_title,p.likes as post_likes,
           p.comment as post_comment,p.user_id as user_id,u.name as user_name
        from posts as p,users as u
    where p.user_id = u.id and p.class_id = 1
) as p left join post_users as p1 on p.post_id = p1.post_id and p1.user_id = 3;

select p.post_id,p.create_time,p.post_title,p.post_likes
     ,p.post_comment,p.post_content,p.photo_num,p.user_id
      ,p.user_name, IF(p_u.user_id is null ,false,true) as is_like
    ,IF(p.user_id = 1,true,false) as isself
from (
     select p.id as post_id,p.created as create_time,p.title as post_title
            ,p.likes as post_likes,p.comment as post_comment,p.content as post_content
          ,p.photo_num as photo_num,p.user_id as user_id,u.name as user_name
     from posts as p,users as u
     where p.user_id = u.id and p.id = 1
 ) as p left join (
     select p_u.user_id,p_u.post_id
        from post_users as p_u
        where p_u.user_id = 1
)as p_u on p.post_id = p_u.post_id;

select c.comment_id,c.create_time,c.comment_content,c.comment_likes
    ,c.user_id,c.user_name,IF(c_u.user_id is null ,false,true) as is_like
    ,IF(c.user_id = 1,true,false) as is_self
from (select c.id as comment_id,c.created as create_time,c.content as comment_content
       ,c.likes as comment_likes,c.user_id as user_id,
        u.name as user_name
from comments as c, users as u
where c.user_id = u.id and c.post_id = 1
)as c left join (
    select c.comment_id,c.user_id
    from comment_users as c
    where c.user_id = 1
) as c_u
on c.comment_id = c_u.comment_id;

select c.id as comment_id,c.created as create_time,c.content as comment_content
        ,c.likes as comment_likes,c.user_id as user_id,
       u.name as user_name
from comments as c, users as u
where c.user_id = u.id and c.post_id = 1;

select * from posts where class_id = 1;

update users set password = '000',email = '000@qq.com',identity = 'teacher' where id = 1;

select * from users;

