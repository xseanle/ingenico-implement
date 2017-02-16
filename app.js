var	express			= require("express"),
	app				= express(),
	rekuire			= require("rekuire"),
		crypto				= require('crypto'),
		dateformat		= require('dateformat'),
			http				= require('http'),
	https				= require('https'),
			uuid 				= require('node-uuid'),
	bodyParser		= require("body-parser"),
	indexRoute		= require("./routes/index"),
	createPayment 	= rekuire("paymentAction"),
	realtimeBody    = rekuire("sampleRealtime"),
	setInformation 	= rekuire('setInformation');

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use("/", indexRoute);

app.get("/sessions/create", function(req, res){
  var paymentAction = new createPayment();
  paymentAction.createSession(null, function(self){
    var paymentDetails = self.getParams();
  	res.send(paymentDetails);
  });
  
  
});
		
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is running");
});