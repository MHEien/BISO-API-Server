const db = require('./conn.js');
const pushCustomersToArray = require('./fetchCustomers.js');
const getCustomers = require('../twentyfour/getCustomers.js');




const postCustomers = async (dateStart, dateEnd) => {
    const customersFromDB = await pushCustomersToArray();
    const customersFrom24SO = await getCustomers(dateStart, dateEnd);


  customersFrom24SO.forEach(company => {

    //Some customers have ' in their name, which breaks the SQL query. Remove it.
    company.Name = company.Name.replace(/'/g, '');

    if (customersFromDB.some(dbCustomer => dbCustomer.CustomerID === dbCustomer.CustomerID)) {
        db.query(`UPDATE customers SET CustomerName = '${company.Name}' WHERE Id = '${company.Id}'`);
        console.log('Customer updated');
    }
    else {
        db.query(`INSERT INTO customers (id, CustomerName) VALUES ('${company.Id}', '${company.Name}')`);
        console.log('Customer added');
        }
    });
};

module.exports = postCustomers;