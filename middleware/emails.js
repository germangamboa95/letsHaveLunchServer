const db = require('../database/database.js').db;


const addEmail = (req, res, next) => {
  const email = req.body.email;
  const trackingCode = req.params.trackingCode;
  db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
    const emailArr = snap.val();
    emailArr.push(email);
    db.ref('sessions/' + trackingCode + "/emails").set(emailArr);

  });
};



module.exports = {
  addEmail: addEmail
}
