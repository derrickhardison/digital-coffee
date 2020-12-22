$(document).ready(function () {

  // DOM VARIABLES
  var headerEL = $("#header");
  var quoteEl = $("#quote-box");
  var authorEl = $("#author-box");

  // JAVASCRIPT VARIABLES
  var header = "Digital Coffee: Your Daily Dose of ";
  // var quoteString = "";
  // var quoteAuthor = "- ";

  // FUNCTION DEFINITIONS

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
      headerEL.text(header+"Dad Jokes")
    });
  }




  // FUNCTION CALLS
  
  dadJoke();

  // EVENT LISTENERS
});
