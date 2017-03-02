export default class RxReceiverDisposable {
  constructor (
    state,
    onReadyHandler, 
    onMessageHandler, 
    onSenderConnectedHandler, 
    onSenderDisconnectedHandler,
    onShutdownHandler,
    onStandbyChangedHandler,
    onSystemVolumeChangedHandler,
    onVisibilityChangedHandler) {
    this.state = state
    this.readyFn = onReadyHandler
    this.messageFn = onMessageHandler
    this.senderConnFn = onSenderConnectedHandler
    this.senderDisconnFn = onSenderDisconnectedHandler
    this.shutdownFn = onShutdownHandler
    this.standbyFn = onStandbyChangedHandler
    this.systemVolumeFn = onSystemVolumeChangedHandler
    this.visibilityFn = onVisibilityChangedHandler
    this.isDisposed = false
  }
  dispose () {
    if (!this.isDisposed) {
      this.isDisposed = true
      this.state.manager.addEventListener('onReady', this.readyFn, false)
      this.state.manager.addEventListener('onSenderConnected', this.senderConnFn, false)
      this.state.manager.addEventListener('onSenderDisconnected', this.senderDisconnFn, false)
      this.state.manager.addEventListener('onShutdown', this.shutdownFn, false)
      this.state.manager.addEventListener('onStandbyChanged', this.standbyFn, false)
      this.state.manager.addEventListener('onSystemVolumeChanged', this.systemVolumeFn, false)
      this.state.manager.addEventListener('onVisibilityChanged', this.visibilityFn, false)
      this.state.messenger.addEventListener('onMessage', this.messageFn, false)
    }
  }
}