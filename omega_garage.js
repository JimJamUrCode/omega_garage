var method = omegaGarage.prototype;
// var customGPIO = require('./customGPIO');
var GPIOHelper = require('./gpiohelper');

function omegaGarage() {
  this.relaysStates = {};
  this.relayNames = {};
  this.config = {};
  this.garageDoorsLength = 0;
  this.myGPIO = new GPIOHelper();
}

omegaGarage.prototype.init = function()
{
  try
  {
    this.loadConfigFile();
    
    this.garageDoorsLength = this.config.garageDoors.length;
    
    for(var i = 0; i < this.garageDoorsLength; i++)
    {
      console.log("Creating relay for " + this.config.garageDoors[i].garageName + " garage on pin: " + this.config.garageDoors[i].relayPin);
      this.myGPIO.setPinSync(this.config.garageDoors[i].relayPin, 0);
      
      console.log("Creating sensor input for " + this.config.garageDoors[i].garageName + " garage on pin: " + this.config.garageDoors[i].sensorPin);
      this.myGPIO.setPinSync(this.config.garageDoors[i].sensorPin);
    }
  }
  catch(e)
  {
    console.log("Error initializing: " + e);
  }
};

omegaGarage.prototype.getGarageState = function(garageDoorIndex)
{
  try
  {
    var result = this.myGPIO.getPinSync(this.config.garageDoors[garageDoorIndex].sensorPin);
    var strResult = "";
    if(result == 0)
      strResult = "OPEN";
    else
      strResult = "CLOSED";
    
    console.log("The " + this.config.garageDoors[garageDoorIndex].garageName + " garage is " + strResult);
    return strResult;
  }
  catch(e)
  {
    console.log("Error getting garage state: " + e);
    return "OPEN";
  }
}

omegaGarage.prototype.changeGarageState = function(garageDoorIndex)
{
  try
  {
    console.log("Changing the state of the " + this.config.garageDoors[garageDoorIndex].garageName + " garage.");
    
    this.setRelayState(garageDoorIndex, 1);
    
    var obj = this;
    setTimeout(function()
    {
      obj.setRelayState(garageDoorIndex, 0);
    }, 100);
    
  }
  catch(e)
  {
    console.log("Error changing the garage state: " + e);
  }
};

omegaGarage.prototype.closePins = function()
{
  for(var i = 0; i < this.garageDoorsLength; i++)
  {
    console.log("Closing relay pin: " + this.config.garageDoors[i].relayPin);
    this.myGPIO.closepin(this.config.garageDoors[i].relayPin);
    
    console.log("Closing sensor pin: " + this.config.garageDoors[i].sensorPin);
    this.myGPIO.closepin(this.config.garageDoors[i].sensorPin);
  }
};

omegaGarage.prototype.loadConfigFile = function()
{
  try
  {
    console.log("Loading configuration file...");
    var home = process.env.HOME;
    this.config = require(home + '/omega_garage/config.json');
    console.log("Configuration file loaded...");
  }
  catch (e)
  {
    console.log('Error loading the configuration file:', e);
    process.exit();
  }
};

omegaGarage.prototype.setRelayState = function(garageDoorIndex, value)
{
  this.myGPIO.setPinSync(this.config.garageDoors[garageDoorIndex].relayPin, value);
}

module.exports = omegaGarage;