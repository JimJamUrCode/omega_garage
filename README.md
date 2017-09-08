# omega_garage

A node js application that can control your garage door(s).

This app uses a configuration file to define pins, the name of the garage door that the pin corresponds with, and a sensor pin for the magnetic proximity sensor.

Mainly designed for use with two wire garage door openers.

# To Install on Omegas with only 16mb of Flash storage:

1. Install nodejs

  ```opkg update```

  ```opkg install nodejs```

2. Install git and git http

  ```opkg update```

  ```opkg install git git-http```

3.Manuallly Clone the omega garage repo into /tmp/omega_garage

  ```git clone https://github.com/JimJamUrCode/omega_garage.git /tmp/omega_garage```

4. Move the config file to your home directory

  ```mv /tmp/omega_garage/config.json /root/config.json```

5. Modify the config.json file with the appropriate credentials

6. Move the 'startOmegaGarage' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /tmp/omega_garage/startOmegaGarage /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaGarage```

7.Enable the new init.d script to make the service run at boot. The startOmegaGarage script will load the omega_garage repo into RAM and start the server.

  ```/etc/init.d/startOmegaGarage enable```

8. reboot the onion omega to make sure that the startOmegaGarage script is executed upon reboot.

```reboot```


# To Install on Omegas with more than 16mb of Flash storage:

1. Install nodejs

  ```opkg update```

  ```opkg install nodejs```

2. Install git and git http

  ```opkg update```

  ```opkg install git git-http```

3.Manuallly Clone the omega garage repo into your home directory

  ```git clone https://github.com/JimJamUrCode/omega_garage.git /root/omega_garage```

4. Move the config file to your home directory

  ```mv /root/omega_garage/config.json /root/config.json```

5. Modify the config.json file with the appropriate credentials
6. Move the 'startOmegaGarage' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /root/omega_garage/startOmegaGarage16mbplus /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaGarage16mbplus```

7.Enable the new init.d script to make the service run at boot. The startOmegaGarage script will load the omega_garage repo into RAM and start the server.

  ```/etc/init.d/startOmegaGarage16mbplus enable```

8. reboot the onion omega to make sure that the startOmegaGarage script is executed upon reboot.

```reboot```


# In either case:
* There are a few more dependencies now that email notifications are enabled.

 * Express js

 * emailjs and its dependencies

 * You must get a copy of express for node. Follow the instructions in the guide here: https://community.onion.io/topic/855/nodejs-express-http-server/2. I have included a version in the repo that is working for me.
