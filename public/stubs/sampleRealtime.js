var realtimeBody = {
  "redirectPaymentMethodSpecificInput": {
    "paymentProductId": 809,
    "paymentProduct809SpecificInput": {
      "issuerId": "INGBNL2A"
    },
    "skipAuthentication": false,
    "returnUrl": "http://127.0.0.1:5000/getPayment"
  },
  "order": {
      "amountOfMoney": {
        "currencyCode": "EUR", 
        "amount": 100
      }, 
    "customer": {
      "shippingAddress": {
        "additionalInfo": "Suite II", 
        "name": {
          "surname": "Runner", 
          "firstName": "Road", 
          "title": "Miss"
        }, 
        "zip": "84536", 
        "city": "Monument Valley", 
        "countryCode": "NL", 
        "state": "Utah", 
        "street": "Desertroad", 
        "houseNumber": "1"
      }, 
      "billingAddress": {
        "additionalInfo": "b", 
        "countryCode": "NL", 
        "zip": "84536", 
        "city": "Monument Valley", 
        "state": "Utah", 
        "street": "Desertroad", 
        "houseNumber": "13"
      }, 
    "merchantCustomerId": "1234"
    },
    "references": {
      "merchantOrderId": 123456,
      "merchantReference": "AcmeOrder0001",
      "invoiceData": {
        "invoiceNumber": "000000123",
        "invoiceDate": "20140306191500"
      }
    }
  }
};

module.exports = realtimeBody;