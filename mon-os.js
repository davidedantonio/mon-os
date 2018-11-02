'use strict'

const NodeOsInfo = require('./lib/node-os-info')
const os = new NodeOsInfo()

os.getProcesses(20)
  .then((result) => {
    console.log(result)
  })
  .catch(e => {
    console.log(e)
  })
