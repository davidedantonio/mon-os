'use strict'

const table = require('blessed-contrib').table
const EventEmitter = require('events').EventEmitter

class Disks extends EventEmitter {
  constructor (grid, osInfo) {
    super()
    this._grid = grid
    this._opts = {
      row: 5,
      col: 7,
      rowSpan: 2,
      colSpan: 5,
      title: 'Drives',
      fg: 'green',
      processEvery: 60000
    }

    this._osInfo = osInfo

    this._table = this._grid.set(
      this._opts.row,
      this._opts.col,
      this._opts.rowSpan,
      this._opts.colSpan,
      table,
      {
        keys: true,
        label: this._opts.title,
        columnSpacing: 1,
        columnWidth: [15, 10, 10, 10, 10, 10, 10, 10, 10]
      }
    )
  }

  draw () {
    let headers = ['FILESYSTEM', 'SIZE', 'USED', 'AVAIL', 'CAPACITY', 'IUSED', 'IFREE', '%IUSED', 'MOUNTED ON']
    this._osInfo.hardDrive()
      .then(result => {
        let data = []
        result.forEach(element => {
          data.push(Object.values(element))
        })

        this._table.setData({ headers: headers, data: data })
        this.emit('redraw')
      })
      .catch(e => {
        process.exit(0)
      })
  }

  run () {
    this.draw()

    setInterval(() => {
      this.draw()
    }, this._opts.processEvery)
  }
}

module.exports = Disks
