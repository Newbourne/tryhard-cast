import Rx from 'rxjs/Rx'
import RxReceiverObservable from './RxReceiverObservable'
import SocketObserver from './SocketObserver'

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
    if (!config.appId) {
      throw new Error('application id required.')
    }
    if (!config.namespace) {
      throw new Error('namespace is required.')
    }
    this.state = { }
    this.state.subject = Rx.Subject.create(
      new SocketObserver(this.state, config),
      new SocketObservable(this.state, config)
    )      
  }
  start => (config) => {
    this.state.manager.start(config)
  }
  stop => () => {
    this.state.manager.stop()
  }
  next => (msg) => {
    this.state.messenger.broadcast(msg)
  }
  send => (senderId, msg) => {
    this.state.messenger.send(senderId, msg)
  }
  getApplicationData => () => {
    return this.state.manager.getApplicationData()
  }
  getNamespace => () => {
    return this.state.manager.getNamespace()
  }
  getDeviceCapabilities => () => {
    return this.state.manager.getDeviceCapabilities()
  }
  getStandbyState => () => {
    return this.state.manager.getStandbyState()
  }
  getSystemState => () => {
    return this.state.manager.getSystemState()
  }
  getVisibilityState => () => {
    return this.state.manager.getVisibilityState()
  }
  isSystemReady => () => {
    return this.state.manager.isSystemReady()
  }
  setApplicationState => (statusText) => {
    this.state.manager.setApplicationState(statusText)
  }
  setInactivityTimeout => (maxInactivity) => {
    this.state.manager.setInactivityTimeout(maxInactivity)
  }
}
