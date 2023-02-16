const axios = require('axios');
const xml2js = require('xml2js');
const authenticate = require('./auth.js');

const parser = new xml2js.Parser();

const getDepartments = async () => {
    try {
        
        //Initialiserer et Array som skal holde transaksjonene.
    const departmentsArray = [];
    
    //Henter token fra første forespørsel i en await. Dvs at vi venter på at token skal bli hentet før vi fortsetter. Ellers vil funksjonen returnere en error.
    const token = await authenticate();

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetDepartmentList xmlns="http://24sevenOffice.com/webservices" />
      </soap:Body>
    </soap:Envelope>`;
    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/Client/V001/ClientService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': "http://24sevenOffice.com/webservices/GetDepartmentList",
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });
        
        //Parser transaksjonene til JSON
        const departments = await xml2js.parseStringPromise(response.data);

        //til array
        departments['soap:Envelope']['soap:Body'][0]['GetDepartmentListResponse'][0]['GetDepartmentListResult'][0]['Department'].forEach(department => {
            departmentsArray.push({
                Id: department['Id'][0],
                Name: department['Name'][0],
                Campus: department['Id'][0] < 299 ? 'Oslo' : department['Id'][0] < 599 ? 'Bergen' : department['Id'][0] < 799 ? 'Trondheim' : department['Id'][0] < 999 ? 'Stavanger' : 'National'
            });
        });
        console.log(response.data);
        return departmentsArray;
    } catch (error) {
        console.error(error);
    }
}

module.exports = getDepartments;