
export default class RxSenderObserver {
  constructor (state, config) {
    return {
      next: x => { /* no-op */ },
      error: e => { },
      complete: () => { /* no-op */ }
    }
  }
}
