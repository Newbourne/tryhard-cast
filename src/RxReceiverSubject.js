import Rx from 'rxjs/Rx'
import RxReceiverObservable from './RxReceiverObservable'
import RxReceiverObserver from './RxReceiverObserver'

const socketCfg = {
  appId: null,
  namespace: null,
  readyObs: null,
  senderConnectedObs: null,
  senderDisconnectedObs: null,
  standbyChangedObs: null,
  systemVolumeChangedHandler: null,
  visibilityChangedHandler: null,
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

export default class RxReceiverSubject {
  constructor (config) {
    config = Object.assign(socketCfg, config)

    if (!config.appId) {
      throw new Error('application id required.')
    }
    if (!config.namespace) {
      throw new Error('namespace is required.')
    }
    this.state = { }
    this.state.subject = Rx.Subject.create(
      new RxReceiverObserver(config, this.state),
      new RxReceiverObservable(config, this.state)
    )
  }
  start (config) {
    this.state.manager.start(config)
  }
  stop () {
    this.state.manager.stop()
  }
  next (msg) {
    this.state.messenger.broadcast(msg)
  }
  send (senderId, msg) {
    this.state.messenger.send(senderId, msg)
  }
  getApplicationData () {
    return this.state.manager.getApplicationData()
  }
  getNamespace () {
    return this.state.manager.getNamespace()
  }
  getDeviceCapabilities () {
    return this.state.manager.getDeviceCapabilities()
  }
  getStandbyState () {
    return this.state.manager.getStandbyState()
  }
  getSystemState () {
    return this.state.manager.getSystemState()
  }
  getVisibilityState () {
    return this.state.manager.getVisibilityState()
  }
  isSystemReady () {
    return this.state.manager.isSystemReady()
  }
  setApplicationState (statusText) {
    this.state.manager.setApplicationState(statusText)
  }
  setInactivityTimeout (maxInactivity) {
    this.state.manager.setInactivityTimeout(maxInactivity)
  }
}
