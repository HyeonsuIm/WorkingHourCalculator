CREATE DATABASE `WORKING_HOUR_DB`;
USE `WORKING_HOUR_DB`;

CREATE TABLE `USER`(
    `MEMBER_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `USER_ID` varchar(256) NOT NULL,
    `USER_PASSWD` varchar(256) NOT NULL 
);

CREATE TABLE `USER_WORKING`(
    `MEMBER_ID` INT NOT NULL,
    `YEAR` INT NOT NULL,
    `MONTH` INT NOT NULL,
    `MONTH_WORK_TYPES_MINUTES` JSON,
    FOREIGN KEY (`MEMBER_ID`) REFERENCES `USER` (`MEMBER_ID`),
    PRIMARY KEY (MEMBER_ID, YEAR, MONTH)
);

CREATE TABLE `LOGS`(
    `LOG_TIME` TIMESTAMP NOT NULL DEFAULT NOW(),
    `MEMBER_ID` INT,
    `ACCESS_IP` varchar(16) NOT NULL,
    `LOG_STR` varchar(256)
);