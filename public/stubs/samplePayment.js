var paymentBody = {
  "cardPaymentMethodSpecificInput": {
  "paymentProductId": 1, 
  "skipAuthentication": false, 
    "card": {
      "cvv": "123", 
      "cardholderName": "Wile E. Coyote", 
      "cardNumber": "4567350000427977", 
      "expiryDate": "1220"
    }
  },
  "order": {
      "amountOfMoney": {
        "currencyCode": "EUR", 
        "amount": 2980
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
        "countryCode": "US", 
        "state": "Utah", 
        "street": "Desertroad", 
        "houseNumber": "1"
      }, 
      "billingAddress": {
        "additionalInfo": "b", 
        "countryCode": "US", 
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

module.exports = paymentBody;