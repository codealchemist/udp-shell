'use strict'
const UdpNode = require('udp-node')
const exec = require('child_process').exec

module.exports = class Host {
  constructor (name) {
    this.name = name
  }

  start () {
    const host = new UdpNode()
    host
      .setLogLevel('info')
      .set({
        name: this.name,
        type: 'host'
      })
      .on('command', (message, rinfo) => {
        console.log(message)
        console.log('-'.repeat(80))
        const command = message.text

        exec(command, (err, stdout, stderr) => {
          host.send({
            type: 'response',
            address: rinfo.address,
            port: rinfo.port,
            text: stdout || stderr
          })
        })
      })
  } // end start
}