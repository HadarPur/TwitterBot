console.log('Twitter bot start running :)');

// require the dependency and config.js file
var twit = require('twit');
var config = require('./config.js');
var fs = require('fs');

// Pass the configuration (consumer and access tokens) of our Twitter application in config.js to twit
var Twitter = new twit(config);

//  filter by keywords
var stream = Twitter.stream('statuses/filter', { track: ['federer', 'rogerfederer'] });

stream.on('tweet', retweet);

// RETWEET BOT
function retweet(tweet) {

    if (tweet){
        //Retweets the tweet containing the keywords
        var nameID = tweet.id_str;

        // Post a gif with a mention to the tweet author
        var name = tweet.user.screen_name;

        var b64content = fs.readFileSync(process.cwd() + "/federer.gif", { encoding: 'base64' });

        Twitter.post('media/upload', {media: b64content}, function(err, data, res) {
            if (err) console.log(err);
            console.log(data);
            Twitter.post('statuses/update', {status: 'GO Federer!!', media_ids: data.media_id_string}, function(err, params, res) {
                if (err) console.log(err);
                console.log(params);
            });
        });


         Twitter.post('statuses/retweet', { id: nameID }, retweeted);
         console.log('Attempting to retweet ' + tweet.id_str + ": " + tweet.text);

        // retweet callback
        function retweeted(err, data, response) {
            if (err) {
                console.log("Error: " + err.message);
            } else {
                console.log('Retweeted: ' + tweet.id);
            }
        }

    }
}