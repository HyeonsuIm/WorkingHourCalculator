#!/bin/bash
#NODE_NAME="working-calendar-server"
#docker stop $NODE_NAME
#docker rm $NODE_NAME
#
#git pull
#docker build -t $NODE_NAME ./appserver
#docker run --name $NODE_NAME -p 20000:20000 $NODE_NAME &

git pull
docker-compose up -d --build