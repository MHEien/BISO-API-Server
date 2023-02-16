const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');

const parser = new xml2js.Parser();

const getAccounts = async () => {
    try {
        
        //Initialiserer et Array som skal holde transaksjonene.
    const accountsArray = [];
    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetAccountList xmlns="http://24sevenOffice.com/webservices" />
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/Economy/Account/V004/Accountservice.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://24sevenOffice.com/webservices/GetAccountList',
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        
        //Parser transaksjonene til JSON
        const accounts = await xml2js.parseStringPromise(response.data);

        accounts['soap:Envelope']['soap:Body'][0]['GetAccountListResponse'][0]['GetAccountListResult'][0]['AccountData'].forEach(account => {
          accountsArray.push({
              AccountId: account['AccountId'][0],
              AccountNo: account['AccountNo'][0],
              AccountName: account['AccountName'][0]
            });
        });

        return accountsArray;
    } catch (error) {
        console.log(error);
    }
}

module.exports = getAccounts;