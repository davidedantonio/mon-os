'use strict'

const table = require('blessed-contrib').table

class ProcessList {
  constructor (grid, osInfo) {
    this._grid = grid
    this._opts = {
      frequency: 1000,
      row: 0,
      col: 0,
      rowSpan: 4,
      colSpan: 12,
      title: 'Active Processes',
      fg: 'green'
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
      })
      .catch(e => {
        process.exit(0)
      })
  }
}

module.exports = ProcessList
