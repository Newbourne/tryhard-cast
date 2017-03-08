/*
  Since we have elected to return a pseudo observer in RxReceiverSubject
  we have rendered this object useless.
  Review later. Most likely this is bad practice within Rx usage.
*/
export default class RxReceiverObserver {
  constructor (config, state) {
    return {
      next: x => { /* no-op */ },
      error: e => { },
      complete: () => { /* no-op */ }
    }
  }
}
