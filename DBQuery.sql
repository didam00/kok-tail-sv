use u2301415;

-- drop table u2301415.userIngrdnts;
-- drop table u2301415.users;

create table u2301415.users (
    `userId` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(32) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `nickname` VARCHAR(20) NOT NULL,
    `email` VARCHAR(64) NOT NULL,
    `registeredOn` DATETIME NOT NULL,
    `userAuthToken` VARCHAR(256),
    PRIMARY KEY (`userId`, `username`),
    CONSTRAINT uc_personal_info UNIQUE (email)
);

create table u2301415.userIngrdnts (
	`id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(20),
    `keyname` VARCHAR(255),
    `volume` INT
);

-- create table u2301415.userIngrdntVolumes (
-- 	`userId` INT,
--     `ingrdntId` INT,
--     `volume` INT,
--     primary key (`userId`, `ingrdntId`),
--     foreign key (`userId`) references u2301415.users(`userId`),
--     foreign key (`ingrdntId`) references u2301415.ingredients(`id`)
-- );