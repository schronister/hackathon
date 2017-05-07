// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
app.use(express.static('public'))
var axios = require("axios");


// Sets up the Express App
// =============================================================

var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//============================================================

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "car2go.html"));
});


app.get("/vehicles", function(req, res) {
	var endpoint = "https://www.car2go.com/api/v2.1/vehicles?loc=austin&oauth_consumer_key=MobilityX_Hackathon&format=json"
	var vehicles; 
	axios.get(endpoint)
	  .then(function (response) {
		res.send(response.data);
		}).catch(function(error){
			console.log(error);
			res.send(error);
		})

});



//start listening on 3000
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});