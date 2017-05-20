#!/bin/bash

while true; do
    prettier --single-quote --trailing-comma es5 "{app,config,server}/**/*.js" --debug-check
    read -p "Do you wish to install this program? [y/n]" yn
    case $yn in
        [Yy]* ) prettier --single-quote --trailing-comma es5 "{app,config,server}/**/*.js" --write;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done