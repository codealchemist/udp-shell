#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')

// print ascii art
const artFile = path.join(__dirname, '/../ascii-art.txt')
const art = fs.readFileSync(artFile, 'utf8')
console.info(art)

// load params and validate them
const params = require('minimist')(process.argv.slice(2))
if (hasInvalidParams(params)) return showUsage()

if (params.host) {
  // start host
  const Host = require(path.join(__dirname, '../src/host'))
  const host = new Host(params.host)
  host.start()
} else {
  // connect guest
  const Guest = require(path.join(__dirname, '../src/guest'))
  const guest = new Guest()
  guest.connect(params._[0])
}

//------------------------------------------------------------------------

function hasInvalidParams (params) {
  return (!params.host && !params['_'].length)
}

function showUsage () {
  console.log(`
    USAGE:

    Start host:
      udp-shell --host six

    Connect guest:
      udp-shell six
  `)
}

