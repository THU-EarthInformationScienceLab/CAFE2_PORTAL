
# ts_frontuser
```sql

CREATE TABLE `ts_frontuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `pwd` varchar(50) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `regtime` int(11) NOT NULL DEFAULT '0',
  `logintime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8


```

# ts_task

```sql
CREATE TABLE `ts_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` varchar(50) NOT NULL DEFAULT '0',
  `task_params` text,
  `task_result` text,
  `create_time` int(11) NOT NULL DEFAULT '0',
  `finish_time` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0:submit, 1:processing, 2:finished, -1:error',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8

```

# ts_user_task

```sql
CREATE TABLE `ts_user_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `task_id` varchar(50) NOT NULL,
  `create_time` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `ncl_name` varchar(50) NOT NULL,
  `params` text,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0:submit, 1:processing, 2:finished, -1:error',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8

```
