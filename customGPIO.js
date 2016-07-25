var method = customGPIO.prototype;
var fs = require("fs");
var path = require("path");

function customGPIO(debug) {
  this._exportpath = "/sys/class/gpio/gpiochip0/subsystem/export";
  this._unexportpath = "/sys/class/gpio/gpiochip0/subsystem/unexport";
  this._gpiopath = "/sys/class/gpio/gpio";
  this.debug = debug;
}

customGPIO.prototype.writetofs = function(fname, data)
{
  try
  {
    fs.writeFileSync(fname, data);
    this.log("The file was saved!");
  }
  catch(e)
  {
    this.log("Error writing to file: " + e);
  }
};

customGPIO.prototype.readfromfs = function(fname)
{
  try
  {
    var contents = fs.readFileSync(fname, 'utf8');
    return contents;
  }
  catch(e)
  {
    this.log("Error reading from file: " + e);
    return "0";
  }
};

customGPIO.prototype.initpin = function(pin, direction, callback)
{
  this.log("Exporting Pin.");
  this.writetofs(this._exportpath, pin);
  
  this.log("Setting direction of pin.");
  this.writetofs(this._gpiopath + pin + '/direction', direction);
};

customGPIO.prototype.readinput = function(pin)
{
  rdval = this.readfromfs(this._gpiopath + '' + pin + '/value');
  return rdval;
};

customGPIO.prototype.closepin = function(pin)
{
  this.writetofs(this._unexportpath, pin);
};

customGPIO.prototype.setoutput = function(pin, value)
{
  if (value == 0)
    wrval = '0';
  else
    wrval = '1';
  this.writetofs(this._gpiopath + pin + '/value', wrval);
};

customGPIO.prototype.log = function(logString)
{
  if (this.debug)
    console.log(logString);
};

module.exports = customGPIO;