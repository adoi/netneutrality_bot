console.log('Initial start');

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

// var firstTweet = {
//     status: '#NetNeutrality from the bot'
// }

// T.post('statuses/update', firstTweet, function(err, data, response){
//     if(err){
//         console.log('Error Ocurred');
//     }else{
//         console.log('Status posted successfully.');
//     }
// });

// The 'favorite' feature
var favoriteTweet = function(){
    var params = {
        q: '#NetNeutrality',
        result_type: 'recent',
        lang: 'en'
    }

    T.get('search/tweets', params, function(err, data){
        var foundTweet = data.statuses;
        var randomTweet = randomTw(foundTweet);

        if(typeof randomTweet != 'undefined'){
            T.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
                if(err){
                    console.log('Error Ocurred. Cannot favorite tweet');
                }else{
                    console.log('Favorited from the bot.');
                }
            });
        }
    });
}

function randomTw(arr){
    var index = Math.floor(Math.random()*arr.length);
    return arr[index];
}

favoriteTweet();

setInterval(favoriteTweet, 10000*6*10);


//The 'Reply' feature
var stream = T.stream('user');

stream.on('follow', function(eventMsg){
    console.log('Followed! ...');

    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;

    tweetThis('@'+screenName+' Hi '+screenName+', thanks for following me. The internet needs us! We are fighting for Net Neutrality.\n' + 
    'Go to https://www.battleforthenet.com to learn more.\n\n' +
    '//This is a bot created to help raise awareness for Net Neutrality.')
});

function tweetThis(text){
    var tweet = {
        status: text
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response){
        if(err){
            console.log("Error Ocurred!");
        }else{
            console.log('It worked');
        }
    }
}


