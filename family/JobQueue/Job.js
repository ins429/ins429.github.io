import { STATUS } from './index'

const isFunction = functionToCheck =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'

const performRequiredError = new Error('perform is required')

const generateId = (queue, id) => `${queue}-${id}`

let nextId = 1

class Job {
  constructor({ finalize } = {}) {
    this.queue = this.constructor.name
    this.id = generateId(this.queue, nextId)
    nextId = nextId + 1
    this._finalize = finalize
    this.status = STATUS.IDLE
    this.lockedAt = null
    this.failedAt = null
    this.error = null
    this.result = null
    this.listeningEvents = {}

    this.prepare = this.prepare.bind(this)
    this.perform = this.perform.bind(this)
    this.finalize = this.finalize.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.dispatchEvent = this.dispatchEvent.bind(this)
    this.addEventListener = this.addEventListener.bind(this)
    this.removeEventListener = this.removeEventListener.bind(this)
    this.removeEventListeners = this.removeEventListeners.bind(this)
  }

  prepare() {
    this.lockedAt = new Date()
    this.updateStatus(STATUS.IN_PROGRESS)
  }

  perform() {
    throw performRequiredError
  }

  finalize({ result, error }) {
    if (error) {
      this.failedAt = new Date()
      this.error = error
      this.updateStatus(STATUS.ERROR)
    } else {
      this.result = result
      this.updateStatus(STATUS.DONE)
    }
    this._finalize && this._finalize({ result, error })
  }

  updateStatus(status) {
    if (STATUS[status]) {
      this.status = status
      this.dispatchEvent('statusChange')

      if (status !== STATUS.IN_PROGRESS) {
        this.lockedAt = null
      }
    }
  }

  dispatchEvent(eventName, args) {
    const handlers = this.listeningEvents[eventName]

    if (handlers) {
      handlers.forEach(handler => handler(args))
    }
  }

  addEventListener(eventName, handler) {
    if (isFunction(handler) && handler.name) {
      const listeningEvents = this.listeningEvents[eventName] || []

      this.listeningEvents[eventName] = listeningEvents.concat(handler)
    } else {
      console.error('Binding handler must be a named function')
    }
  }

  removeEventListener(eventName, handler) {
    const listeningEvents = this.listeningEvents[eventName]

    if (isFunction(handler) && handler.name && listeningEvents) {
      this.listeningEvents[eventName] = listeningEvents.filter(
        fn => fn.name !== handler.name
      )
    }
  }

  removeEventListeners() {
    this.listeningEvents = []
  }
}

export default Job
