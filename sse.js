var source = new EventSource('/resource-events');
//var source = new EventSource('/interval');

source.onmessage = function(e) {
  document.body.innerHTML += "SSE notification: " + e.data + '<br />';

  // fetch resource via XHR... from cache!
  var xhr = new XMLHttpRequest();
  console.log(e.data);
  xhr.open('GET', e.data);
  xhr.onload = function() {
    document.body.innerHTML += "Message: " + this.response + '<br />';
  };

  xhr.send();
  source.close();
};
