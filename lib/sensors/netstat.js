'use strict'

const table = require('blessed-contrib').table
const EventEmitter = require('events').EventEmitter

class Netstat extends EventEmitter {
  constructor (grid, osInfo) {
    super()
    this._grid = grid
    this._opts = {
      row: 7,
      col: 7,
      rowSpan: 5,
      colSpan: 5,
      title: 'Netstat',
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
        columnWidth: [7, 7, 20, 20, 8, 8, 8, 8, 8, 8]
      }
    )
  }

  draw () {
    let headers = ['NAME', 'MTU', 'NETWORK', 'ADDRESS', 'IPKTS', 'IERRS', 'OPKTS', 'OERRS', 'COLL']
    this._osInfo.netstat()
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

module.exports = Netstat
