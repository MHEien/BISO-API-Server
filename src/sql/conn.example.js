const mysql = require('mysql');


//Tilkobling til databasen.
const db = mysql.createConnection({
    host: 'hostname',
    user: 'username',
    password: 'password',
    database: 'database_name'
  });

module.exports = db;