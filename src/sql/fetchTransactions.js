const db = require('./conn.js');


//Her henter vi transaksjoner fra databasen. Disse brukes til sammenligning.
const getTransactionsFromDB = (dateStart, dateEnd) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM transactions`, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
          console.log('Transactions fetched from database');
        });
    });
  };
  
  
//Pusher trannsaksjonene til et array, før vi sammenligner dem med transaksjonene fra 24SevenOffice.
const pushTransactionsToArray = () => {
    return new Promise(async (resolve, reject) => {
      const transactions = await getTransactionsFromDB();
      const transactionsArray = [];
      transactions.forEach(transaction => {
        transactionsArray.push(transaction);
      });
      resolve(transactionsArray);
      console.log(transactionsArray);
    });
  };
  
module.exports = pushTransactionsToArray;

