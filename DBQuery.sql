show databases;
use u2301415;

drop table u2301415.users;

create table u2301415.users (
    `numberId` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` CHAR(32) NOT NULL,
    `nickname` VARCHAR(20) NOT NULL,
    `email` VARCHAR(64) NOT NULL,
    `registeredOn` DATETIME NOT NULL,
    PRIMARY KEY (`numberId`),
    CONSTRAINT uc_personal_info UNIQUE (email)
);

insert u2301415.users (`username`, `password`, `nickname`, `email`, `registeredOn`)
	values ('user03', md5('password1234'), '서정훈', 'email@dnicknameuc_personal_infoomain.com', now());
    
desc u2301415.users;