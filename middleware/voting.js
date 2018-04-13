const db = require('../database/database.js').db;

//const db = database.db;

const tallyVotes = (req, res, next) => {

    let placeId = req.params.placeId;
    let trackingCode = req.params.trackingCode;
    db.ref('sessions/' + sessionId + "/voting_done").once('value', snap => {
      if (!snap.val()) {
        db.ref('sessions/' + trackingCode + '/votes/' + placeId).once('value', (snap) => {

           if (snap.val()) {

            db.ref("sessions/" + trackingCode + '/votes/' + placeId).once('value', snap => {
              console.log(typeof snap.val());
              let count = snap.val();
              count++;
              db.ref("sessions/" + trackingCode + '/votes/' + placeId).set(count);

            });
            next();
          } else {
            console.log('I do not exist');
            let num = 1;
            db.ref("sessions/" + trackingCode + '/votes/' + placeId).set(num);
            next();
          }

        });

      } else {
        next();
      }
    });
}



const votingDone = (req, res, next) => {
  sessionId = req.params.trackingCode;
  console.log(sessionId);
  db.ref('sessions/' + sessionId + '/emails').once('value', (snap) => {
    let emailsAmt = snap.val();
    emailsAmt = emailsAmt.length;
    db.ref('sessions/' + sessionId + '/guest_qty').once('value', snap => {
      let limit = snap.val();
      limit = parseInt(limit);
      if (emailsAmt >= limit - 1) {
        db.ref('sessions/' + sessionId + "/voting_done").once('value', snap => {
          db.ref('sessions/' + sessionId + "/voting_done").set(true);
          console.log('voting done');
        });
      }
    });
    next();
  });
}


module.exports = {
  tallyVotes: tallyVotes,
  votingDone: votingDone
}
