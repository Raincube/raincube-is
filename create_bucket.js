var request = require('request');
var initialState = require('./initial_state');

initialState.createBucket('test_bucket', null, function(err, resp, body) {
    if (resp.statusCode == 201) {
      console.log('A bucket created on InitialState');
    } else if (resp.statusCode == 204) {
      console.log('The bucket already exists');
    } else {
      console.log('error:' + resp.statusCode + ' ' + body);
    }
  }
);
