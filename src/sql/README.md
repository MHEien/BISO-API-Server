
# SQL

This folder contains all functions connected to the database.

## Features

- Connection to a MySQL database
- Fetch and update departments in the database
- Fetch and update customers/suppliers from the database
- Fetch and update transactions from the database
- Fetch and insert accounts from the database

## Setup confirugarion

If you want to contribute in writing connections to 24SevenOffice or relations to the database, you should have some knowledge around Javascript.

You can easily create new functions using the db connection stored in conn.js.




```javascript
import mysql from 'mysql';

const db = mysql.createConnection({
    host: '<YOUR_DATABASE_HOST>',
    user: '<YOUR_DATABASE_USERNAME>',
    password: '<YOUR_DATABASE_PASSWORD',
    database: '<YOUR_DATABASE_HERE>'
  });

  export default db;
```

# Further implementation

An example function using the connection above may look like this:
```javascript
const db = require('./conn.js');
const getCustomer = require('../twentyfour/getCustomer.js');

const expenseStatus = async (customerName, invoiceNo) => {

    const customerID = await getCustomer(customerName);

    return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM transactions WHERE InvoiceNo = '${invoiceNo}' AND CustomerID = '${customerID}'`, (err, result) => {
                if (result.length > 0) {
                    resolve('true');
                }
                else {
                    resolve('false');
                }
            });
    });
}
module.exports = expenseStatus;
```

The function above first imports the required dependencies from their respective files found in the project. 

The example expenseStatus takes `customerName` and `invoiceNo` as parameters.

With the `await` syntax, the function will run and wait for `getCustomer` before executing. This is because we need the data from the `getCustomer` function to match data.

To write a function that should fetch or post data to the database, you will need the `db` prefix to the query you want to run.