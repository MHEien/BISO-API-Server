const db = require('./conn.js');


//Her henter vi transaksjoner fra databasen. Disse brukes til sammenligning.
const getCustomersFromDB = (dateStart, dateEnd) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM customers`, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
          console.log('Customers fetched from database');
        });
    });
  };
  
  
//Pusher trannsaksjonene til et array, før vi sammenligner dem med transaksjonene fra 24SevenOffice.
const pushCustomersToArray = () => {
    return new Promise(async (resolve, reject) => {
      const customers = await getCustomersFromDB();
      const customersArray = [];
      customers.forEach(customer => {
        customersArray.push(customer);
      });
      resolve(customersArray);
      console.log(customersArray);
    });
  };
  
module.exports = pushCustomersToArray;

