const Twit = require('twit');
const ObjectsToCsv = require('objects-to-csv');
require('dotenv').config()
const Main = require('./mail');

var T = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

T.get('search/tweets', { q: 'hiring web developer', count:3}, async (err, data, response) => {
    //Twilio authenticaiton
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    
    try {
        const statuses = data.statuses;
        const tweets = [];

        statuses.map(status => {
            tweets.push({
                time: status.created_at,
                text: status.text,
                name: status.user.name,
                screen_name: status.user.screen_name,
                tweet_url: `https://twitter.com/${status.user.screen_name}/status/${status.id_str}`
            });
        });
        if(tweets.length <= 0){
            return console.error('no tweets were found')
        }
        // const csv = await new ObjectsToCsv(tweets)
        // await csv.toDisk('./tweets.csv', { append: true })
        console.log(tweets)
        const email = tweets.map(element => {
            return(
                `<li> 
                    <span>Time: ${element.time}</span><br>
                    <span>Text: ${element.text}</span><br>
                    <span>Name: ${element.name}</span><br>
                    <span>Screen name: ${element.screen_name}</span><br>
                    <span>Link: ${element.tweet_url}<span>
                 </li>
                 `
            ) 
        })
        Main(email)

    } catch(e) {
       console.error(e)
    }

});

