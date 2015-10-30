var express = require('express'),
    app = express();
app.use(express.bodyParser());

var PRODUCTS = [
    {"id":"1", "keyword":"red", "file":"img/1.jpg", "name":"First Item"},
    {"id":"2", "keyword":"blue", "file":"img/2.jpg", "name":"Second Item"},
    {"id":"3", "keyword":"mobile", "file":"img/3.jpg", "name":"Third Item"},
    {"id":"4", "keyword":"accessory", "file":"img/4.jpg", "name":"Fourth Item"},
    {"id":"5", "keyword":"red mobile", "file":"img/5.jpg", "name":"Fifth Item"},
    {"id":"6", "keyword":"blue mobile", "file":"img/6.jpg", "name":"Sixth Item"},
    {"id":"7", "keyword":"red accessory", "file":"img/7.jpg", "name":"Seventh Item"},
    {"id":"8", "keyword":"blue accessory", "file":"img/8.jpg", "name":"Eighth Item"},
    {"id":"9", "keyword":"red blue", "file":"img/9.jpg", "name":"Ninth Item"},
    {"id":"10", "keyword":"mobile accessory", "file":"img/10.jpg", "name":"Tenth Item"}
];

// No-brainer auth: server will authenticate with
// username "dev" and password "moravia", respond
// with a token, and forget the token when restarted.

var currentToken;
app.post('/auth.json', function(req, res) {

  var body = req.body,
      username = body.username,
      password = body.password;

  if (username == 'moravia' && password == 'argentina') {
    // Generate and save the token (forgotten upon server restart).
    currentToken = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    res.send({
      success: true,
      token: currentToken
    });
  } else {
    res.send({
      success: false,
      message: 'Invalid username/password'
    });
  }
});

function validTokenProvided(req, res) {

  // Check POST, GET, and headers for supplied token.
  var userToken = req.body.token || req.param('token') || req.headers.token;

  if (!currentToken || userToken != currentToken) {
    res.send(401, { error: 'Invalid token. You provided: ' + userToken });
    return false;
  }

  return true;
}

app.get('/products.json', function(req, res) {
  if (validTokenProvided(req, res)) {
    res.send(PRODUCTS);
  }
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000...');
