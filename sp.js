fs = require('fs');
spdy = require('spdy');
var options = {
  key: fs.readFileSync('/root/server.key'),
  cert: fs.readFileSync('/root/server.crt'),
  ca: fs.readFileSync('/root/server.csr')
};
spdy.createServer(options, function(req, res) {
  switch(req.url){
    case "/":
      res.writeHead(200, {
          "Pragma": "public",
          "Cache-Control": "max-age=86400",
          "Expires": new Date(Date.now() + 86400000).toUTCString(),
          "Content-Type": 'text/html'});
      res.push('/main.js', {'content-type': 'application/javascript'}, function(err, stream) {
        stream.end('document.body.innerHTML += ("hello from main.js via push stream!")');
      });
      res.end('<html><head></head><body>Haaaello World!'
             //+ '<script src="/sse.js">' 
          
              + '<script src="main.js"></script>'
              + '<script src="tuuba.js"></script>'
              //+ "<script> var xhr = new XMLHttpRequest(); xhr.setRequestHeader('Accept:', '*/*'); xhr.open('GET', 'main.js', true); xhr.onload = function() { document.body.innerHTML += 'haettu mainjs: ' + this.response + '<br />'; }; xhr.send();</script>"
              + '</body></html>'
              );
      break;
    case "/main.js":
      res.writeHead(200, {
          "Pragma": "public",
          "Cache-Control": "max-age=86400",
          "Expires": new Date(Date.now() + 86400000).toUTCString(),
          "Content-Type": 'application/javascript'});
      console.log('hmm');
      res.end('the fak');
      break;
    case "/tuuba.js":
      res.end('console.log("tuuba")');
      break;
    case "/resource-events":
      res.setHeader('Content-Type', 'text/event-stream');
      res.end('data:/main.js\n\n');
      break;
    case "/sse.js":
      res.end(fs.readFileSync('/home/heikki/projects/http2/sse.js'));
      break;
    case "/interval":
      res.setHeader('Content-Type', 'text/event-stream');

      messageId = 1;
      setInterval(function(){
        // push a simple JSON message into client's cache
        var msg = JSON.stringify({'msg': messageId});
        var resourcePath = '/resource/'+messageId;
        res.push(resourcePath, {}, function(err, stream) { stream.end(msg) });

        // notify client that resource is available in cache
        res.write('data:'+resourcePath+'\n\n');
        messageId+=1;
      }, 2000);
      break;
    default:
      res.end('none');
      break;
  }
}).listen(443);
