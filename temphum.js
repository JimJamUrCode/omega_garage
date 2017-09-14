var exec = require('child_process').exec;

var mTemp;
var mHum;
var mTempInC;

function temphum()
{
  console.log("Initializing the temperature and humidity module");
  
  mTemp = 0;
  mHum = 0;
  mTempInC = false;
  
  updateTempHum();
  setInterval(updateTempHum, 30000);
}

function updateTempHum()
{
  exec("/tmp/omega_garage/checkHumidity/bin/checkHumidity 19 DHT22", getTempHumCallback);
}

function getTempHumCallback(error, stdout, stderr)
{
  if(error)
    console.log("Error getting temperature and humidity: " + JSON.stringify(error));
  else if(stderr)
    console.log("Error getting temperature and humidity: " + JSON.stringify(stderr));
  else
  {
    var values = stdout.split("\n");
    
    mTemp = values[0];
    mHum = values[1];
    
    console.log("Garage Temperature is: " + getTemp() + " " + getTempUnits());
    console.log("Garage Humidity is: " + mHum);
  }
}

function getTemp()
{
  if(mTempInC)
    return mTemp;
  else
  {
    return mTemp * 9/5 + 32;
  }
}

function getTempUnits()
{
  if(mTempInC)
    return "C";
  else
    return "F";
}

//////////////////////////////////PUBLIC FUNCTIONS///////////////////////////////////
temphum.prototype.getTemp = function (command)
{
  return getTemp();
}

temphum.prototype.getTempUnits = function ()
{
  getTempUnits();
}

temphum.prototype.getHum = function (command)
{
  return mHum;
}

module.exports = new temphum();