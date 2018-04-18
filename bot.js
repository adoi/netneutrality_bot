console.log("Initial start");

const Twit = require("twit");
const config = require("./config");

const T = new Twit(config);

const firstTweet = {
  status: "#NetNeutrality from the bot"
};

T.post("statuses/update", firstTweet, (err, data, response) => {
  if (err) {
    console.log("Error Ocurred");
  } else {
    console.log("Status posted successfully.");
  }
});

// The 'favorite' feature
const favoriteTweet = function() {
  const params = {
    q: "#NetNeutrality",
    result_type: "recent",
    lang: "en"
  };

  T.get("search/tweets", params, (err, data) => {
    let foundTweet = data.statuses;
    let randomTweet = randomTw(foundTweet);

    if (typeof randomTweet != "undefined") {
      T.post(
        "favorites/create",
        { id: randomTweet.id_str },
        (err, response) => {
          if (err) {
            console.log("Error Ocurred. Cannot favorite tweet");
          } else {
            console.log("Favorited from the bot.");
          }
        }
      );
    }
  });
};

function randomTw(arr) {
  let index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

favoriteTweet();

setInterval(favoriteTweet, 10000 * 6 * 10);

//The 'Reply' feature
const stream = T.stream("user");

stream.on("follow", eventMsg => {
  console.log("Followed! ...");

  let name = eventMsg.source.name;
  let screenName = eventMsg.source.screen_name;

  tweetThis(
    "@" +
      screenName +
      " Hi " +
      screenName +
      ", thanks for following me. The internet needs us! We are fighting for Net Neutrality.\n" +
      "Go to https://www.battleforthenet.com to learn more.\n\n" +
      "//This is a bot created to help raise awareness for Net Neutrality."
  );
});

function tweetThis(text) {
  const tweet = {
    status: text
  };

  T.post("statuses/update", tweet, tweeted);

  function tweeted(err, data, response) {
    if (err) {
      console.log("Error Ocurred!");
    } else {
      console.log("It worked");
    }
  }
}
