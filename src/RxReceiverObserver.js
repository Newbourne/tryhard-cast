/*
  Since we have elected to return a pseudo observer in RxReceiverSubject 
  we have rendered this object useless.
  Review later. Most likely this is bad practice within Rx usage.
*/
export default class RxReceiverObserver {
  constructor (state, config) {
    this.state = state
    this.config = config
    return {
      next: x => { /* no-op */ },
      error: e => { /* no-op */  },
      complete: () => { /* no-op */ }
    }
  }
}