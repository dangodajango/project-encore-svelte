ALTER TABLE users
    ADD COLUMN email VARCHAR(255),
    ADD COLUMN  passwordHash VARCHAR(255);