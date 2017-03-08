import Rx from 'rxjs/Rx'
import RxReceiverObservable from './RxReceiverObservable'
import RxReceiverObserver from './RxReceiverObserver'
import { obsFn, errorFn } from './ObsFn'

const socketCfg = {
  appId: null,
  namespace: null,
  initObs: null,        // API finished initializing
  connObs: null,        // for sender to receiver connection status
  receiverObs: null,    // for chromecast availability
  closeObs: null,       // for observing manual shutdown
  sendMessageObs: null, // for monitoring sending messages
    // DEBUG
    // VERBOSE
    // INFO
    // WARNING
    // ERROR
    // NONE
  logLevel: 'NONE',
    // STRING
    // JSON
    // CUSTOM
  messageType: 'JSON'
}

export default class RxSenderSubject {
  constructor (config) {
    config = Object.assign(socketCfg, config)
    this.config = config

    if (!config.appId) {
      throw new Error('application id required.')
    }
    if (!config.namespace) {
      throw new Error('namespace is required.')
    }
    this.config = config
    this.state = { }
    this.state.subject = Rx.Subject.create(
      new RxReceiverObserver(config, this.state),
      new RxReceiverObservable(config, this.state)
    )
  }
  // Not sure if using sendMessageObs is the answer here.
  // What will/should happen on error? Doesn't the observable close after error?
  next (message) {
    var messageObs = this.config.sendMessageObs
    var state = this.state

    state.session.sendMessage(
      this.config.namespace,
      message,
      messageObs ? messageObs.next('Message sent: ' + message) : null,
      messageObs ? messageObs.error(errorFn(messageObs)) : null)
  }

  stop () {
    var state = this.state
    state.session.stop(obsFn(this.closeObs), errorFn(this.closeObs))
  }
}
