const axios = require('axios');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

const createInvoice = async (selectedDuration, Campus, studentNumber, token) => {
    try {

    const availableDepartments = [{
        'Campus': 'Oslo',
        'departmentId': '1'
    },
    {
        'Campus': 'Bergen',
        'departmentId': '300'
    },
    {
        'Campus': 'Trondheim',
        'departmentId': '600'
    },
    {
        'Campus': 'Stavanger',
        'departmentId': '800'
    }
    ];

    const availableProducts = [{
        'ProductId': '1002',
        'DimensionId': '100',
        'Duration': '6'
    },
    {
        'ProductId': '2000',
        'DimensionId': '200',
        'Duration': '12'
    },
    {
        'ProductId': '3000',
        'DimensionId': '300',
        'Duration': '36'
    }
    ];

    //Return the product Id as a string based on the selected duration.
    const product = availableProducts.find(product => product.Duration === selectedDuration)

    //Return the departmentId as a string of the campus that matches the campus.
    const department = availableDepartments.find(department => department.Campus === Campus)

    //Forespørselen vi kjører til 24SevenOffice
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <SaveInvoices xmlns="http://24sevenOffice.com/webservices">
          <invoices>
            <InvoiceOrder>
              <CustomerId>${studentNumber}</CustomerId>
              <OrderStatus>Draft</OrderStatus>
              <IncludeVAT>true</IncludeVAT>
              <DepartmentId>${department}</DepartmentId>
              <InvoiceRows>
                <InvoiceRow>
                    <ProductId>${product}</ProductId>
                    <Quantity>1</Quantity>
                </InvoiceRow>
              </InvoiceRows>
              <UserDefinedDimensions>
                <UserDefinedDimension>
                    <Key>101</Name>
                    <Value>${Campus}</Value>
                </UserDefinedDimension>
                <UserDefinedDimension>
                    <Key>102</Name>
                    <Value>${selectedDuration}</Value>
              </UserDefinedDimensions>
            </InvoiceOrder>
          </invoices>
        </SaveInvoices>
      </soap:Body>
    </soap:Envelope>`;

    
        //Respons
        const response = await axios.post('https://api.24sevenoffice.com/Economy/InvoiceOrder/V001/InvoiceService.asmx', body, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://24sevenOffice.com/webservices/SaveInvoices',
                'Cookie': 'ASP.NET_SessionId=' + token
            }
        });

    return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = createInvoice;