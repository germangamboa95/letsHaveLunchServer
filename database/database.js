const admin = require("firebase-admin");
const config = require("./dbconfig.js")
// Database init
var serviceAccount =  config.firekey;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letsdolunch-4aacb.firebaseio.com"
});


module.exports = {
  db: admin.database()
}
