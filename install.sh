#!/bin/bin/env bash
if [ "$(uname)" == "Darwin" ] 
then
    curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh
    brew install python3
    brew install python3-pip
else
    sudo apt-get install python3
    sudo apt-get install python3-pip
fi

pip3 install -r requiremenets.txt