var exec = require('child_process').exec;

var mCallback;
var mEnabled = false;

function camera()
{
  console.log("Initializing the camera module");
}

camera.prototype.init = function(enabled)
{
  mEnabled = enabled;
}

camera.prototype.takePicture = function(callback)
{
  mCallback = callback;
  
  if(mEnabled)
    exec("/tmp/omega_garage/takePicture.sh", takePictureCallback);
  else
    mCallback(false);
}

function takePictureCallback(error, stdout, stderr)
{
  var didCapture = false;
  
  if(error)
    console.log("Error taking picture: " + JSON.stringify(error));
  else if(stderr)
  {
    if(stderr.includes("Processing captured image"))
    {
      console.log("Picture taken successfully");
      didCapture = true;
    }
    else
      console.log("StdError returned while taking picture. Checking if picture was taken successfully");
  }
  else
  {
    console.log("Picture taken successfully");
    didCapture = true;
  }
  
  if(mCallback)
      mCallback(didCapture);
}

module.exports = new camera();