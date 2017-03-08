export default class RxReceiverDisposable {
  dispose () {
    if (!this.isDisposed) {
      this.isDisposed = true
    }
  }
}
