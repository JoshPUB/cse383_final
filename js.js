// Global Variables
var fuzUrl = 'https://api.tomtom.com/search/2/search/';
var fuzzUrl = 'https://api.tomtom.com/search/2/search/';
var startLat;
var startLon;
var endLat;
var endLon;
var routingUrl = 'https://api.tomtom.com/routing/1/calculateRoute/';
var mapUrl = 'https://api.tomtom.com/map/1/staticimage?layer=basic&style=main&format=jpg&zoom=12&center=';
var mapLat;
var mapLon;
// End of Global Variables

function main() {
fuzzyStart();
fuzzyEnd();
route();
}

//function that takes the query and puts it into fuzzy search

function fuzzyStart() {

var start = document.getElementById("Origin").value
//var startLat;
fuzUrl =  fuzUrl + start + '.json?minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=R3cmc7X8ByTRO8HGjOVPVHAxuGGxZ5IP'	

//replace the spaces with %20 for the url
var newUrl = fuzUrl.replace(/ /g, '%20');
console.log("Start:"); 
console.log(newUrl);

// do the ajax thing
  a = $.ajax({
  async: false,
  url: newUrl ,
  method: "GET" 
  })
  .done (function(data) {
  startLat = data.results[0].position.lat;
  startLon = data.results[0].position.lon;
  console.log("Start Lat:" + startLat);
  console.log("Start Lon:" + startLon);
  })
  .fail (function(error){
  console.log("Failed at First Fuzzy Search")
  console.log(newUrl);
  alert("Fuzzy Search One Failed")
  })

}


//function that takes the query and puts it into fuzzy search FOR DESTINATION
function fuzzyEnd() {

	
var destination = document.getElementById("Destination").value

var endUrl =  fuzzUrl + destination + '.json?minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=R3cmc7X8ByTRO8HGjOVPVHAxuGGxZ5IP'

var newerUrl = endUrl.replace(/ /g, '%20');
console.log("End:");
console.log(newerUrl);

// do the ajax thing
  a = $.ajax({
    async: false,
    url: newerUrl ,
    method: "GET"
  })
 .done(function(data) {
 	endLat = data.results[0].position.lat;
 	endLon = data.results[0].position.lon;
 	console.log("End Lat:" + endLat);
 	console.log("End Lon:" + endLon);
  })
  .fail(function(error){
  console.log("Failed")
console.log(newerUrl);
  alert("oof")
  })
}

function route() {

	var mode = document.querySelector("input[name='radio']:checked").value;
	var travel = document.getElementById("route-type").value;
	var hill = document.getElementById("hilliness").value;

routingUrl = routingUrl + startLat + "%2C" + startLon + "%3A" + endLat + "%2C" + endLon + "/json?instructionsType=text&routeType=" + travel + "&traffic=true&travelMode=" + mode + "&key=R3cmc7X8ByTRO8HGjOVPVHAxuGGxZ5IP"; 

// https://api.tomtom.com/routing/1/calculateRoute/52.50931%2C13.42936%3A52.50274%2C13.43872/json?instructionsType=text&routeType=thrilling&traffic=true&travelMode=car&hilliness=high&key=*****
	if(travel == "thrilling"){
routingUrl = "https://api.tomtom.com/routing/1/calculateRoute/"  + startLat + "%2C" + startLon + "%3A" + endLat + "%2C" + endLon + "/json?instructionsType=text&routeType=" + travel + "&traffic=true&travelMode=" + mode +"&hilliness=" + hill + "&key=R3cmc7X8ByTRO8HGjOVPVHAxuGGxZ5IP"; 
console.log(routingUrl);
	}

	console.log("Routing API:" + routingUrl);
	a = $.ajax({
		async: false,
		url: routingUrl ,
		method: "GET"
	})
	.done(function(data) {
	//console.log(data.routes[0].guidance.instructions);
	//const info = Object.fromEntries(data.routes[0].guidance.instructions); 
	//console.log("info: " + info);
	//store(info);
	
//	'http://172.17.14.113/final.php?method=setLookup&location=45056&sensor=web&value=test+12345'
		
//		var newData = JSON.stringify(data.routes[0].guidance.instructions)
//		var response = JSON.parse(newData);
	console.log(data);
	const myJSON = JSON.stringify(data.routes[0].guidance.instructions);
	console.log(myJSON);
	const bigBrain = JSON.parse(myJSON);
	console.log(bigBrain);
		
	var response = data.responseText;
	var upload = "http://172.17.14.113/final.php?method=setLookup&location=45056&sensor=web&value="
	var info = upload + myJSON;
		store(myJSON);



	$("#output").append("<div class ='chance'><tr><td>" + "Total Distance: " + "Fasa" + "</td><td>" + "Total Time: " + "Faaqs" + "</td><td>" + "Total Time of Trafic Delays: " + "Fas" + "</td></tr></div>");

		for(i = 0; i < data.routes[0].guidance.instructions.length; i++){
	
	var  lon = data.routes[0].guidance.instructions[i].point.longitude;
	var lat = data.routes[0].guidance.instructions[i].point.latitude;
	var instruct = data.routes[0].guidance.instructions[i].message;
	var dist = data.routes[0].guidance.instructions[i].routeOffsetInMeters;
	var time = (data.routes[0].guidance.instructions[i].travelTimeInSeconds)/60;
	mapingUrl = mapUrl + lon + "%2C%20" + lat + "&width=512&height=512&view=Unified&key=R3cmc7X8ByTRO8HGjOVPVHAxuGGxZ5IP"; 
$("#output").append("<tr><td>" + " " +  "</td><td>" + "<img src=" + "'" + mapingUrl +  "'" + ">" + "</td><td>" + "  " +  "</td></tr>" + "<tr><td>" + "Time: " + time +" Minutes"  + "</td><td>" + instruct  + "</td><td>" + "Distance: " + dist + " Meters"  + "</td><td></tr>");

		}
	})
	.fail(function(error) {
		console.log("Failed at Route");
	})
}

function store(arg) {
alert(arg);

	 a = $.ajax({
     async: false,
     url: arg , 
     method: "POST"
 })
    .done(function(data) {
        console.log("Uploaded to DB");
    })
    .fail(function(error) {
        console.log("Failed at DB Upload");
    })
}

