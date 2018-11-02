'use strict'

const ProcessList = require('./process-list')
const Disks = require('./disks')
const OsInfo = require('./../node-os-info')

module.exports = (sensor, grid) => {
  let osInfo = new OsInfo()
  let instance = null

  if (sensor === 'process-list') {
    instance = new ProcessList(grid, osInfo)
    instance.run()
  }

  if (sensor === 'disks') {
    instance = new Disks(grid, osInfo)
    instance.run()
  }

  return instance
}
