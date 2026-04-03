DROP DATABASE IF EXISTS drelo_dev;
CREATE DATABASE drelo_dev;
USE drelo_dev;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lists(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    position INT NOT NULL DEFAULT 0,

    label VARCHAR(255) NOT NULL,
    color VARCHAR(255) DEFAULT 'black',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cards(
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    position INT NOT NULL DEFAULT 0,
    
    due_date TIMESTAMP ,
    label VARCHAR(255) NOT NULL,
    status ENUM('pending', 'finished') NOT NULL DEFAULT 'pending',
    color VARCHAR(255),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (list_id) REFERENCES lists(id)
);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
    color VARCHAR(255) NOT NULL,
    label VARCHAR(255),
    is_default BOOLEAN NOT NULL DEFAULT false,
 
    FOREIGN KEY (user_id) REFERENCES users(id)    
);

INSERT INTO tags (color, is_default) VALUES
('red', true),
('blue', true),
('yellow', true),
('violet', true),
('orange', true),
('green', true);

DROP TABLE IF EXISTS card_tags;
CREATE TABLE card_tags(
	id INT AUTO_INCREMENT PRIMARY KEY,
    tag_id INT NOT NULL,
    card_id INT NOT NULL,
    
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    FOREIGN KEY (card_id) REFERENCES cards(id)
);




/*
CREATE TABLE list_cards(
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT,
    card_id INT

    FOREIGN KEY (list_id) REFERENCES lists(id) ,
    FOREIGN KEY (card_id) REFERENCES cards(id)
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/