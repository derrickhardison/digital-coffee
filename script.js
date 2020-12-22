///////////////
// script.js //
///////////////
$(document).ready(function () {
  // Moment JS Variable to Track Current Time
  var timeDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    $("#currentDay").append(timeDate);
  // DOM VARIABLES
  var headerEL = $("#header");
  var quoteEl = $("#quote-box");
  var authorEl = $("#author-box");

  // JAVASCRIPT VARIABLES
  var intNumImages = 30; // How many images to get in ajax call to choose from at random
  var strSearchTermArray = ["animals", "people", "cars", "cake"]; // Temporary list of random search terms
  var strSearchTermIndex = Math.floor(
    Math.random() * strSearchTermArray.length
  ); // Generate random strsearchTermArray index
  var strSearchTerm = strSearchTermArray[strSearchTermIndex]; // pick one string from array
  var header = "Digital Coffee: Your Daily Dose of ";

  // FUNCTION DEFINTIONS
  /**
   *  getPexelsImage(searchTerm, numImages)
   *  searchTerm: A string specifying the type of images to return
   *  numImages:  An integer specifying how many images to select from at random
   */
  function getPexelsImage(searchTerm, numImages) {
    // Validate 0 <= numImages <= 80
    if (numImages > 80) {
      numImages = 80;
      throw numImagesTooLargeException;
    } else if (numImages < 0) {
      numImages = 0;
      throw numImagesTooSmallException;
    }

    // Build queryURL from base API URL and parameters
    var queryURL =
      "https://api.pexels.com/v1/search?query=" +
      searchTerm +
      "&per_page=" +
      numImages;

    // Actual API call
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        Authorization:
          "563492ad6f91700001000001f89041f69d0a47538b315fc967356983",
      },
    }).then(function (response) {
      // Choose an image at random from 0 to numImages parameter
      randomNumber = Math.floor(Math.random() * response.photos.length);

      // May want to parameterize "portrait" to select from an array of available orientations
      $("body").append(
        $("<img>").attr("src", response.photos[randomNumber].src.portrait)
      );
    });
  }
  // API call to get random dad joke
  function dadJoke() {
    $.ajax({
      url: "https://icanhazdadjoke.com/",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then(function (response) {
      quote = response.joke;
      quoteEl.text(quote);

      authorEl.text("    - Dad");
      headerEL.text(header + "Dad Jokes");
    });
  }

  // FUNCTION CALLS

  // This function appends an element to the body for now due to asynchronous return of .then
  getPexelsImage(strSearchTerm, intNumImages);
  dadJoke();

  // EVENT LISTENERS
});
