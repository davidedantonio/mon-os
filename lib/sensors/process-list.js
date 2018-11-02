'use strict'

const table = require('blessed-contrib').table
const EventEmitter = require('events').EventEmitter

class ProcessList extends EventEmitter {
  constructor (grid, osInfo) {
    super()
    this._grid = grid
    this._opts = {
      frequency: 1000,
      row: 0,
      col: 0,
      rowSpan: 4,
      colSpan: 12,
      title: 'Active Processes',
      fg: 'green',
      processEvery: 1000
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
        columnWidth: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 60]
      }
    )
  }

  draw () {
    let headers = ['USER', 'PID', '%CPU', '%MEM', 'VSZ', 'RSS', 'TTY', 'STAT', 'START', 'TIME', 'COMMAND']
    this._osInfo.getProcesses(100)
      .then(result => {
        this._table.setData({ headers: headers, data: result })
        this._table.focus()
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

module.exports = ProcessList
