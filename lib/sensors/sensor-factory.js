'use strict'

const ProcessList = require('./process-list')
const OsInfo = require('./../node-os-info')

module.exports = (sensor, grid) => {
  let osInfo = new OsInfo()

  if (sensor === 'process-list') {
    return new ProcessList(grid, osInfo)
  }
}
