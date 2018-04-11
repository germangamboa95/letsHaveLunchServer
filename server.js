var admin = require('firebase-admin');

var admin = require("firebase-admin");

var express = require('express');

var bodyParser = require('body-parser')

var app = express();

var test = require('./test.js');

console.log(test.lorem());

// Database init
var serviceAccount = {
  "type": "service_account",
  "project_id": "letsdolunch-4aacb",
  "private_key_id": "8ae3f105e8c71ff0834dfd7e063094067a7e035c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1RypygoR+R1DK\nZfZzKnz7zKRMQRG5uKMysHOm5wG3elw2w/ucApd2yUS7c3PwoDI8AQdfjL9HM56A\nnmNVsCfzFx339wCAzsbHHCIQrFrxGmhV4M8JXncyTD2jSF2UQIVF6W09+aIAVZXW\nQermK4hW+0Z9rRD8acSWkqqBiIZD5cGNBbHKteo7cACFYu0yjsnGXsbwIW0h8tTX\n4hI+L2W2lQvzFX0S/eDMuf5gQNBc5d+JBmLjSAPqFDBe2y0DeTm7xVMBIVxwgIO7\nAo7FHHqXKeSsn0oz07sBUy4s6aARUl522L+LxGaJaB3hU/Zly5G7nbneYBZh5E+U\nAtUuMFEfAgMBAAECggEAKLs4VOlxpsQUaZ3WbdMWqSc2pXGbb30Gol2WZuKR9q12\nKdIIZ2oHqWeY23uaCe+cyfG7O+NumSuGikTMchT2LP89OxmTUd3kORnfp5pqhrEV\nz3IHYwYIR1NtKBKbADQtHePQqXO9TFDurWk7RAN1C4JDOPrZjbWgN+r1h8xqyrdk\n4NhS9yDtZyEUXkelytQXeOVk1CwhbVTr+OjbJoxl6ou1+DfivTSk68FtgrzOOtjF\nJehU+tgSgF1hoLnMXAiU/KRPvba/071Z3zdKj3y22zpIA5pXXjx7COL73HBZBHre\ne3Q9HVbeevCafbdt1gSSgu9HzpANZ2EsaNfw6ZeujQKBgQDZ764CNAI/FinWvRcI\nHhakEoM50Cjo14lHOn8600I3feJ22YD4+1+4n8PHghIeq4ZV3F6B0kL3gVsCYRfE\np0CcUWWrgHeH0D8BwvmqyETOmJTd5haO74t1ShcnTGTyRM39uL5EAYMvIC8UwGfX\nbhu57MV2d5Pw5SqNN7PK8Z6UUwKBgQDU8G4Aqd7Vn9iRxadYrAX+Tw3b5yqnHy3O\nFKGpEkoIjupTmF68oEXrCy+Ld9vNzSvnrgDh9XAUqv8MoMGAplVnXvbKio42zpDg\nR8I1NGQOkTzsvC8Yj5rI3EFOutMKq+nzBX2Fy7V2jlRHYwDeayz+6ANNyqz1a12U\nduJPmfV2hQKBgHzU+AQVDFBcfpyc9OtWaLuUSww7eqNciip9jFECn0Qv3B8dmO2E\n9yBGixrlG0HsF+docc3ExU0GED49pSKkdrLTQPxKeq0VkHGO3/l9+0OnTGYKHFPF\nTEljpf2BmbTXynIRdxJ3F1BQDAfD6fcQ/9qwj6668cejTItVI6wUWDQ3AoGBAIEZ\n/DeexiGStkU7JsjWExQqbeajcvK8LpNBYvoUwpoJu/xO5zFJotpsf7j5RGS0PihL\nEPHuUrPVMKlBVdBgCGuR4eLOuoZ0GtY/63lCeF90oxGMzqj/eALLtzS6hHV14XOc\nIoxaA30LsgFN/xras/8gP9CMTuzE2YnHwlIsr+vZAoGBAIh+KlDeCaWkrdvrEdsb\nqzJFWrrHU9dPdjw48zQvxOryfZ8E2oGNQrupMjT21e0qaOfALQWCIuXJsf/2yyMA\n4+bnJn3S1loaQiWKao13WJkT7nRV6g6NB4zh7rmy1DsF/AmWcv9qoOitWIgRtX43\nYZr6Qp6kG1O1nyi1dPGsQX+R\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-e1h6g@letsdolunch-4aacb.iam.gserviceaccount.com",
  "client_id": "113450448285659546689",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e1h6g%40letsdolunch-4aacb.iam.gserviceaccount.com"
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letsdolunch-4aacb.firebaseio.com"
});

var db = admin.database();

db.ref('test').set('test');



app.get('/', function(req, res) {
  res.send("Please use the endpoint.");
});

app.get('/test', function(req, res) {
  let data = test.lorem();
  res.send(data);

});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is starting...');
