```
            _                 _          _ _
  _   _  __| |_ __        ___| |__   ___| | |
 | | | |/ _` | '_ \ _____/ __| '_ \ / _ \ | |
 | |_| | (_| | |_) |_____\__ \ | | |  __/ | |
  \__,_|\__,_| .__/      |___/_| |_|\___|_|_|
             |_|
             
Simple remote shell over UDP.

```

## Overview

*udp-shell* lets you use a unix shell on a remote host thru UDP.

## Install

`npm install -g udp-shell`

## Start host

`udp-shell --host Six`

## Connect guest

`udp-shell Six`

And that's it.
Once host and guest machines are connected you will be able to start typing commands that will be sent to the remote host.
The remote host will execute sent command and return the response to the guest.

Enjoy!
