
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDgCu8KsAuKGy_vnXDj4dSMn9id_zW1Rz0",
    authDomain: "trains2-be74d.firebaseapp.com",
    databaseURL: "https://trains2-be74d.firebaseio.com",
    projectId: "trains2-be74d",
    storageBucket: "trains2-be74d.appspot.com",
    messagingSenderId: "1001014738512",
    appId: "1:1001014738512:web:9de8dfc12e530d2a"
};
firebase.initializeApp(firebaseConfig);

// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)

// Create a variable to reference the database
var database = firebase.database();


//Initial values
var trainName = "";
var trainDest = "";
var trainFreq = 0;
var nextArrival = 0;
var minsAway = 0;

// Created a New train object to store information for the submit button event
//This is used to hold the input data in the form
var newTrain = {
    TrainName: trainName,
    Destination: trainDest,
    Frequency: trainFreq,
    TrainTime: trainTime,
}

var currentTime = "";
var trainTime = "";
var timeDiff = 0;
var timeRemainder = 0;
var FirstTrainTime = "";


//Adds the input data to the firebase database on the submit click event
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();


    newTrain.TrainName = $("#train-name").val().trim();
    newTrain.Destination = $("#destination").val().trim();
    newTrain.Frequency = $("#frequency").val().trim();
    newTrain.TrainTime = moment($("#first-train").val().trim(), "HH:mm").format("HH:mm");

    database.ref().push(newTrain);

    // Clears all the form input boxes
    clearInput();
});

// Function that clears all input boxes
function clearInput() {
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
};

// Creates the table with Train data and calulates Next Arrival and Minutes Away
database.ref().on("child_added", function (snapshot) {

    // Error handler for when First Train Time is outside the 24h military time
    if (FirstTrainTime !== 'Invalid date') {
        trainName = snapshot.val().TrainName;
        trainDest = snapshot.val().Destination;
        trainTime = moment(snapshot.val().TrainTime, "HH:mm");
        trainFreq = snapshot.val().Frequency;


        // trainTime (pushed back 1 year to make sure it comes before current time)?????
        var trainTimeConvert = moment(trainTime, "HH:mm")
        //.subtract(1, "years");
        console.log(trainTimeConvert);

        //Current time
        currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        timeDiff = moment().diff(moment(trainTimeConvert), "minutes");
        console.log("DIFFERENCE IN TIME: " + timeDiff);

        // Time apart (remainder)
        timeRemainder = timeDiff % trainFreq;
        console.log("Remaining Time: " + timeRemainder);

        // Minute Until Train
        minAway = trainFreq - timeRemainder;
        console.log("MINUTES TILL TRAIN: " + minAway);

        // Next Train
        nextArrival = moment().add(minAway, "minutes").format("hh:mm");
        console.log("ARRIVAL TIME: " + moment(nextArrival));

        $("#trainOutput").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
    }

});
