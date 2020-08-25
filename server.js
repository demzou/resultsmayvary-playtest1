/* eslint-env es6 */

/*
 * Dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');

/*
 * Config
 */
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

/** Services */
const opentok = require('./services/opentok-api');
const broadcast = require('./services/broadcast-api');

/*
 * User Routes
 */

app.get('/', (req, res) => {
  res.redirect('/viewer');
});

app.get('/viewer', (req, res) => {
  opentok.getCredentials('viewer')
    .then(credentials => res.render('pages/viewer', { credentials: JSON.stringify(credentials) }))
    .catch(error => res.status(500).send(error));
});

app.get('/host', (req, res) => {
  opentok.getCredentials('host')
    .then(credentials => res.render('pages/host', { credentials: JSON.stringify(credentials) }))
    .catch(error => res.status(500).send(error));
});

app.get('/guest', (req, res) => {
  opentok.getCredentials('guest')
    .then(credentials => res.render('pages/guest', { credentials: JSON.stringify(credentials) }))
    .catch(error => res.status(500).send(error));
});

app.get('/broadcast', (req, res) => {
  const url = req.query.url;
  const availableAt = req.query.availableAt;
  res.render('pages/broadcast', { broadcast: JSON.stringify({ url, availableAt }) });
});

app.get('*', (req, res) => {
  res.redirect('/viewer');
});

/*
 * API Endpoints
 */
app.post('/broadcast/start', (req, res) => {
  const sessionId = R.path(['body', 'sessionId'], req);
  const streams = R.path(['body', 'streams'], req);
  const rtmp = R.path(['body', 'rtmp'], req);
  broadcast.start(sessionId, streams, rtmp)
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error));
});

app.post('/broadcast/layout', (req, res) => {
  const streams = R.path(['body', 'streams'], req);
  broadcast.updateLayout(streams)
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error));
});

app.post('/broadcast/end', (req, res) => {
  broadcast.end()
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error));
});

/*
 * Listen
 */

//app.listen(process.env.PORT || port, () => console.log(`app listening on port ${port}`));


/*
 * socket.io
 */


const http = require("http");
const server = http.createServer(app);
server.listen(port);


// Setup sockets with the HTTP server
const socketio = require('socket.io');
const { match } = require('assert');
let io = socketio.listen(server);
console.log(`Listening for socket connections on port ${port}`);


// Register a callback function to run when we have an individual connection
// This is run for each individual client that connects
io.sockets.on('connection',
  // Callback function to call whenever a socket connection is made
  function (socket) {
    // Print message to the console indicating that a new client has connected
    console.log("We have a new client: " + socket.id);

    socket.on('mode',
    function(data) {
        //do something when data is received
        console.log("mode :" + data);
        socket.broadcast.emit('mode', data);
      }
    );

    socket.on('question',
    function(data) {
        //do something when data is received
        console.log("question :" + data);
        socket.broadcast.emit('question', data);
      }
    );

    // socket.on('optionsList',
    // function(data) {
    //     //do something when data is received
    //     console.log("options :" + data);
    //     socket.broadcast.emit('optionsList', data);
    //   }
    // );
    
  socket.on('submit1',
  function(data) {
      //do something when data is received
      console.log("submit1: " + data);
      socket.broadcast.emit('submit1', data);
    }
  );

  socket.on('submit2',
  function(data) {
      //do something when data is received
      console.log("submit2: " + data);
      socket.broadcast.emit('submit2', data);
    }
  );

  socket.on('submit9',
  function(data) {
      //do something when data is received
      console.log("submit9: " + data);
      socket.broadcast.emit('submit9', data);
    }
  );

  socket.on('submit12',
  function(data) {
      //do something when data is received
      console.log("submit12: " + data);
      socket.broadcast.emit('submit12', data);
    }
  );

  socket.on('input',
  function(data) {
      //do something when data is received
      console.log("input: " + data);
      socket.broadcast.emit('input', data);
    }
  );

  socket.on('nextStatement',
  function(data) {
      socket.broadcast.emit('nextStatement', data);
    }
  );

  socket.on('statementClicked',
  function(data) {
      socket.broadcast.emit('statementClicked', data);
    }
  );

  // socket.on('example',
  // function(data) {
  //     //do something when data is received
  //   socket.broadcast.emit('example', data);
  //   }
  // );

    
    // Specify a callback function to run when the client disconnects
    socket.on('disconnect',
      function() {
        console.log("Client has disconnected: " + socket.id);
      }
    );
  }
);

