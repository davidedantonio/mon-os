'use strict'

const box = require('blessed').box
const EventEmitter = require('events').EventEmitter

class Infos extends EventEmitter {
  constructor (grid, osInfo) {
    super()
    this._grid = grid
    this._opts = {
      row: 0,
      col: 7,
      rowSpan: 1,
      colSpan: 5,
      processEvery: 3000
    }

    this._osInfo = osInfo

    this._box = this._grid.set(
      this._opts.row,
      this._opts.col,
      this._opts.rowSpan,
      this._opts.colSpan,
      box,
      {
        label: 'Infos'
      }
    )
  }

  draw () {
    let loadAverage = this._osInfo.loadAvg()
    let os = ` OS: ${this._osInfo.osPlatform()} \n Hostname: ${this._osInfo.osHostname()} \n Load Average: ${loadAverage[0].value} ${loadAverage[1].value} ${loadAverage[2].value}`
    this._box.setContent(os)
    this.emit('redraw')
  }

  run () {
    this.draw()

    setInterval(() => {
      this.draw()
    }, this._opts.processEvery)
  }
}

module.exports = Infos
