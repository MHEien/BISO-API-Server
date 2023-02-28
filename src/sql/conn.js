const mysql = require('mysql');


//Tilkobling til databasen.
const db = mysql.createConnection({
    host: 'server_mysql',
    user: 'mysql',
    password: '273fd0f2b03fb1fa660b',
    database: 'server'
  });

module.exports = db;