const http = require('http');
const compareTransactions = require('./src/sql/postTransactions.js');
const compareDepartments  = require('./src/sql/newDepartments.js');
const getCustomer = require('./src/twentyfour/getCustomer.js');
const expenseStatus = require('./src/sql/expenseStatus.js');
const postAccounts = require('./src/sql/postAccounts.js');
const express = require('express');
const winston = require('winston');
const cron = require('cron');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const addCategory = require('./src/twentyfour/addCategory.js');
const checkSession = require('./src/sql/getSession.js');
const postCustomers = require('./src/sql/postCustomers.js');
const stripe = require('stripe')('sk_test_GurtrRkm6SALVmQggFJuB4Go00mgwJdbtX');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
//Starter API serveren.
const server = http.createServer(app);



//Initialiserer logger til fil.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        //Log request body to request.log
        new winston.transports.File({ filename: 'request.log', level: 'info' })
    ]
});

function getProductData() {
    const products = [
      {
        id: 1,
        name: 'test1',
        price: 300,
      },
      {
        id: 2,
        name: 'test2',
        price: 550,
        discount: 16.67,
      },
      {
        id: 3,
        name: 'test3',
        price: 1350,
        discount: 20,
      },
    ];
    return products;
  }

//Logger inkommende requests i error.log eller combined.log
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

//hovedrute
app.get('/', (req, res) => {
    res.send('Server is active!');
});

app.get('/transactions/', async (req, res) => {

    const dateStart = req.query.dateStart;
    const dateEnd = req.query.dateEnd;
    

    if (dateStart && dateEnd) {

        //Kjører funksjonen.
        const response = await compareTransactions(dateStart, dateEnd);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Synchronizing with Power BI...');
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('No dates specified');
    }
});

app.get('/customers/', async (req, res) => {
    
    //Ved forespørsel vil den bruke customerName som parameter. i.e /customers/?customerName=Markus%20Heien
    const customerName = req.query.customerName;

    //Henter kundeID fra 24SevenOffice.
    const response = await getCustomer(customerName);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});

app.post('/studentCategory/', async (req, res) => {
    //Listen for POST requests with a JSON object in the body. From the body, get the Type, Campus and StudentID fields and pass it to addCategory.
    const { Type, Campus, StudentID } = req.body;
    const response = await addCategory(Type, Campus, StudentID);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});

app.get('/syncCustomers', async (req, res) => {
    
    const response = await syncCustomers();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});


//Rute for å sjekke status på en expense. Tar imot expenseId og customerName som query parameters. i.e /status/?expenseId=123&customerName=Markus%20Heien
app.get('/expenseStatus/', async (req, res) => {
    const invoiceNo = req.query.invoiceNo;
    const customerName = req.query.customerName;

    const response = await expenseStatus(customerName, invoiceNo);
    //If response is true, return 200. Else return 404.
    if (response === 'true') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Expense is approved!');
    } else {
        console.log(response)
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Expense is not approved!');
    }
});

app.get('/session', async (req, res) => {
    const response = await checkSession();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});


app.get('/departments/', async (req, res) => {
    const response = await compareDepartments();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Departments synced with PowerBI!');
});

app.get('/accounts/', async (req, res) => {
    const response = await postAccounts();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Accounts synced with PowerBI!');
});

app.get('/getCustomers', async (req, res) => {
    const response = await postCustomers();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});


app.get('/test/', async (req, res) => {

    const customerName = req.query.customerName;

    const response = await getCustomer(customerName);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

// Define a route to retrieve the products
app.get('/api/products', (req, res) => {
    try {
      const products = getProductData();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while retrieving the products');
    }
  });
  
  app.get('/api/publishable-key', (req, res) => {
    try {
      const publishableKey = "pk_test_gVvcgfdzboTdS3wjp2Jmrgfj00R06iGFfc";
      res.json({ publishableKey });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while retrieving the publishable key');
    }
  });


  // Define a route to handle Stripe payments
  app.post('/api/payments', async (req, res) => {

   const { items, customerDetails } = req.body;
    const { id, name, price } = items[0];
    const { firstName, lastName, email, address } = customerDetails;

    const {line1, city, postal_code } = address;
  
    let customer = null;

    const customers = await stripe.customers.list({ email: email });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ email: email });
    }


    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'nok',
        customer: customer.id,
        receipt_email: email,
        description: `Purchased the ${name}`,
        shipping: {
          name: email,
          address: {
            line1: line1,
            postal_code: postal_code,
            city: city,
            country: 'NO',
          },
        },
      });
  
      // If the charge is successful, return a success message
      res.json({ message: 'Payment successful', clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing your payment');
    }
  });

//Lytter til requests.
server.listen(port, () => {
    console.log('Server running on port ' + port);
});