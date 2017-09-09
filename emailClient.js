var email 	= require("emailjs");
var mServer;
var mUserEmail = "";
var mRecipientEmail = "";
 
 function emailClient()
 {
   
 }
 
emailClient.prototype.init = function(userEmail, password, recipientEmail, host)
{
  console.log("Email client started initializing");
  
  mUserEmail = userEmail;
  mRecipientEmail = recipientEmail;
   
  mServer = email.server.connect(
    {
     user:      mUserEmail, 
     password:  password, 
     host:      host, 
     ssl:     true
    }
  );
}
 
emailClient.prototype.sendEmail = function(subject, message)
{
  console.log("Sending email from: " + mUserEmail + " to " + mRecipientEmail);
  
  mServer.send({
     text:    message, 
     from:    "<" + mUserEmail + ">", //In config file, should be something like "myemail@email.com"
     to:      mRecipientEmail, //In config file should be something like "<myemail@email.com><youremail@email.com>"
     cc:      "",
     subject: subject
  }, function(err, message) { console.log(err || message); });
}

module.exports = new emailClient();
