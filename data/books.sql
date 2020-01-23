DROP TABLE IF EXISTS books;
CREATE TABLE i (

id SERIAL PRIMARY KEY,
author VARCHAR(255),
title VARCHAR(255),
isbn VARCHAR(255),
image_url VARCHAR(255),
description TEXT
-- bookshelf 
);

-- INSERT INTO books (author, title, description)
-- VALUES('picard', 'enterprise', 'this is startrek')