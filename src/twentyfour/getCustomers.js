const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');

const parser = new xml2js.Parser();

const getCustomers = async () => {
    try {
        
        //Initialiserer et Array som skal holde transaksjonene.
    const customersArray = [];
    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetCompanies xmlns="http://24sevenOffice.com/webservices">
          <searchParams>
            <ChangedAfter>2020-01-01</ChangedAfter>
          </searchParams>
          <returnProperties>
            <string>Name</string>
          </returnProperties>
        </GetCompanies>
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/CRM/Company/V001/CompanyService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://24sevenOffice.com/webservices/GetCompanies',
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        
        //Parser transaksjonene til JSON
        const customers = await xml2js.parseStringPromise(response.data);

        customers['soap:Envelope']['soap:Body'][0]['GetCompaniesResponse'][0]['GetCompaniesResult'][0]['Company'].forEach(company => {
          customersArray.push({
              Id: company['Id'][0],
              Name: company['Name'][0],
            });
        });
        console.log(customersArray)
        return customersArray;
    } catch (error) {
        console.log(error);
    }
};

module.exports = getCustomers;