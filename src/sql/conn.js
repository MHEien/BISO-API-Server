const mysql = require('mysql');


//Tilkobling til databasen.
const db = mysql.createConnection({
    host: 'server_mysql',
    user: 'root',
    password: '34aa1f3564657184c447',
    database: 'server'
  });

module.exports = db;