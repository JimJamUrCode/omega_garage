var express = require('express');
var app = express();
var omegaGarage = require('./omega_garage');
var temphum = require('./temphum');

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

app.get('/getTemperature', function (req, res) 
{
  var obj = {
    temp: temphum.getTemperature() + " " + temphum.getTempUnits(),
  }
  
  console.log("Responding to a request for the temperature..." + obj.temp);
  res.json(obj);
});

app.get('/getHumidity', function (req, res)
{  
  var obj = {
    hum: temphum.getHumidity() + " %RH",
  }
  
  console.log("Responding to a request for the temperature..." + obj.hum);
  res.json(obj);
});

app.get('/getAllDetails', function (req, res)
{  
  var obj = {
    temp: temphum.getTemperature() + " " + temphum.getTempUnits(),
    hum: temphum.getHumidity() + " %RH",
    garageStates: omegaGarage.getAllGarageStates()
  }
  
  console.log("Responding to a request for all the details..." + JSON.stringify(obj));
  res.json(obj);
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