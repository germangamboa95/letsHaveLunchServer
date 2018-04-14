const db = require('../database/database.js').db;
const nodemailer = require('nodemailer');


const emailBlast = (trackingCode) => {
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
        text: 'That was easy!'
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
  db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
    const emailArr = snap.val();
    emailArr.push(email);
    db.ref('sessions/' + trackingCode + "/emails").set(emailArr);

  });
};



module.exports = {
  addEmail: addEmail,
  emailBlast: emailBlast
}
