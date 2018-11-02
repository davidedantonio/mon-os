'use strict'

const _os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

class NodeOsInfo {
  constructor () {
    this._platform = _os.platform()
  }

  osPlatform () {
    return this._platform
  }

  freeMemory () {
    return _os.freemem() / (1024 * 1024)
  }

  totalMemory () {
    return _os.totalmem() / (1024 * 1024)
  }

  occupiedMemoryPercentage () {
    return (((this.totalMemory() - this.freeMemory()) * 100) / this.totalMemory()).toFixed(4)
  }

  freeMemoryPercentage () {
    return ((this.freeMemory() * 100) / this.totalMemory()).toFixed(4)
  }

  loadAvg () {
    let osLoadAvg = _os.loadavg()
    let fixedLoadAvg = osLoadAvg.map((avg, i) => {
      let mins = 0
      switch (i) {
        case 0: {
          mins = 1
          break
        }
        case 1: {
          mins = 5
          break
        }
        case 2: {
          mins = 15
          break
        }
      }

      return {
        minutes: mins,
        value: avg.toFixed(4)
      }
    })

    return fixedLoadAvg
  }

  platform () {
    return this._platform
  }

  sysUptime () {
    return _os.uptime()
  }

  cpusNumber () {
    return this.cpusInfo().length
  }

  cpusInfo () {
    return _os.cpus()
  }

  cpusTotalInfo () {
    var cpus = _os.cpus()
    let user = 0
    let nice = 0
    let sys = 0
    let idle = 0
    let irq = 0
    let total = 0

    for (let cpu in cpus) {
      if (!cpus.hasOwnProperty(cpu)) {
        continue
      }

      user += cpus[cpu].times.user
      nice += cpus[cpu].times.nice
      sys += cpus[cpu].times.sys
      irq += cpus[cpu].times.irq
      idle += cpus[cpu].times.idle
    }

    total = user + nice + sys + idle + irq

    return {
      'user': user,
      'nice': nice,
      'sys': sys,
      'irq': irq,
      'idle': idle,
      'total': total
    }
  }

  async getProcesses (nProcess) {
    // if nProcess is undefined throw an error
    if (isNaN(nProcess)) {
      throw new Error('nProcess is not a number')
    }

    let command = `ps aux | sort -nrk 3,3 | head -n 20`
    if (nProcess > 0) {
      command = `ps aux | sort -nrk 3,3 | head -n ${nProcess + 1}`
    }

    const { err, stdout } = await exec(command)

    if (err) {
      throw new Error(err)
    }

    let lines = stdout.split('\n')
    lines.shift()
    lines.pop()

    let headers = ['USER', 'PID', '%CPU', '%MEM', 'VSZ', 'RSS', 'TTY', 'STAT', 'START', 'TIME', 'COMMAND']
    let result = getFormattedLines(headers, lines)

    return result
  }

  async hardDrive () {
    const { err, stdout } = await exec('df -h')

    if (err) {
      throw new Error(err)
    }

    let lines = stdout.split('\n')
    let headers = ['FILESYSTEM', 'SIZE', 'USED', 'AVAIL', 'CAPACITY', 'IUSED', 'IFREE', '%IUSED', 'MOUNTED ON']

    let result = getFormattedLines(headers, lines)

    return result
  }
}

const getFormattedLines = (headers, lines) => {
  lines.shift()
  lines.pop()

  let result = []
  lines.forEach((_line) => {
    let _str = _line.trim().replace(/[\s\n\r]+/g, ' ')
    let _values = _str.split(' ')
    let _obj = []

    _values.forEach((_item, _i) => {
      if (headers[_i] !== undefined) {
        _obj[headers[_i]] = _item
      }
    })

    result.push(Object.values(_obj))
  })
  return result
}

module.exports = NodeOsInfo
