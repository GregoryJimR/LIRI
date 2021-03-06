//code to grab data from keys.js
var Twitter = require("twitter");
var fs = require("fs");
var SpotifyWebApi = require('node-spotify-api');
var request = require("request");
const keys = require("./keys.js"),
    twitterClient = new Twitter(keys.twitterKeys),
    spotifyClient = new SpotifyWebApi(keys.spotifyKeys);
var inputType = process.argv[2];
var input = "";

function compileInput() {
    //console.log("compiling input: true");
    for (var i = 3; i < process.argv.length; i++) {
        input = input + " " + process.argv[i];
    }
}
// liri.js my-tweets - shows last 20 tweets and when they were created
function tweetIt() {
    var params = { count: "20" };
    var tweetNum = 1;
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                //console.log(tweets[i]);
                console.log("recent tweet " + tweetNum + ": " + tweets[i].text + " ------- Tweeted on: " + tweets[i].created_at);
                tweetNum++;
            }
        }
    });
}
// liri.js spotify-this-song '<song name here>' - Shows the following: [artist, Song's Name, A preview link from spotify, the album]
// if no song, show "The Sign" by Ace of Base
// see node-spotify-api npm
function spotifyIt(input) {
    compileInput();
    //console.log("input: " + input);
    var song;
    if (input === "") {
        song = "The Sign ace of base";
    }
    else {
        song = input;
    }
    spotifyClient.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist Name: " + (data).tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + (data).tracks.items[0].name);
        console.log("Preview Link: " + (data).tracks.items[0].preview_url);
        console.log("Album: " + (data).tracks.items[0].album.name);
    });

}

// liri.js movie-this '<move name here>'
function omdbIt() {
    //console.log("omdbIt");
    compileInput();
    //console.log(input);
    var movieTitle;
    var movieSearch = function() {
        request("http://www.omdbapi.com/?t=" + movieTitle + "=&plot=short&apikey=" + keys.omdbKeys, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year released: " + JSON.parse(body).Year);
                console.log("IMDB rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    };
    if (input === "") {
        movieTitle = "Mr. Nobody";
        movieSearch();
    }
    else {
        movieTitle = input;
        movieSearch();

    }
}

// liri.js do-what-it-says
//     using the fs (install fs and require it), grabs text from random.txt (use read) and spotify's the text
function doIt() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        spotifyIt(dataArr[1]);
    });
}
//create switch here.  Will identify inputType[2] and act accordingly
switch (inputType) {
    case "my-tweets":
        tweetIt();
        //console.log("tweet");
        break;
    case "spotify-this-song":
        spotifyIt();
        //console.log("spotify");
        break;
    case "movie-this":
        omdbIt();
        //console.log("omdb");
        break;
    case "do-what-it-says":
        doIt();
        console.log("do");
        break;
    default:
        console.log("Please try different input");
}
