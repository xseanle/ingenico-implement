var	express			= require("express"),
	app				= express(),
	bodyParser		= require("body-parser"),
	indexRoute		= require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use("/", indexRoute);

app.listen(5000, "127.0.0.1", function(){
	console.log("Server is running");
});