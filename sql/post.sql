
select IF(count(c_u.comment_id) = 0 , 0, 1) from comment_users as c_u where c_u.comment_id = 2 and c_u.user_id = 1;
update comments set likes = likes + 1 where id = 2;
update comments set likes = likes - 1 where id = 2;
update comments set likes = 0 where id = 2;


select comments.id,comments.likes from comments where comments.id = 2;
select * from comment_users where comment_users.comment_id = 2;

select * from post_users;

update comments set likes = (select count(*) from comment_users where comment_id = 2) where id = 2 ;
delete from comment_users where user_id = 1;
update comments set likes = (select count(comment_id) from comment_users where comment_id = 2) where id = 2;

select * from comments where post_id = 1;

delete from posts where title = '55';