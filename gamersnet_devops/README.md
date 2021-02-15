## About
This folder contains some files that were used for deployment.

## Usage
#### `gamersnet_backend.service`
`gamersnet_backend.service` lives in `/etc/systemd/system/`.

#### `gamersnet_deploy.sh`
`gamersnet_deploy.sh` is a shell script that simply pulls recent changes, builds the frontend and restarts the backend.

#### `sudoers`
`sudoers` contains a single line that grants user `comp4350` permission to issue `systemctl` related commands. This file should be placed in `/etc/sudoers.d/` or merged in with `/etc/sudoers`.

#### `webhook.js`
`webhook.js` contains a webhook middleman that translates GitHub WebHook updates into something Discord can understand. Discord natively supports this, but it doesn't do what I (Lucas) want it to do.  
To use this script, make sure you have NodeJS installed. Also make sure TCP port `11111` is open to the public. Then start the script by using:
```
ID=<discord_webhook_id> TOKEN=<discord_webhook_token> node webhook.js
```
Then on GitHub, enable WebHooks, entering the IP/domain where the script is located (and the port) and select `application/json`. This script only triggers on `Issue comments` and `Pull requests` events.
