use u2301415;

drop table CustomRecipeIngrdnts;
drop table CustomRecipes;

create table u2301415.CustomRecipes (
	`id` int auto_increment primary key not null,
    `username` varchar(32) not null,
    `name` varchar(64) not null,
    `description` text not null,
    `glass` varchar(32) not null,
    `colors` varchar(23) not null
);

create table u2301415.CustomRecipeIngrdnts (
	`id` int auto_increment primary key not null,
    `keyname` varchar(64) not null,
    `recipeId` int not null,
    `volume` int unsigned not null,
    
    foreign key (`recipeId`) references CustomRecipes (`id`)
);