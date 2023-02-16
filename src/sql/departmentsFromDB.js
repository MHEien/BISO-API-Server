const db = require('./conn.js');

/*
**Denne funksjonen er relativt simpel. Den henter kun ut alle avdelinger fra databasen og returnerer dem.
*/


const getDepartmentsFromDB = () => {
    return new Promise((resolve, reject) => {

        db.query(`SELECT * FROM departments`, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
          console.log('Departments fetched from database');
        });
    });
}


module.exports = getDepartmentsFromDB;