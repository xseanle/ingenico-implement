var	express				= require("express"),
	rekuire				= require("rekuire"),
	router				= express.Router(),
	bodyParser			= require("body-parser"),
	createConnection	= rekuire('createConnection'),
	createPayment 			= rekuire("paymentAction"),
	setInformation 		= rekuire('setInformation');

router.use(bodyParser.urlencoded({extended:true}));

router.get("/", function(req, res){
  res.render("landing")
});

router.post("/payments", function(req, res){
  var setinfo = new setInformation(req.body, function(){
    var paymentAction = new createPayment();
    var paymentContext = {
      idempotence: {
        key: "X-GCS-Idempotence-Key",
      }
    };

    paymentAction.createPayment(paymentContext, function(self) { 
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
    console.log(paymentDetails)
    res.render("paymentCreated", {paymentDetails:paymentDetails});
  });
});

module.exports = router;