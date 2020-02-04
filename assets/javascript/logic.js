// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

var config = {
  apiKey: "AIzaSyBJYLKQ6ESPfPPnaSvQktFoWBfReqN-NAc",
  authDomain: "hello-world-project-18d8c.firebaseio.com",
  databaseURL: "https://hello-world-project-18d8c.firebaseio.com/",
  projectId: "hello-world-project-18d8c"
};

firebase.initializeApp(config);
var database = firebase.database();

// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

function displayCurrentHighBid() {
  $('#highest-bidder').text(highBidder);
  $('#highest-price').text(highPrice);
}


// --------------------------------------------------------------
// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.

database.ref().on("value", function (snapshot) {
  // If Firebase has a highPrice and highBidder stored (first case)
  const snapshotValue = snapshot.val();

  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {
    highPrice = parseInt(snapshotValue.highPrice);
    highBidder = snapshotValue.highBidder;

    console.log(highPrice, highBidder);

  }

  // display current high bid
  displayCurrentHighBid();

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


// ===================================================
// on click event 
// ===================================================
// Whenever a user clicks the submit-bid button
$("#submit-bid").on("click", function (event) {
  // Prevent form from submitting
  event.preventDefault();

  // Get the input values
  var bidderPrice = parseInt($('#bidder-price').val());
  var bidderName = $('#bidder-name').val();

  // Log the Bidder and Price (Even if not the highest)


  if (bidderPrice > highPrice) {

    // Alert
    // alert("You are now the highest bidder.");
    var successMessage = $('<div>').addClass('alert alert-success')
      .attr('role', 'alert')
      .text('Success - YOU are the highest bidder.');
    $('.card-message').prepend(successMessage);
    setTimeout(function() {
      $('.card-message').detach();
    }, 5 * 1000);

    // Save the new price in Firebase
    database.ref().set({
      highPrice: bidderPrice,
      highBidder: bidderName
    });

    database.ref('allBidders').push().set({
      highPrice: bidderPrice,
      highBidder: bidderName
    });

  } else {
    // Alert
    // alert("Sorry that bid is too low. Try again.");

    var tooLowMessage = $('<div>').addClass('alert alert-warning')
      .attr('role', 'alert')
      .text('Ouch - Sorry that bid is too low.');
    $('.card-message').prepend(tooLowMessage);
    setTimeout(function() {
      $('.card-message').detach();
    }, 5 * 1000);

  }

});
