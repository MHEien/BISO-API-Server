
## Licenses



[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)




# BISO API documentations

Welcome to BISOs API documentation.

This document contains relevant information regarding the API server written by BISOs IT-Manager.

The server contains a structure for connecting to 24SevenOffice, and a connection to a MySQL Database.


## Features

- Fetch transactions from 24SevenOffice
- Fetch data from the database which PowerBI is connected to
- Filter existing transactions and post non existing data to the database
- Fetch departments, and create new to the database


## Run Locally

Clone the project

```bash
  git clone https://github.com/MHEien/24toSQL.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Setup confirugarion

Connect to the SQL server

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

Connect to the 24SevenOffice Client
```javascript
import axios from 'axios';

const authenticate = async () => {
    try {
        //HTTP Request body
      const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <Login xmlns="http://24sevenOffice.com/webservices">
            <credential>
              <ApplicationId><24SEVENOFFICE_APIKEY_HERE></ApplicationId>
              <Password>24SEVENOFFICE_COMMUNITY_PASSWORD_HERE</Password>
              <Username>24SEVENOFFICE_COMMUNITY_USERNAME_HERE</Username>
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

  export default authenticate;
```


## API Reference

#### Get account chart

```http
  GET /accounts
```

#### Get customers

```http
  GET /customers
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `customerName` | `string` | **Required**.  |

#### Get departments

```http
  GET /accounts
```


#### Get transactions

```http
  GET /transactions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `dateStart`      | `string` | **Required**. The first date you will query |
| `dateEnd`      | `string` | **Required**. The last date in the period you will query |


## Authors

- [Markus Heien](https://www.github.com/MHeien)


## Contributing

Contributions are always welcome!

Simply pull requests, and I will go through and update the repo.


