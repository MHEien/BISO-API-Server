const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');

const parser = new xml2js.Parser();

const getTransactions = async (dateStart, dateEnd) => {
    try {
        
        //Initialiserer et Array som skal holde transaksjonene.
    const transactionsArray = [];
    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetTransactions xmlns="http://24sevenoffice.com/webservices/economy/accounting/">
          <searchParams>
            <DateStart>${dateStart}</DateStart>
            <DateEnd>${dateEnd}</DateEnd>
          </searchParams>
        </GetTransactions>
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/Economy/Accounting/V001/TransactionService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://24sevenoffice.com/webservices/economy/accounting/GetTransactions',
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        
        //Parser transaksjonene til JSON
        const transactions = await xml2js.parseStringPromise(response.data);

        transactions['soap:Envelope']['soap:Body'][0]['GetTransactionsResponse'][0]['GetTransactionsResult'][0]['Transaction'].forEach(transaction => {
          transactionsArray.push({
              Date: transaction['Date'][0],
              AccountNo: transaction['AccountNo'][0],
              Amount: transaction['Amount'][0],
              StampNo: transaction['StampNo'] ? transaction['StampNo'][0] : null,
              Period: transaction['Period'][0],
              InvoiceNo: transaction['InvoiceNo'] ? transaction['InvoiceNo'][0] : null,
              DueDate: transaction['DueDate'] ? transaction['DueDate'][0] : '2020-01-01',
              TransactionTypeId: transaction['TransactionTypeId'][0],
              DateChanged: transaction['DateChanged'][0] ? transaction['DateChanged'][0] : null,
              PeriodDate: transaction['PeriodDate'] ? transaction['PeriodDate'][0] : null,
              Comment: transaction['Comment'] ? transaction['Comment'][0] : null,
              TransactionNo: transaction['TransactionNo'][0],
              Id: transaction['Id'][0],
              Open: transaction['Open'][0],
              Campus: transaction['Dimensions'][0] ? transaction['Dimensions'][0]['Dimension'].some(dimension => dimension['TypeId'][0] === '101') ? transaction['Dimensions'][0]['Dimension'].filter(dimension => dimension['TypeId'][0] === '101')[0]['Value'][0] : 0 : 0,
              Department: transaction['Dimensions'][0] ? transaction['Dimensions'][0]['Dimension'].some(dimension => dimension['Type'][0] === 'Department') ? transaction['Dimensions'][0]['Dimension'].filter(dimension => dimension['Type'][0] === 'Department')[0]['Value'][0] : null : null,
              Customer: transaction['Dimensions'][0] ? transaction['Dimensions'][0]['Dimension'].some(dimension => dimension['Type'][0] === 'Customer') ? transaction['Dimensions'][0]['Dimension'].filter(dimension => dimension['Type'][0] === 'Customer')[0]['Value'][0] : null : null,
              Project: transaction['Dimensions'][0] ? transaction['Dimensions'][0]['Dimension'].some(dimension => dimension['Type'][0] === 'Project') ? transaction['Dimensions'][0]['Dimension'].filter(dimension => dimension['Type'][0] === 'Project')[0]['Value'][0] : 0 : 0,
              Membership: transaction['Dimensions'][0] ? transaction['Dimensions'][0]['Dimension'].some(dimension => dimension['TypeId'][0] === '102') ? transaction['Dimensions'][0]['Dimension'].filter(dimension => dimension['TypeId'][0] === '102')[0]['Value'][0] : null : null
            });
        });
        console.log(transactionsArray)
        return transactionsArray;
    } catch (error) {
        console.log(error);
    }
};

module.exports = getTransactions;