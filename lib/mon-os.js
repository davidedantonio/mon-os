'use strict'

const contrib = require('blessed-contrib')
const blessed = require('blessed')
const sensorFactory = require('./sensors/sensor-factory')

const Grid = contrib.grid

const build = () => {
  const screen = blessed.screen()
  const grid = new Grid({ rows: 12, cols: 12, screen: screen })

  const sensors = ['process-list', 'disks']

  sensors.forEach(sensor => {
    let sensorInstance = sensorFactory(sensor, grid)
    sensorInstance.on('redraw', () => {
      screen.render()
    })
  })

  screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0)
  })

  screen.render()
}

module.exports = build
