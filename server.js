// requires go here

const express = require('express');

const bodyParser = require('body-parser');

const fetch = require('node-fetch');

const app = express();

const nodemailer = require('nodemailer');

const voting = require('./middleware/voting.js');

const db = require('./database/database.js').db;

const emails = require("./middleware/emails.js");

const sessions = require("./middleware/sessions.js");

const locations = require('./middleware/locations.js');

const images = require('./middleware/images.js');

// middleware goes here
app.use(bodyParser.json());

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
  db.ref('sessions/'+trackingCode+'/locations/images').once('value', snap => res.json(snap.val()))
});

//  End voting tracker this has to be here for some reason...
app.use('/api/:trackingCode/', voting.votingDone);

//  Add email
app.post('/api/:trackingCode/email_add', (req, res) => {
      emails.addEmail(req, res);
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


const port = process.env.PORT || 3000;

app.listen(port);
console.log('Server is starting...', port);
