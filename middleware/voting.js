const db = require('../database/database.js').db;
const email = require('./emails.js');
//const db = database.db;
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const getWinner = (trackingCode, callback) => {
  db.ref('sessions/'+trackingCode+'/votes').once('value', snap => {
    let results = snap.val();
    let totalVotes = Object.values(results).reduce((acc,cur) => acc+cur);
    //console.log(results, totalVotes);
    let votesArr = Object.values(results).sort((a,b) => b-a);

    let winner = getKeyByValue(results, votesArr[0]);


    db.ref('sessions/'+trackingCode+'/locations').once('value', snap => {
      let winnerData;
      let locationArr = snap.val();
      locationArr.forEach(item => {
        if(item['place_id'] === winner){
          winnerData = item;
        }

      });
      callback(sessionId , winnerData);

    });

  });

}

const tallyVotes = (req, res, next) => {

    let placeId = req.params.placeId;
    let trackingCode = req.params.trackingCode;
    db.ref('sessions/' + trackingCode + "/voting_done").once('value', snap => {
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


  db.ref('sessions/'+sessionId+'/voting_done').once('value', snap => {
    if(!snap.val()){
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
               getWinner(sessionId, email.emailBlast);

            });
          }
        });

      });
      }
    });




}


module.exports = {
  tallyVotes: tallyVotes,
  votingDone: votingDone
}
