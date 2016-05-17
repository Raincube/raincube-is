var initialState = require('./initial_state');

function callback(err, resp, body) {
  if (resp.statusCode >= 200 && resp.statusCode < 300) {
    console.log('success:' + resp.statusCode);
  } else {
    console.log('error:' + resp.statusCode + ' ' + body);
  }
};

var args = process.argv.slice(2)
var value;
if (args.length > 0) {
  value = args[0];
} else {
  console.log('Usage: node write_data.js <value>')
  return 1;
}
initialState.sendEvent('test_bucket', 'temperature', value, callback);
