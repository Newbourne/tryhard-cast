import Rx from 'rxjs/Rx'
import RxReceiverDisposable from './RxReceiverDisposable'
import { obsFn, completedFn } from './ObsFn'

let cast = window.cast

export default class RxReceiverObservable {
  constructor (state, config) {
    this.state = state

    return Rx.Observable.create(obs => {
      if (!cast) {
        obs.error('cast not detected.')
      }

      if (config.logLevel) {
        cast.receiver.logger.setLevelValue(config.logLevel)
      }

      // receiver instance (CastReceiverManager)
      this.state.manager = cast.receiver.CastReceiverManager.getInstance()

      // message bus (CastMessageBus)
      this.state.messenger = cast.receiver.CastReceiverManager.getCastMessageBus(config.namespace, config.messageType)

      // media manager support (later)

      // observer setup
      var onReadyHandler = obsFn(config.readyObs)
      var onSenderConnectedHandler = obsFn(config.senderConnectedObs)
      var onSenderDisconnectedHandler = obsFn(config.senderDisconnectedObs)
      var onStandbyChangedHandler = obsFn(config.standbyChangedObs)
      var onSystemVolumeChangedHandler = obsFn(config.systemVolumeChangedHandler)
      var onVisibilityChangedHandler = obsFn(config.visibilityChangedHandler)

      var onMessageHandler = obsFn(obs)
      var onShutdownHandler = completedFn(obs)

      this.state.manager.addEventListener('onReady', onReadyHandler, false)
      this.state.manager.addEventListener('onSenderConnected', onSenderConnectedHandler, false)
      this.state.manager.addEventListener('onSenderDisconnected', onSenderDisconnectedHandler, false)
      this.state.manager.addEventListener('onShutdown', onShutdownHandler, false)
      this.state.manager.addEventListener('onStandbyChanged', onStandbyChangedHandler, false)
      this.state.manager.addEventListener('onSystemVolumeChanged', onSystemVolumeChangedHandler, false)
      this.state.manager.addEventListener('onVisibilityChanged', onVisibilityChangedHandler, false)
      this.state.messenger.addEventListener('onMessage', onMessageHandler, false)

      return new RxReceiverDisposable(
        this.state, 
        onReadyHandler, 
        onMessageHandler, 
        onSenderConnectedHandler, 
        onSenderDisconnectedHandler,
        onShutdownHandler,
        onStandbyChangedHandler,
        onSystemVolumeChangedHandler,
        onVisibilityChangedHandler)
    })
  }
}
