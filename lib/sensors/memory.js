const gauge = require('blessed-contrib').gauge
const EventEmitter = require('events').EventEmitter

class Memory extends EventEmitter {
  constructor (grid, osInfo) {
    super()
    this._grid = grid
    this._opts = {
      row: 0,
      col: 7,
      rowSpan: 2,
      colSpan: 5,
      title: 'Memory',
      processEvery: 2000
    }

    this._osInfo = osInfo

    this._gauge = this._grid.set(
      this._opts.row,
      this._opts.col,
      this._opts.rowSpan,
      this._opts.colSpan,
      gauge,
      {
        label: this._opts.title
      }
    )
  }

  draw () {
    this._osInfo.getProcesses()
      .then(result => {
        let memory = 0
        result.forEach(element => {
          if (!isNaN(parseFloat(element[3]))) {
            memory += parseFloat(element[3])
          }
        })
        this._gauge.setData(100 - parseInt(memory))
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

module.exports = Memory
