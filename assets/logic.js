// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

	// Initialize Firebase
    var config = {
    	apiKey: "AIzaSyBn-JUh6QDAN54fnSmgggaWB8SeIVe2Fw8",
    	authDomain: "train-time-90e85.firebaseapp.com",
    	databaseURL: "https://train-time-90e85.firebaseio.com",
    	projectId: "train-time-90e85",
    	storageBucket: "",
    	messagingSenderId: "1086264530134"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

	$("#submit").on("click", function(event) {
		event.preventDefault();

		// Train Name
		var trainName = $("#train-name").val().trim();
		// Destination
		var destination = $("#destination").val().trim();
		// Current Time
		var currentTime = moment();
		// First Train Time
		var firstTrain = $("#first-train").val().trim();
		// First Train Time (pushed back 1 year to make sure it comes before current time)
		var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
		// Difference between times
		var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
		// Frequency
		var frequency = $("#frequency").val().trim();
		// Time apart (remainder)
		var tRemainder = diffTime % frequency;
		// Minutes till next train
		var  minutesAway = frequency - tRemainder;
		// Next train
		var nextTrain = moment().add(minutesAway, "minutes");
		// Next train converted
		var nextTrainConverted = moment(nextTrain).format("hh:mm");

		// Create local "temporary" object for holding employee data   
		var newTrain = {     
			Name: trainName,     
			Destination: destination,     
			Frequency: frequency,     
			Arrival: nextTrainConverted,
			Minutes: minutesAway   
		};
		// console log to debug
		console.log(newTrain);

		 // Uploads employee data to the database   
		 database.ref().push(newTrain);

		// Clears all of the text-boxes   
		$("#train-name").val("");   
		$("#destination").val("");   
		$("#first-train").val("");   
		$("#frequency").val("");

	});

	// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry 
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {   
	console.log(childSnapshot.val());   
	// Store everything into a variable.   
	var trainName = childSnapshot.val().Name;   
	var destination = childSnapshot.val().Destination;   
	var frequency = childSnapshot.val().Frequency;   
	var nextTrainConverted = childSnapshot.val().Arrival;
	var minutesAway = childSnapshot.val().Minutes;   
  
	// Add each train's data into the table   
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +   frequency + "</td><td>" + nextTrainConverted + "</td><td>" + minutesAway + "</td></tr>"); 
});

});