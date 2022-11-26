-- Create database for the project with the name `doclock_db`

CREATE DATABASE doclock_db;

-- Use the database of our project to perform queries

USE doclock_db;

-- Create a table of users with the name `user_documents`

CREATE TABLE `user_documents` (
  `u_name` varchar(30) NOT NULL,
  `d_name` varchar(30) NOT NULL,
  `file_name` longtext,
  `file_path` longtext
);

-- Fetch data from the table `user_documents`

SELECT * FROM `user_documents`;
