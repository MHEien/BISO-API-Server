const axios = require('axios');

const authenticate = async () => {
    try {
        //HTTP Request body
      const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <Login xmlns="http://24sevenOffice.com/webservices">
            <credential>
              <ApplicationId>APPID</ApplicationId>
              <Password>PASSWORD</Password>
              <Username>COMMUNITY EMAIL</Username>
            </credential>
          </Login>
        </soap:Body>
      </soap:Envelope>`;
      
      //Responsen fra forespørselen
      const response = await axios.post('https://api.24sevenoffice.com/authenticate/v001/authenticate.asmx', body, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'http://24sevenOffice.com/webservices/Login'
        }
      });
      
      //Henter ut token fra responsen.
      const token = response.data.split('<LoginResult>')[1].split('</LoginResult>')[0];
      return token;
    } catch (error) {
      console.error(error);
    }
  }

module.exports = authenticate;