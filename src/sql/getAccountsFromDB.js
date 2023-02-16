const db = require('./conn.js');

/*
**Denne funksjonen er relativt simpel. Den henter kun ut alle avdelinger fra databasen og returnerer dem.
*/


const getDepartmentsFromDB = () => {
    return new Promise((resolve, reject) => {

        db.query(`SELECT * FROM accounts`, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
          console.log('Accounts fetched from database');
        });
    });
}


module.exports = getDepartmentsFromDB;