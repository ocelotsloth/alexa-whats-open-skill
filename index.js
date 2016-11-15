var alexa = require('alexa-app');
var Client = require('node-rest-client').Client;
var Fuse = require('fuse.js');
var moment = require('moment')

var client = new Client();
var url = "https://whatsopen.gmu.edu/api/facilities/?format=json"

var facilities = require('./data.json');

//client.get(url, function (data, response) {
//  facilities = data;
//}, facilities)

var searchFacilities = function(facilities, location) {
  var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: [
      "name",
      "location"
    ]
  }
  var fuse = new Fuse(facilities, options); // "list" is the item array
  return fuse.search(location);
}

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('whatsopen-gmu');
app.launch(function(req, res) {
  res.say("Hello World!!").shouldEndSession(false);
});
app.intent('OpenNowIntent', {
    "slots":{"LOCATION":"LITERAL"}
    ,"utterances":["Is {southside|ikes|panera|LOCATION} open"]
  },function(req,res) {

    var today = new Date();
    var dayNum = today.getDay();

    var result = searchFacilities(facilities, req.slot('LOCATION'));

    var resultMainHours = result[0].main_schedule.open_times;
    console.log(resultMainHours.length);
      // last_modified: '2016-08-29T15:00:29.781Z',
      // schedule: 465,
      // start_day: 0,
      // start_time: '07:00:00',
      // end_day: 0,
      // end_time: '19:00:00' }<Paste>

    for (i = 0; i < resultMainHours.length; i++) {
	  // check to see if before hours
	  console.log(i);
      startTime = moment(resultMainHours[i].start_time, 'HH:mm:ss');
	  endTime = moment(resultMainHours[i].end_time, 'HH:mm:ss');
	  if (dayNum >= resultMainHours[i].start_day && dayNum <= resultMainHours[i].end_day) {
		if (moment().isBefore(startTime)) {
		  res.say(req.slot('LOCATION') + ' will open ' + startTime.fromNow());
		}
		else if (moment().isAfter(startTime) && moment().isBefore(endTime)) {
		  res.say(req.slot('LOCATION') + ' is open and will close ' + endTime.fromNow());
		}
		else {
		  res.say(req.slot('LOCATION') + ' is closed for the day');
		}
		break;
      }
    }
  }
);
module.exports = app;
exports.handler = app.lambda();
