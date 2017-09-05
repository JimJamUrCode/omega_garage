#/bin/bash
sleep 20
git clone https://github.com/JimJamUrCode/omega_garage.git /tmp/omega_garage

node /tmp/omega_garage/omega_garageServer.js &
