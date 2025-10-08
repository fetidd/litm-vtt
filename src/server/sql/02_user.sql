CREATE TABLE User (
    username STRING PRIMARY KEY NOT NULL, 
    hashedPassword STRING NOT NULL, 
    role STRING NOT NULL
);