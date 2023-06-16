create table if not exists user_t (
    id BIGINT AUTO_INCREMENT,
    username varchar(50) unique,
    password varchar(50),
    email varchar(50) unique,
    group_ids TEXT,
    connections TEXT,
    last_online date,
    status int,
    PRIMARY KEY (id)
)