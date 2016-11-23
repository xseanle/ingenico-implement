var	express				  = require("express"),
	rekuire				    = require("rekuire"),
	router				    = express.Router(),
	bodyParser			  = require("body-parser"),
	createPayment 		= rekuire("paymentAction"),
  realtimeBody      = rekuire("sampleRealtime"),
	setInformation 		= rekuire('setInformation');

router.use(bodyParser.urlencoded({extended:true}));

router.get("/", function(req, res){
  res.render("landing")
});

router.post("/payments", function(req, res){
  var setinfo = new setInformation(req.body, function(){
    var paymentAction = new createPayment();
    // var paymentContext = {
    //   idempotence: {
    //     key: "X-GCS-Idempotence-Key",
    //   }
    // };

    paymentAction.createPayment(null, function(self) { 
      var paymentDetails = self.getParams();
      res.render("paymentCreated", {paymentDetails:paymentDetails});
    });


  });
});

router.post("/payments/approve", function(req, res){
  var paymentAction = new createPayment();
  paymentAction.approvePayment(req.body.paymentId, null, function (self){
    var paymentDetails = self.getParams();
    res.render("paymentApproved", {paymentDetails:paymentDetails});
  })

});

router.post("/payments/tokenize", function(req, res){
  var paymentAction = new createPayment();
  paymentAction.tokenizePayment(req.body.paymentId, null, function(self) {
    var paymentDetails = self.getParams();
    res.render("paymentCreated", {paymentDetails:paymentDetails});
  });
});

router.post("/hostedcheckout", function(req, res){
  var paymentAction = new createPayment();
  paymentAction.hostedCheckout(null, function(self){
    var paymentDetails = self.getParams();
    res.redirect("https://payment." + paymentDetails.partialRedirectUrl);
  }); 
});

router.post("/realtimeBanking", function(req, res){
  var paymentAction = new createPayment();
  realtimeBody.redirectPaymentMethodSpecificInput = {
    "paymentProductId": 809,
    "paymentProduct809SpecificInput": {
      "issuerId": "INGBNL2A"
    },
    "skipAuthentication": false,
    "returnUrl": "http://127.0.0.1:5000/getPayment"
  };
  paymentAction.realtimeBanking(null, function(self){
    var paymentDetails = self.getParams();
    res.redirect(paymentDetails.merchantAction.redirectData.redirectURL);
  });
});

router.post("/paypal", function(req, res){
  var paymentAction = new createPayment();
  realtimeBody.redirectPaymentMethodSpecificInput = {
    "paymentProductId": 840,
    "skipAuthentication": false,
    "returnUrl": "http://127.0.0.1:5000/getPayment"
  };
  realtimeBody.order.amountOfMoney.currencyCode = "USD";
  realtimeBody.order.customer.shippingAddress.countryCode = "US";
  realtimeBody.order.customer.billingAddress.countryCode = "US";
  paymentAction.realtimeBanking(null, function(self){
    var paymentDetails = self.getParams();
    console.log(paymentDetails);
    res.redirect(paymentDetails.merchantAction.redirectData.redirectURL);
  });
});

router.get("/getPayment", function(req, res){
  var paymentAction = new createPayment();
  var paymentId = req.url.split("=")[1].split("&")[0];

  paymentAction.getPayment(paymentId, null, function(self){
    var paymentDetails = self.getParams();
    console.log("I AM HERE")
    console.log(paymentDetails);
    res.render("realtimeRes", {paymentDetails:paymentDetails});
  });
});


module.exports = router;