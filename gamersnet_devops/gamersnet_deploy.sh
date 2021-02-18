#!/bin/sh

set -e

cd ./gamersnet
git pull origin master
cd ./gamersnet_frontend
npm install
npm run build
cd ../gamersnet_backend
npm install
sudo systemctl restart gamersnet-backend.service
