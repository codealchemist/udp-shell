'use strict'
const UdpNode = require('udp-node')
const readline = require('readline')

module.exports = class Guest {
  initPrompt (hostname) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `UDP-SHELL @ ${hostname}> `
    })
    this.rl.prompt()
  }

  connect (hostname) {
    const guest = new UdpNode()
    guest
      .setLogLevel('error')
      .set({
        name: 'client',
        type: 'client',
        port: 3025
      })
      .broadcast({
        port: 3024,
        filter: ['host']
      })
      .onNode((data, rinfo) => {
        // only connect to requested hostname
        if (data.node.name !== hostname) return

        console.log('--- CONNECTED TO HOST: ', data)

        // initialize command line prompt
        this.initPrompt(data.node.name)

        this.onCommandLineInput((text) => {
          guest.send({
            type: 'command',
            address: rinfo.address,
            port: rinfo.port,
            text: text
          })
        })
      })
      .on('response', (message, rinfo) => {
        console.log(message.text)
        this.rl.prompt()
      })
  }

  onCommandLineInput (callback, nodeName) {
    this.rl.on('line', (line) => {
      const text = line.trim()
      callback(text)
      // rl.prompt();
    }).on('close', () => {
      console.log('Have a great day!');
      process.exit(0);
    })
  }
}