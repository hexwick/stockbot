var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
 
var app = express();
var port = process.env.PORT || 1337;


var SUCCESS = 'SUCCESS'

var UP = '2ECC71' // GREEN color
var DOWN = 'C0392B' // RED color

var ARROW_UP = ':stock_up:'
var ARROW_DOWN = ':stock_down:'

 
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
 
// test route
app.get('/', function (req, res) { res.status(403).send('Try /stock instead'); });
 
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

app.post('/stock', function (req, res, next) {
    URL = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=" + req.body.text
    request(URL, function(error, response, request_body) {
        json_body = JSON.parse(request_body)
        if (json_body.Status == SUCCESS) {
            return res.status(200).json(create_response_payload(json_body));
        }
    });
});

function create_response_payload(json_body) {
    var COLOR = '';
    var ARROW = '';

    if (json_body.Change < 0) {
        ARROW = ARROW_DOWN
        COLOR = DOWN
    } else {
        ARROW = ARROW_UP
        COLOR = UP
    }

    return {
    "response_type": "in_channel",
    "mrkdwn": true,
    "text" : ARROW + " " + json_body.Name + " (" + json_body.Symbol + ")",
    "attachments" : [{
        "fallback": json_body.Name + " Stock Information - https://www.google.com/finance?q=" + json_body.Symbol,
        "title": json_body.Name + " Stock Information",
        "text": "*" + json_body.LastPrice.toString() + "* " + Math.round(json_body.Change * 100) / 100 + " ("
        + Math.round(json_body.ChangePercent * 100) / 100 + "%)\n" + json_body.Timestamp,
        "title_link": "https://www.google.com/finance?q=" + json_body.Symbol,
        "color": COLOR,
        "mrkdwn_in": ["text"]
    }]
 };
}
