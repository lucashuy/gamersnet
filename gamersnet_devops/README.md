## About
This folder contains some files that were used for deployment.

## Usage
* `gamersnet_backend.service` lives in `/etc/systemd/system/`.
* `gamersnet_deploy.sh` is a shell script that simply pulls recent changes, builds the frontend and restarts the backend.
* `sudoers` contains a single line that grants user `comp4350` permission to issue `systemctl` related commands. This file should be placed in `/etc/sudoers.d/` or merged in with `/etc/sudoers`.
