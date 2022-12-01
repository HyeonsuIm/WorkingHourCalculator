CREATE DATABASE `WORKING_HOUR_DB`;
USE `WORKING_HOUR_DB`;

CREATE TABLE `USER`(
    `member_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` varchar(256) NOT NULL,
    `user_passwd` varchar(256) NOT NULL 
); 