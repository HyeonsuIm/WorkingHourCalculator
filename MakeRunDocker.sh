#!/bin/bash
git pull
docker build -t working-calendar-server .
docker run -p 20000:200000 working-calendar-server