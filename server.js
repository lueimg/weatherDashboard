var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    session = require('express-session'),
    path    = require("path"),
    multipart  = require('connect-multiparty'),
    fs = require('fs'),
    mime = require('mime');

// config file
require('./server/core/config.js')(app, express, bodyParser, multipart);

// Show the main html in the app
app.get('/', function (req, res) {
  try {
    res.sendFile(path.join(__dirname+'/public/index.html'));
  } catch (err){
    console.log(err);
    res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
  }
});

app.listen(9990, function () {
  console.log('Public server  running at port 9990');
  console.log('http://localhost:9990');
});