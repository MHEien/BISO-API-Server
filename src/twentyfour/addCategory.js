const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');
const createInvoice = require('./createInvoice.js');

const parser = new xml2js.Parser();

const addCategory = async (Type, Campus, Student_id) => {
    try {
    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    const availableCategories = [{
        'Label': 'Semester Spring 2023',
        'Value': '113194',
        'Duration': '6'
    },
    {
        'Label': '1 year 2022/2023',
        'Value': '113166',
        'Duration': '12'
    },
    {
        'Label': '3 years (Fall 2022/Spring 2025)',
        'Value': '113165',
        'Duration': '36'
    }
    ];

    //We will receive the label from either of the available categories. We need to find the value of the label.
    const category = availableCategories.find(category => category.Label === Type);
    //Return the duration of the selected category.
    const selectedDuration = category.Duration;
    const selectedCategory = category.Value;
    
    const studentNumber = Student_id.substring(1);

    //Kræsjer. må fikse - Kommenterer ut midlertidig
    //const invoice = await createInvoice(selectedDuration, Campus, studentNumber, token);

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <SaveCustomerCategories xmlns="http://24sevenOffice.com/webservices">
          <customerCategories>
            <KeyValuePair>
              <Key>${selectedCategory}</Key>
              <Value>${studentNumber}</Value>
            </KeyValuePair>
          </customerCategories>
        </SaveCustomerCategories>
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/CRM/Company/V001/CompanyService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://24sevenOffice.com/webservices/SaveCustomerCategories',
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        //Parser responsen til JSON
        const data = await parser.parseStringPromise(response.data);
        //Returnerer responsen
        return data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = addCategory;