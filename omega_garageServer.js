var express = require('express');
var app = express();
var omegaGarage = require('./omega_garage');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getGarageState/:doorIndex', function (req, res) {
  
  var state = omegaGarage.getGarageState(req.params.doorIndex);
  res.send(state);
});

app.post('/garageDoorCommand/:doorIndex', function (req, res) {
  //req.params.doorIndex
  console.log("Received request to change the state of the garage door: " + req.params.doorIndex);
  
  omegaGarage.changeGarageState(parseInt(req.params.doorIndex));
  
  res.setHeader('Cache-Control', 'no-cache');
  res.send("Done!");
});

app.listen(3000, function () {
  console.log('omega_garage listening on port 3000!');
  omegaGarage.init();
});

process.on('SIGINT', function ()
{
  console.log("Cleaning up pins...");
  omegaGarage.closePins();
  
  process.exit();
});