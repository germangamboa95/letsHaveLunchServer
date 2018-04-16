const db = require('../database/database.js').db;
const nodemailer = require('nodemailer');


const emailBlast = (trackingCode, winner) => {
  db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
    let emailArr = snap.val();
    emailArr.forEach(email => {
      console.log(email);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'letsdolunchresults@gmail.com',
          pass: 'Germanisntgerman'
        }
      });

      var mailOptions = {
        from: 'letsdolunchresults@gmail.com',
        to: email,
        subject: 'Lunch is ready!',
        html:
        `
          <div style="width:360px; margin: 10px auto;">
          <h1>Below is where we are having lunch:</h1>
          <h2>${winner.name}</h2>
          <p>Address: ${winner.address}</p>
          <p>Rating: ${winner.rating}</p>
          </div>


        `
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    });

  });
}


const addEmail = (req, res, next) => {
  const email = req.body.email;
  console.log(req.body , "CHECK ME HERE")
  const trackingCode = req.params.trackingCode;

  if(email != null) {
    db.ref('sessions/'+trackingCode+'/voting_done').once('value', snap => {
      if(!snap.val()){
        db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
          const emailArr = snap.val();
          console.log(emailArr);
          emailArr.push(email);
          db.ref('sessions/' + trackingCode + "/emails").set(emailArr);
          next();

        });
      } else {
        next();
      }
    });



  }



};



module.exports = {
  addEmail: addEmail,
  emailBlast: emailBlast
}
