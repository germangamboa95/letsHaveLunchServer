const db = require('../database/database.js').db;



const startsession = (req, res, next) => {
  console.log(req)

  let locationCoords = req.body.location;
  console.log(locationCoords);
  let email = req.body.email;
  let guests = req.body.guests;
  db.ref("sessions/").push({
      locationCoords: locationCoords,
      emails: [email],
      guest_qty: guests,
      voting_done: false
    })
    .then(snap => {
      let key = snap.key;
      res.locals.trackingCode = key;
      next();
    });

}

module.exports = {
  startsession: startsession
}
