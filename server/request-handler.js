/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
let ericsLoveNotes = {};
ericsLoveNotes.results = [{ objectId: 1, username: "dk", text: 'yo', roomname: 'lobby' }];
let id = 2;
var fs = require('fs');
var path = require('path');
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function (request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // headers['Content-Type'] = 'text/plain';
  // headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.


  // handle route classes/messages
  var regex = `/username/g`;
  if (request.method === 'GET' && request.url === '/' || request.url.includes('username')) {
    fs.readFile(path.join(__dirname, '../client/index.html'), function (err, data) {
      if (err) {
        console.error('Houston, we have a problem!', err);
      } else {
        headers['Content-Type'] = 'text/html';
        headers['charset'] = 'utf-8';
        response.writeHead(200, headers);
        response.end(data);
      }
    });
  } else if (request.method === 'GET' && request.url === '/styles.css') {
    // do stuff
    fs.readFile(path.join(__dirname, '../client/styles/styles.css'), function (err, data) {
      if (err) {
        console.error('Style Sad', err);
      } else {
        headers['Content-Type'] = 'text/css';
        headers['charset'] = 'utf-8';
        response.writeHead(200, headers);
        response.end(data);
      }
    });
  } else if (request.method === 'GET' && request.url === '/bower_components/jquery/dist/jquery.js') {
    fs.readFile(path.join(__dirname, '../client/bower_components/jquery/dist/jquery.js'), (err, data) => {
      if (err) {
        console.error('Find jquery', err);
      } else {
        headers['Content-Type'] = 'application/javascript';
        headers['charset'] = 'utf-8';
        response.writeHead(200, headers);
        response.end(data);
      }
    });
  } else if (request.method === 'GET' && request.url === '/client/scripts/app.js') {
    fs.readFile(path.join(__dirname, '../client/scripts/app.js'), (err, data) => {
      if (err) {
        console.error('Try app.js again', err);

      } else {
        headers['Content-Type'] = 'application/javascript';
        headers['charset'] = 'utf-8';
        response.writeHead(200, headers);
        response.end(data);
      }
    });
  } else if (request.method === 'GET' && request.url === '/client/images/spiffygif_46x46.gif') {
    fs.readFile(path.join(__dirname, '../client/images/spiffygif_46x46.gif'), (err, data) => {
      if (err) {
        console.error('Try gif again', err);

      } else {
        headers['Content-Type'] = 'image/gif';
        response.writeHead(200, headers);
        response.end(data);
      }
    });
  } else if (request.method === 'GET' && request.url === '/ericsdirtysecret') {
    headers['Content-Type'] = 'text/plain';
    response.end('he loves bell peppers');
  } else if (request.method === 'GET' && request.url === '/rickandmorty') {
    headers['Content-Type'] = 'text/plain';
    response.end('Pickle Rick! Unity! Council of Ricks! Loser!');
  } else if (request.method === 'GET' && request.url === '/eric') {
    headers['Content-Type'] = 'text/html';
    headers['charset'] = 'utf-8';
    response.writeHead(statusCode, headers);
    response.end('<img src="https://media.tenor.com/images/1b2c509c673b603557eedf392c9f3d96/tenor.gif"></img><img src="https://i.ytimg.com/vi/dHGrAsCQWhg/maxresdefault.jpg"></img>');
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(ericsLoveNotes));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    // user input
    let message = '';
    // getting the stream of data
    request.on('data', chunk => {
      message += chunk.toString();
    });
    // after getting all of the data stream
    request.on('end', () => {
      // parse the message
      let parsedMessage = JSON.parse(message);
      parsedMessage.objectId = id;
      id++;
      if (parsedMessage.username && parsedMessage.text) {
        headers['Content-Type'] = 'application/json';
        response.writeHead(201, headers);
        ericsLoveNotes.results.push(parsedMessage);
        response.end(JSON.stringify(ericsLoveNotes));
      } else {
        headers['Content-Type'] = 'text/plain';
        response.writeHead(400, headers);
        response.end('GTFO');
      }
    });
  } else {
    // nonexistent endpoint
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    console.log(request.url);
    response.end('I dunno');
  }

};



module.exports.requestHandler = requestHandler;
