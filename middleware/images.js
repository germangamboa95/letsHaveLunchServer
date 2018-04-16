const db = require('../database/database.js').db;
const fetch = require('node-fetch');
const googleKey = "AIzaSyBIrnN4jyD-yi9j51E_4xxmpaRVEg2Anvs";

const getPhotos = (id, ref, trackingCode) => {
  fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${id}&key=` + googleKey).then(res => res)
    .then(res => {

      url = res.url;
      db.ref("sessions/" + trackingCode + '/images/' + ref).set(url);
    });
};

const loadImages = (req, res, next) => {

  let trackingCode = req.params.trackingCode;
  let data = res.locals.locationData;

  db.ref('sessions/' + trackingCode + '/images').once('value', (snap) => {

    if (snap.val()) {

      next();

    } else {

      data.forEach(item => {
        let id = item["photos"];
        let ref = item['place_id'];
        if(id != 'none') {
          getPhotos(id, ref, trackingCode);
        }

      });

      next();
    }
  });
};


module.exports = {
  loadImages: loadImages
}
