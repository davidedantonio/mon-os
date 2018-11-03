'use strict'

const ProcessList = require('./process-list')
const Disks = require('./disks')
const Memory = require('./memory')
const Cpu = require('./cpu')
const Infos = require('./infos')
const Netstat = require('./netstat')
const OsInfo = require('./../node-os-info')

module.exports = (sensor, grid) => {
  let osInfo = new OsInfo()
  let instance = null

  if (sensor === 'process-list') {
    instance = new ProcessList(grid, osInfo)
  }

  if (sensor === 'disks') {
    instance = new Disks(grid, osInfo)
  }

  if (sensor === 'memory') {
    instance = new Memory(grid, osInfo)
  }

  if (sensor === 'cpu') {
    instance = new Cpu(grid, osInfo)
  }

  if (sensor === 'infos') {
    instance = new Infos(grid, osInfo)
  }

  if (sensor === 'netstat') {
    instance = new Netstat(grid, osInfo)
  }

  instance.run()
  return instance
}
