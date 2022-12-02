-- Create users table with user_id(uuid), firstname, lastname, role (user, admin)

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_firstname varchar(50) NOT NULL,
    user_lastname varchar(50) NOT NULL,
    user_email varchar(50) NOT NULL,
    user_password varchar(250) NOT NULL,
    user_role varchar(50) NOT NULL DEFAULT 'user'
);

-- Create a flashcard deck table with deck_id(uuid),user_id, deck_name, deck_description, course_name, attempts, last_score, accuracy
CREATE TABLE decks (
    deck_id BIGSERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(user_id),
    deck_name varchar(50) NOT NULL,
    deck_description varchar(250) NOT NULL,
    course_name varchar(50) NOT NULL,
    attempts int NOT NULL DEFAULT 0,
    last_score int NOT NULL DEFAULT 0,
    accuracy int NOT NULL DEFAULT 0
);


-- CREATE TABLE decks (
--     deck_id BIGSERIAL PRIMARY KEY DEFAULT,
--     user_id uuid NOT NULL REFERENCES users(user_id),
--     deck_name varchar(50) NOT NULL,
--     deck_description varchar(250) NOT NULL,
--     course_name varchar(50) NOT NULL,
--     attempts int NOT NULL DEFAULT 0,
--     last_score int NOT NULL DEFAULT 0,
--     accuracy int NOT NULL DEFAULT 0
-- );

-- create a flashcard table with flashcard_id(uuid), deck_id, question, answer, correct_count, incorrect_count
DROP TABLE IF EXISTS flashcards;
CREATE TABLE flashcards (
    flashcard_id BIGSERIAL PRIMARY KEY,
    deck_id BIGSERIAL NOT NULL REFERENCES decks(deck_id),
    question varchar(250) NOT NULL,
    answer varchar(250) NOT NULL,
    correct_count int NOT NULL DEFAULT 0,
    incorrect_count int NOT NULL DEFAULT 0
);


-- Creata a favourites table with favourite_id(uuid), user_id, deck_id
DROP TABLE IF EXISTS favourites;
CREATE TABLE favourites (
    favourite_id BIGSERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(user_id),
    deck_id BIGSERIAL NOT NULL REFERENCES decks(deck_id)
);


-- Insert 5 decks into the decks table with user_id = b6596693-03cc-4da0-ad54-97ff8d16fa3a
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Deck 1', 'This is deck 1', 'Course 1');
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Deck 2', 'This is deck 2', 'Course 2');
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Deck 3', 'This is deck 3', 'Course 3');
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Deck 4', 'This is deck 4', 'Course 4');
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Deck 5', 'This is deck 5', 'Course 5');


-- Insert 5 flashcards into the flashcards table with deck_id = 1
INSERT INTO flashcards (deck_id, question, answer) VALUES (1, 'What is the capital of the United States?', 'Washington D.C.');
INSERT INTO flashcards (deck_id, question, answer) VALUES (1, 'What is the capital of Canada?', 'Ottawa');
INSERT INTO flashcards (deck_id, question, answer) VALUES (1, 'What is the capital of Mexico?', 'Mexico City');
INSERT INTO flashcards (deck_id, question, answer) VALUES (1, 'What is the capital of Brazil?', 'Brasilia');
INSERT INTO flashcards (deck_id, question, answer) VALUES (1, 'What is the capital of Argentina?', 'Buenos Aires');


-- Create an admin user
INSERT INTO users (user_firstname, user_lastname, user_email, user_password, user_role) VALUES ('Admin', 'Admin', 'admin@gmail.com', 'password', 'admin');



-- create a math deck with 10 cards for multiplication
INSERT INTO decks (user_id, deck_name, deck_description, course_name) VALUES ('b6596693-03cc-4da0-ad54-97ff8d16fa3a', 'Multiplication', 'This is a deck for multiplication', 'Math');

INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 2 = ?', '4');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 3 = ?', '6');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 4 = ?', '8');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 5 = ?', '10');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 6 = ?', '12');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 7 = ?', '14');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 8 = ?', '16');
INSERT INTO flashcards (deck_id, question, answer) VALUES (6, '2 x 9 = ?', '18');

    