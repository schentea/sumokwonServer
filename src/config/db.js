import mysql from "mysql2";

const config = {
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DATABASE
};

const db = mysql.createPool(config).promise();

export default db;