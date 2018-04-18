const db = require('../database/database.js').db;
const nodemailer = require('nodemailer');


const emailBlast = (trackingCode, data) => {
  db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
    let emailArr = snap.val();
    let params = encodeURI(data.address);
    //let img = results.images[data.place_id];
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
          <div class="card medium mb-2">
            <div class="card-image">
              <img src="${"image goes here"}">
              <span class="card-title">Top choice: <span id="locName">${data.name}</span></span>
              </div>
              <div class="card-content">
                <p>
                  ${data.address}
                </p>
                <div class="card-action">
                  <a class="waves-effect waves-light btn right btn-large green accent-4" href="https://www.google.com/maps/search/?api=1&query=${params}&query_place_id=${data.place_id}">Go There!</a>
                </div>
            </div>
          </div>
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
  let email = req.body.email;
  console.log(req.body , "CHECK ME HERE")
  const trackingCode = req.params.trackingCode;

  if(email != null) {
    db.ref('sessions/'+trackingCode+'/voting_done').once('value', snap => {
      if(!snap.val()){
        db.ref('sessions/' + trackingCode + "/emails").once('value', snap => {
          let emailArr = snap.val();
          emailArr = (emailArr)? emailArr : [];
          console.log(emailArr);
          emailArr.push(email);
          db.ref('sessions/' + trackingCode + "/emails").set(emailArr);
          next();

        });
      } else {
        next();
      }
    });



  } else {
    next();
  }



};



module.exports = {
  addEmail: addEmail,
  emailBlast: emailBlast
}
