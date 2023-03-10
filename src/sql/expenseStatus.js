const db = require('./conn.js');
const getCustomer = require('../twentyfour/getCustomer.js');

/*
**Har skrevet en liten funksjon her som skal hjelpe å sjekke status på en refusjon real-time. 
**Funskjonen er ment til bruk som en api rute for BISO appen, slik at vi kan sjekke om en refusjon er godkjent eller ikke.
**Grunnen til at vi kjører requesten fra server, og ikke direkte i appen er av sikkerhetsmessige grunner.
**Vi ønsker ikke at appen skal ha tilgang til 24SevenOffice APIet, og velger derfor å kjøre det gjennom egen server.
**Med denne funksjonen kan vi enkelt sjekke en refusjon ved https://api.biso.no/status?invoiceNo='streng'&customerName='streng'.
**Funksjonen vil returnere enten true eller false, avhengig av om refusjonen er registrert i systemet. Denne funksjonen sjekker bare fra databasen.
*/



const expenseStatus = async (customerName, invoiceNo) => {

    const customerID = await getCustomer(customerName);

    return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM transactions WHERE InvoiceNo = '${invoiceNo}' AND CustomerID = '${customerID}'`, (err, result) => {
                if (result.length > 0) {
                        resolve(result[0].LinkId);
                } else {
                        resolve("No");
                }
            });
    });
}

module.exports = expenseStatus;