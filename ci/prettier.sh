#!/bin/bash

while true; do
    output=$(prettier --single-quote --trailing-comma none --tab-width 4 "{app,config,server}/**/*.js" -l)
    echo "$output"

    if [ -n "$output" ]
    then
        read -t 10 -p "Do you wish to install this program? [y/n]" yn

        case $yn in
            [Yy]* ) prettier --single-quote --trailing-comma none --tab-width 4 "{app,config,server}/**/*.js" --write; exit $?;;
            [Nn]* ) exit 1;;
            * ) echo "Please answer yes or no.";;
        esac

        exit 1;
    else
        exit 0;
    fi
done