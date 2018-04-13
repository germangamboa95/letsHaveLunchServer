const db = require('../database/database.js').db;
const fetch = require('node-fetch');
const googleKey = "AIzaSyBIrnN4jyD-yi9j51E_4xxmpaRVEg2Anvs";

const captureLocations = (data) => {
  let cleanData = data.results;
  return cleanData;
}



// Make me more efficient by removing the nested for loop.
const filterOutGeometry = (data) => {

  let filtered;
  let arr = [];
  data.forEach(obj => {

    let item = {
      "address": obj["vicinity"],
      "id": obj["id"],
      "place_id": obj["place_id"],
      "name": obj["name"],
      "rating": obj["rating"],
      "types": obj["types"],
      "is_open": true,
      "photos": obj["photos"][0].photo_reference

    }
    arr.push(item);
  });
  console.log(arr);
  return arr;
};







const loadLocations = (req, res, next) => {


  let trackingCode = req.params.trackingCode;
  const lat = 28.374160;
  const lon = -81.427695;
  const radius = 1000;

  db.ref("sessions/" + trackingCode).once('value', snap => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&opennow&type=restaurant&keyword=restaurant&key=${googleKey}`)
      .then(res => res.json())
      .then(data => {


        data = captureLocations(data);


        data = filterOutGeometry(data);
        db.ref("sessions/" + trackingCode+"/locations/").set(data);
        res.locals.locationData = data;
        next();
      });
  });
};

module.exports = {
  loadLocations: loadLocations
}