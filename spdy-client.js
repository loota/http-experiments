var spdy = require('spdy');
var http = require('http');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
var agent = spdy.createAgent({
  host: 'localhost',
  port: 443,
 
  // Optional SPDY options 
  spdy: {
    plain: false,
    ssl: false,
 
    // **optional** send X_FORWARDED_FOR 
    'x-forwarded-for': '127.0.0.1'
  }
});
 
var req = http.get({
  host: 'localhost',
  agent: agent
}, function(response) {
    console.log(response.statusCode);
    response.on('data', function(data) {
        console.log(data.toString());
    });
});

req.on('push', function(stream) {
  stream.on('error', function(err) {
      console.log(err);
  });
  stream.on('data', function(data) {
      console.log(data.toString());
  })
  stream.on('end', function() {
      agent.close()
  });
});

req.end();
