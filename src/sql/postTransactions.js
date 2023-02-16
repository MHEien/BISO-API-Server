const db = require('./conn.js');
const pushTransactionsToArray = require('./fetchTransactions.js');
const getTransactions = require('../twentyfour/getTransactions.js');

/*
**Denne funksjonen sjekker om en transaksjon eksisterer i databasen, før vi legger den til fra 24SevenOffice. Hvis den allerede eksisterer, sjekker vi "DateChanged" verdien fra 24SevenOffice mot databasen.
**Hvis "DateChanged" verdien er endret, oppdateres transaksjonen i databasen med nye verdier. 
**Hvis transaksjonen derimot ikke er blitt endret, vil den bli satt inn som en ny transaksjon.
**Eksisterende og uendrede transaksjoner vil bli hoppet over.
*/


const compareTransactions = async (dateStart, dateEnd) => {
    const transactionsFromDB = await pushTransactionsToArray();
    const transactionsFrom24SO = await getTransactions(dateStart, dateEnd);


  transactionsFrom24SO.forEach(transaction => {

    const level = {
      level: transaction.AccountNo.toString().charAt(0)
    };

    //Convert transaction date to DateTIme format for DAX queries
    const dateFormatted = new Date(transaction.Date).toISOString().slice(0, 19).replace('T', ' ');

    //Check if comment contains '. If so, replace with ' to avoid SQL syntax error
    if (transaction.Comment && transaction.Comment.includes("'")) {
      transaction.Comment = transaction.Comment.replace(/'/g, "''");
    }


    if (transactionsFromDB.some(dbTransaction => dbTransaction.TransactionNo === transaction.TransactionNo)) {
      if (transactionsFromDB.some(dbTransaction => dbTransaction.TransactionNo === transaction.TransactionNo && dbTransaction.DateChanged !== transaction.DateChanged)) {
        db.query(`UPDATE transactions SET Amount = ${transaction.Amount}, DateChanged = '${transaction.DateChanged}', PeriodDate = '${transaction.PeriodDate}', Comment = '${transaction.Comment}', Open = '${transaction.Open}', Campus = '${transaction.Campus}', Department = '${transaction.Department}', CustomerID = '${transaction.Customer}', Project = '${transaction.Project}', Level = '${level.level}', LinkId = '${transaction.LinkId}' WHERE TransactionNo = '${transaction.TransactionNo}'`);
        console.log('Transaction updated');
      }
    } else {
      db.query(`INSERT INTO transactions (Date, AccountNo, Amount, StampNo, Period, InvoiceNo, DueDate, TransactionTypeId, DateChanged, PeriodDate, Comment, TransactionNo, Id, Open, Campus, Department, CustomerID, Project, Level, Membership) VALUES ('${dateFormatted}', '${transaction.AccountNo}', '${transaction.Amount}', '${transaction.StampNo}', '${transaction.Period}', '${transaction.InvoiceNo}', '${transaction.DueDate}', '${transaction.TransactionTypeId}', '${transaction.DateChanged}', '${transaction.PeriodDate}', '${transaction.Comment}', '${transaction.TransactionNo}', '${transaction.Id}', '${transaction.Open}', '${transaction.Campus}', '${transaction.Department}', '${transaction.Customer}', '${transaction.Project}', '${level.level}', '${transaction.Membership}')`);
      console.log('Transaction inserted');
    }
  });
  console.log('Transactions updated!')
};

module.exports = compareTransactions;