const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');

const parser = new xml2js.Parser();

const getCustomer = async (customerName) => {
    try {
        

    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetCompanies xmlns="http://24sevenOffice.com/webservices">
          <searchParams>
            <CompanyName>${customerName}</CompanyName>
          </searchParams>
        </GetCompanies>
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/CRM/Company/V001/CompanyService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': "http://24sevenOffice.com/webservices/GetCompanies",
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        const customer = await xml2js.parseStringPromise(response.data);
        const customerId = customer['soap:Envelope']['soap:Body'][0]['GetCompaniesResponse'][0]['GetCompaniesResult'][0]['Company'][0]['Id'][0];
        console.log(customerId)
        return customerId;

    } catch (error) {
        console.error(error);
    }
}

module.exports = getCustomer;