var method = omegaGarage.prototype;
var GPIOHelper = require('./gpiohelper');
var emailClient = require('./emailClient');

relaysStates = [0, 0];
config = {};
garageDoorsLength = 0;
myGPIO = new GPIOHelper();

function omegaGarage() {
  
}

omegaGarage.prototype.init = function()
{
  try
  {
    loadConfigFile();
    
    garageDoorsLength = config.garageDoors.length;
    
    for(var i = 0; i < garageDoorsLength; i++)
    {
      console.log("Creating relay for " + config.garageDoors[i].garageName + " garage on pin: " + config.garageDoors[i].relayPin);
      myGPIO.setPinSync(config.garageDoors[i].relayPin, 0);
      
      console.log("Creating sensor input for " + config.garageDoors[i].garageName + " garage on pin: " + config.garageDoors[i].sensorPin);
      myGPIO.setPinSync(config.garageDoors[i].sensorPin);
    }
    
    emailClient.init(config.UserEmail, config.UserPassword, config.RecipientEmail, config.EmailHost);
    
    setInterval(beginStateUpdates, 5000);
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
    var strResult = "";
    if(relaysStates[garageDoorIndex] == 0)
      strResult = "OPEN";
    else
      strResult = "CLOSED";
    
    console.log("The " + config.garageDoors[garageDoorIndex].garageName + " garage is " + strResult);
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
    console.log("Changing the state of the " + config.garageDoors[garageDoorIndex].garageName + " garage.");
    
    this.setRelayState(garageDoorIndex, 1);
    
    var obj = this;
    setTimeout(function()
    {
      obj.setRelayState(garageDoorIndex, 0);
    }, 1000);
    
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
    console.log("Closing relay pin: " + config.garageDoors[i].relayPin);
    myGPIO.closepin(config.garageDoors[i].relayPin);
    
    console.log("Closing sensor pin: " + config.garageDoors[i].sensorPin);
    myGPIO.closepin(config.garageDoors[i].sensorPin);
  }
};

omegaGarage.prototype.setRelayState = function(garageDoorIndex, value)
{
  myGPIO.setPinSync(config.garageDoors[garageDoorIndex].relayPin, value);
}

////////////////////////////////PRIVATE FUNCTIONS///////////////////////////////
function loadConfigFile()
{
  try
  {
    console.log("Loading configuration file...");
    var home = process.env.HOME;
    config = require(home + '/config.json');
    console.log("Configuration file loaded..." + JSON.stringify(config));
  }
  catch (e)
  {
    console.log('Error loading the configuration file:', e);
    process.exit();
  }
};

function beginStateUpdates()
{
  updateGarageState(0);
  updateGarageState(1);
}

function updateGarageState(garageDoorIndex)
{
  try
  {
    console.log("Updating garage door states");
    
    var result = myGPIO.getPinSync(config.garageDoors[garageDoorIndex].sensorPin);

    if(result != relaysStates[garageDoorIndex])//If the state of the garage has changed, then notify the user.
    {
      var subject = config.garageDoors[garageDoorIndex].garageName + " changed state";
      var message = "The " + config.garageDoors[garageDoorIndex].garageName + " garage has changed state...";
    
      emailClient.sendEmail(subject, message);
    }
    
    relaysStates[garageDoorIndex] = result;    
  }
  catch(e)
  {
    console.log("Error getting garage state: " + e);
  }
}
module.exports = new omegaGarage();
