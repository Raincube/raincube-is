var request = require('request');

var accessKey = process.env.INITIAL_STATE_ACCESS_KEY || 'YOUR_INITIAL_STATE_ACCESS_KEY';

module.exports = {
  createBucket: function(bucketKey, bucketName, callback) {
    var data = {
      bucketKey: bucketKey
    };
    if (bucketName != null) {
      data['bucketName'] = bucketName;
    }
    var options = {
      method: 'post',
      url: 'https://groker.initialstate.com/api/buckets',
      headers: {
        'X-IS-AccessKey': accessKey,
      },
      json: true,
      body: data
    };
    request(options, callback);
  },

  sendEvent: function(bucketKey, key, value, callback) {
    var hash = {};
    hash['key'] = key;
    hash['value'] = value.toString();
    var options = {
      method: 'post',
      url: 'https://groker.initialstate.com/api/events',
      headers: {
        'X-IS-AccessKey': accessKey,
        'X-IS-BucketKey': bucketKey
      },
      json: true,
      body: [hash]
    };
    request(options, callback);
  }
};


