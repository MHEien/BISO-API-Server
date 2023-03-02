const mysql = require('mysql');


//Tilkobling til databasen.
const db = mysql.createConnection({
    host: 'database_mysql',
    user: 'mysql',
    password: '34aa1f3564657184c447',
    insecureAuth: true,
    database: 'server'
  });

module.exports = db;