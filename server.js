// requires go here

const express = require('express');

const bodyParser = require('body-parser');

const fetch = require('node-fetch');

const app = express();

const voting = require('./middleware/voting.js');

const db = require('./database/database.js').db;

const emails = require("./middleware/emails.js");

const sessions = require("./middleware/sessions.js");

const locations = require('./middleware/locations.js');

const images = require('./middleware/images.js');

// middleware goes here
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.get('/', function(req, res,){
  res.send('Use the api endpoints!')
});



// init session
app.use('/api/session_start', sessions.startsession)
app.post('/api/session_start', (req, res) => {
  let data = res.locals.trackingCode;
  res.json(data);

});

//Location data point
app.use('/api/:trackingCode/load_location_data', locations.loadLocations);
app.use('/api/:trackingCode/load_location_data', images.loadImages);
app.get('/api/:trackingCode/load_location_data', (req, res) => {
  let trackingCode = req.params.trackingCode;

    db.ref('sessions/'+trackingCode+'/locations').once('value', snap => res.json(snap.val()))

});

app.get('/api/:trackingCode/load_images', (req, res) => {
  let trackingCode = req.params.trackingCode;
  db.ref('sessions/'+trackingCode+'/images').once('value', snap => {
    let images = snap.val();
    let arr = [];
    for(let i in images) {
      let obj = { [i] : images[i]};
      arr.push(obj);

    }

    res.json(arr);
  });
});

app.use('/api/:trackingCode/email_add', emails.addEmail);

//  Add email
app.post('/api/:trackingCode/email_add', (req, res) => {

      voting.votingDone(req,res);
      res.json('email added succesfully');
});

// Tally votes middleware
app.use('/api/:trackingCode/vote/:placeId', voting.tallyVotes);

//Voting endpoint
app.post('/api/:trackingCode/vote/:placeId', (req, res) => {
  let trackingCode = req.params.trackingCode;
  db.ref("sessions/" + trackingCode + '/votes').once('value', snap => {
    res.json(snap.val());
  });



});

app.get('/api/:trackingCode/get_res', (req, res) =>{
  let trackingCode = req.params.trackingCode;
  db.ref('sessions/'+trackingCode).once('value', snap => {
    res.json(snap.val());
  });


});


const port = process.env.PORT || 3500;

app.listen(port);
console.log('Server is starting...', port);
