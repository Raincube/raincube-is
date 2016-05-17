//
// Sample Smart module for Initial State
//

var http = require("http");
var https = require("https");
var url = require("url");
var crypto = require("crypto");
var initialState = require('./initial_state');

// You need to change evt_url and key according to your smart module setting.
// See more detail http://dev.tinkermode.com/tutorials/smart_module.html
var evt_url = process.env.EVENT_URL || "https://YOUR_HEROKU_INSTALLATION.herokuapp.com/evt";
var evt_key = process.env.EVENT_KEY || 'SMART_MODULE_KEY_FROM_MODE';

var route = {
  "/evt" : function(req, res, body) {
    console.log('/evt is called:' + body);
    var sig = req.headers['x-mode-signature'];
    if (!checkWebhookSignature(evt_url, body, sig)) {
      console.log('signature mismatched');
      res.writeHeader(403, {"Content-Type": "text/plain"});
      res.write("Signature doesn't match: " + sig);
      res.end();
      return;
    }
    var event = JSON.parse(body);
    console.log(event);
    var value = event.eventData;
    console.log(value);
    initialState.sendEvent('test_bucket', value, function(err, res, body) {
      console.log('InitialState response code:' + res.statusCode.toString());
    });
  }
}

function checkWebhookSignature(_url, body, signature) {
  var hmac = crypto.createHmac('sha256', evt_key)
  hmac.update(_url + body);
  var h = hmac.digest('hex');
  return signature == h
}

function handler_post(req, res, handler) {
  var body = '';

  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    handler(req, res, body);
    res.writeHeader(200, {"Content-Type": "text/plain"});
    res.end();
  });

}

function post(req, res) {
  var path = url.parse(req.url, true).pathname;
  var handler = route[path];
  if (req.method == 'GET') {
    if (path == '/create_bucket') {
      // Ideally, this action should be done by POST, but GET is easy to call from browser.
      initialState.createBucket('test_bucket', null, function(err, resp, body) {
        var msg = "";
        if (resp.statusCode == 201) {
          msg = 'A bucket created on InitialState';
        } else if (resp.statusCode == 204) {
          msg = 'The bucket already exists';
        } else {
          msg = 'error:' + resp.statusCode + ' ' + body;
        }
        res.writeHeader(405, {"Content-Type": "text/plain"});
        res.write(msg);
        res.end();
      });
    } else {
      res.writeHeader(404, {"Content-Type": "text/plain"});
      res.write("Not Found: " + path);
      res.end();
    }
  } else if (req.method != 'POST') {
    res.writeHeader(405, {"Content-Type": "text/plain"});
    res.write("Method Not Allowed: " + req.method);
    res.end();
  } else if (handler === undefined) {
    res.writeHeader(404, {"Content-Type": "text/plain"});
    res.write("Not Found: " + path);
    res.end();
  } else {
    handler_post(req, res, handler);
  }
}

var app_port = process.env.PORT || 8000;

http.createServer(function(req, res){
  post(req, res);
}).listen(app_port);
