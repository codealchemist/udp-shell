'use strict'

// load params and validate them
const params = require('minimist')(process.argv.slice(2))
if (hasInvalidParams(params)) return showUsage()

const UdpNode = require('udp-node')
const readline = require('readline')
let rl
const exec = require('child_process').exec

// start in host or guest mode
if (params.host) {
  startHost()
} else {
  startGuest()
}

//------------------------------------------------------------------------

function startHost () {
  const host = new UdpNode()
  host
    .setLogLevel('info')
    .set({
      name: params.host,
      type: 'host'
    })
    .on('command', (message, rinfo) => {
      console.log('-- host got command', message)
      const command = message.text

      exec(command, (err, stdout, stderr) => {
        host.send({
          type: 'response',
          address: rinfo.address,
          port: rinfo.port,
          text: err || stdout || stderr
        })
      })
    })
}

function startGuest () {
  const guest = new UdpNode()
  guest
    .setLogLevel('error')
    .set({
      name: 'client',
      type: 'client',
      port: 3025
    })
    .broadcast({port: 3024})
    .onNode((data, rinfo) => {
      console.log('--- CONNECTED TO HOST: ', data)

      onCommandLineInput((text) => {
        guest.send({
          type: 'command',
          address: rinfo.address,
          port: rinfo.port,
          text: text
        })
      }, data.node.name)
    })
    .on('response', (message, rinfo) => {
      // console.log('-- got host response', message)
      console.log(message.text)
      rl.prompt()
    })
}

function onCommandLineInput (callback, nodeName) {
  console.log('-- nodeName', nodeName)
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `UDP-SHELL @ ${nodeName}> `
  })
  rl.prompt()

  rl.on('line', (line) => {
    const text = line.trim()
    callback(text)
    // rl.prompt();
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  })
}

//------------------------------------------------------------------------

function hasInvalidParams (params) {
  console.log('- params', params)
  return (!params.host && !params['_'].length)
}

function showUsage () {
  console.log(`
    USAGE:

    Start host:
      node index.js --host six

    Connect guest:
      node index.js six
  `)
}

