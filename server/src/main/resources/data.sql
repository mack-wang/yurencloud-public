-- drop table yurencloud.user;
-- drop table yurencloud.role;
-- drop table yurencloud.user_role;
-- drop table yurencloud.account;
-- drop table yurencloud.article;
-- drop table yurencloud.catalog;

create table user (
  id                       int not null auto_increment primary key,
  username                 varchar(64),
  password                 varchar(255),
  nickname                 varchar(64),
  avatar                   varchar(255) default '/img/default.png',
  last_password_reset_date datetime     default now()
);

create table role (
  id   int not null auto_increment primary key,
  name varchar(64)
);
create table user_role (
  user_id int,
  role_id int
);

create table account (
  id    int not null auto_increment primary key,
  email varchar(255),
  phone varchar(255)
);

create table catalog (
  id   int not null auto_increment primary key,
  level tinyint comment '0 菜单, 1 一级目录, 2 二级目录',
  pid int comment '上级目录id',
  gid int comment '上上级目录id',
  name  varchar(32) comment '目录名称',
  off tinyint comment '0 开启 1 关闭'
);

create table article (
  id         int not null                 auto_increment primary key,
  title      varchar(255),
  catalog_id int,
  image      varchar(255),
  content    text,
  top        tinyint comment '0 不置顶 1 置顶' default 0,
  recommend  tinyint comment '0 不推荐 1 推荐' default 0,
  view       int comment '浏览量' default 0,
  good       int comment '点赞量' default 0,
  words      int comment '文章字数' default 0,
  created_at datetime,
  updated_at datetime
);

create table user_good (
  user_id int,
  article_id int comment '被点赞的文章id',
  created_at datetime,
  updated_at datetime
);


insert into user (id, username, password, nickname)
values
  (1, 'mackwang', 'secret', '愚人云端'),
  (2, 'macksteve', 'secret', '鲍伯');


insert into role (id, name)
values
  (1, 'ROLE_ADMIN'),
  (2, 'ROLE_USER');

insert into user_role (user_id, role_id)
values
  (1, 1),
  (2, 2);

insert into account (id, email, phone)
values
  (1, '641212003@qq.com', '15757130092'),
  (2, '641212003@163.com', '15757130093');

insert into catalog (id, level, pid,gid, name, off)
values
  (1,0,0,0,'未定义',0),
  (2,0,0,0,'前端技术',0),
  (3,0,0,0,'后端技术',0),
  (4,0,0,0,'平面设计',0),
  (5,0,0,0,'其他内容',0),

  (6,1,1,0,'未定义',0),
  (7,1,2,0,'JavaScript',0),
  (8,1,3,0,'Java',0),
  (9,1,4,0,'Photoshop',0),
  (10,1,5,0,'广告',0),

  (11,2,6,1,'未定义',0),
  (12,2,7,2,'React',0),
  (13,2,8,3,'Spring Boot',0),
  (14,2,9,4,'使用技巧',0),
  (15,2,10,5,'文案',0);


insert into article (id,title, catalog_id, content, words, created_at, updated_at)
values
  (1,'文章标题', 9, '我是文章内容', 7, now(), now()),
  (2,'文章标题', 9, '我是文章内容', 7, now(), now()),
  (3,'文章标题', 9, '我是文章内容', 7, now(), now()),
  (4,'文章标题', 10, '我是文章内容', 7, now(), now()),
  (5,'文章标题', 11, '我是文章内容', 7, now(), now()),
  (6,'文章标题', 12, '我是文章内容', 7, now(), now());
