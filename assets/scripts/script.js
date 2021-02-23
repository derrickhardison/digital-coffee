///////////////
// script.js //
////////////////
$(document).ready(function () {
  // DOM VARIABLES
  var titleEl = $("#title");
  var quoteEl = $("#quote");
  var authorEl = $("#author");
  var userInputQuoteTypeEl = $("#user-pref-quote-type");
  var userInputThemeTypeEl = $("#user-pref-theme-type");

  // JAVASCRIPT VARIABLES
  var quote = "";
  var author = "";
  var quoteOptions = ["Dad Jokes", "Inspiration"];
  var userPreferences = {
    quoteType: "Inspiration",
    themeType: "Morning",
    location: { city: "Atlanta", latitudue: "", longitude: "" },
  };

  var intNumImages = 30; // How many images to get in ajax call to choose from at random
  var showTitle = false;

  // Generate random strsearchTermArray index
  var weatherState = "calm";
  var themeState = userPreferences.themeType;
  var strSearchTerm = themeState + " " + weatherState; // pick one string from array, add weatherState string

  // FUNCTION DEFINTIONS

  // Current Time & Date using moment.js

  var timeDate = moment().format("dddd, MMMM Do YYYY, h:mm a");
  $("#date").append(timeDate);

  // Weather API
  function weatherFunction(searchTerm) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchTerm +
        "&appid=0ee1a87c3651c275861013bac617a620&units=imperial",
      method: "GET",
    }).then(function (data) {
      //Clearing out previous search after refresh
      $("#today-cast").empty();

      var title = $("<h3>")
        .addClass("d-inline px-3")
        .text(data.name + " (" + new Date().toLocaleDateString() + ")");
      var img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );

      var card = $("<div>");
      var cardBody = $("<div>");
      var cityTemp = $("<p>")
        .addClass("d-inline px-3")
        .text("Temperature: " + data.main.temp + "°F");
      var cityWind = $("<p>")
        .addClass("d-inline px-3")
        .text("Wind speed: " + data.wind.speed + "MPH");
      var cityHumid = $("<p>")
        .addClass("d-inline px-3")
        .text("Humidity: " + data.main.humidity + "%");
      //Adding icon image to weather response
      title.append(img);
      cardBody.append(title, cityTemp, cityHumid, cityWind);
      card.append(cardBody);
      $("#today-cast").append(card);
      userPreferences.location.city = searchTerm;
      storePreferences();

      // Update weatherState string and updateBackground image
      weatherState = data.weather[0].main;
      strSearchTerm = themeState + " " + weatherState;
      getPexelsImage(strSearchTerm, intNumImages);
      // Undo button for weather search
      $("#undo-button").on("click", function () {
        $("#today-cast").hide();
      });
    });
  }
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

      // May want to parameterize image orientation selection, currently landscape.
      $("body").css(
        "background-image",
        "url(" + response.photos[randomNumber].src.landscape + ")"
      );
      $("body").css("background-size", "cover");
      $("body").css("background-repeat", "no-repeat");
      $("body").css("background-position", "center");
      $("body").css("background-attachment", "fixed");
      $("body").css("backdrop-filter", "blur(4px)");
      $("body").css("z-index", "0");
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
      author = "Dad Joke";
      renderPage();
    });
  }

  // gets array of inspirational quotes  can we get random or do we need to use Math.random?
  function inspirationalQuote() {
    $.ajax({
      url: "https://type.fit/api/quotes",
      method: "GET",
    }).then(function (response) {
      response = JSON.parse(response);
      randomIndex = Math.floor(Math.random() * response.length);
      quote = response[randomIndex].text;
      author = response[randomIndex].author;
      if (response[randomIndex].author) {
        author = response[randomIndex].author;
      } else {
        author = "Anonymous";
      }
      renderPage();
    });
  }

  // gets random chuck norris joke
  function chuckNorrisJoke() {
    $.ajax({
      url: "https://api.chucknorris.io/jokes/random",
      method: "GET",
    }).then(function (response) {
      quote = response.value;
      author = "Chuck Norris Joke";

      renderPage();
    });
  }

  // render quote text on the page based on user preferences
  // if quote is too long, find a new quote
  function renderPage() {
    if (quote.length > 120) {
      switchQuoteAPI();
    } else {
      quoteEl.text(quote);
      authorEl.text("- " + author);
      titleEl.text(
        "Digital Coffee: Your Daily Dose of " + userPreferences.quoteType
      );
      
      getPexelsImage(userPreferences.themeType, intNumImages);
    }
  }

  // switch statement to display quote type based on user preferences/settings
  function switchQuoteAPI() {
    switch (userPreferences.quoteType) {
      case "Dad Jokes":
        dadJoke();
        break;
      case "Inspiration":
        inspirationalQuote();
        break;
      case "Chuck Norris Jokes":
        chuckNorrisJoke();
        break;
      case "Taylor Swift Quotes":
        taylorSwiftQuote();
        break;
      case "Ron Swanson Quotes":
        ronSwansonQuote();
        break;
    }
  }
  // function to initialize user preferences from local storage
  function initPreferences() {
    let storedPreferences = JSON.parse(
      localStorage.getItem("storedPreferences")
    );
    if (storedPreferences) {
      userPreferences = storedPreferences;
    }
  }

  // function to store preferences to local storage
  function storePreferences() {
    localStorage.setItem("storedPreferences", JSON.stringify(userPreferences));
  }

  /**
   * keypressHandler(evt)
   * An input handler function, called by a document.on('keypress') eventlistener
   * Add hooks to process different keyboard input events as necessary
   * Parameter: evt
   * Description:  The event containing the key pressed, among other things.
   */
  function keypressHandler(evt) {
    switch (evt.which) {
      case 126: // tilde "~"" key
        tildeEventHandler();
    }
  }

  /**
   * tildeEventHandler
   * Desc: An example specific keypress event handler
   **/
  function tildeEventHandler() {
    // Do tilde-specific things here.
  }

  function taylorSwiftQuote() {
    $.ajax({
      url: "https://api.taylor.rest/",
      method: "GET",
    }).then(function (response) {
      author = "Taylor Swift";
      quote = response.quote;
      renderPage();
    });
  }

  function ronSwansonQuote() {
    $.ajax({
      url: "https://ron-swanson-quotes.herokuapp.com/v2/quotes",
      method: "GET",
    }).then(function (response) {
      author = "Ron Swanson";
      quote = response[0];
      renderPage();
    });
  }

  /**
   * showCredits
   * Desc: A function appending links to creator pages
   */
  function showCredits() {
    var creditsDiv = $("<div>").addClass("fixed-bottom creditDiv");

    var creditFellowsEl = $("<p>")
      .html(
        'Development: <a class="creditLink" href="https://github.com/brhestir" target="_blank">Brian Hestir</a>, <a class="creditLink" href="https://github.com/derrickhardison" target="_blank">Derrick Hardison</a>, <a class="creditLink" href="https://github.com/tonyschwebach" target="_blank">Tony Schwebach</a> and <a class="creditLink" href="https://github.com/ahnlok" target="_blank">Sungpil An</a>'
      )
      .addClass("mt-0 mb-1");
    var creditPexelsEl = $("<p>")
      .html(
        'Photos provided by <a class="creditLink" href="https://www.pexels.com/" target="_blank">Pexels</a>'
      )
      .addClass("m-0");
    $(creditsDiv).append(creditPexelsEl);
    $(creditsDiv).append(creditFellowsEl);

    $("#google-search-bar").append(creditsDiv);
  }

  // FUNCTION CALLS

  // This function appends an element to the body for now due to asynchronous return of .then
  initPreferences();
  switchQuoteAPI();
  showCredits();
  $("#title").hide();

  // EVENT LISTENERS

  // when user changes settings for quote types
  userInputQuoteTypeEl.change(function (event) {
    event.preventDefault();
    userPreferences.quoteType = userInputQuoteTypeEl.val();
    storePreferences();
    switchQuoteAPI();
  });

  // When user changes settings for theme types
  userInputThemeTypeEl.change(function (event) {
    event.preventDefault();
    userPreferences.themeType = userInputThemeTypeEl.val();
    // Update search term based on new themeState selection
    themeState = userInputThemeTypeEl.val();
    strSearchTerm = themeState + " " + weatherState;
    storePreferences();
    switchQuoteAPI();
  });

  // Keyboard event-handler-function eventListener
  $(document).on("keypress", keypressHandler);

  //Function w/ AJAX and Openweather API
  $("#weather-button").on("click", function (event) {
    event.preventDefault();
    var searchTerm = $("#weather-search").val();
    $("#weather-search").val("");
    weatherFunction(searchTerm);
  });

  $("#gear-toggler").on("click", function (event) {
    if (showTitle) {
      showTitle = false;
      $("#title").hide();
    } else {
      showTitle = true;
      $("#title").show();
    }
  });
});
