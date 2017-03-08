import Rx from 'rx'
import RxSenderDisposable from './RxSenderDisposable'
import { obsFn, errorFn } from './ObsFn'

const DISCONNECTED = 0
const CONNECTED = 1

const RECEIVER_OFFLINE = 0
const RECEIVER_AVAILABLE = 1

export default class RxSenderObservable {
  constructor (config, state) {
    this.state = state

    // Observable
    return Rx.Observable.create(obs => {
      var chrome = window.chrome

      if (!chrome) {
        obs.error('chrome not detected.')
        return
      }

      var sessionRequest = new chrome.cast.SessionRequest(this.applicationId)

      var initObsHandler = obsFn(config.initObs)
      var messageObsHandler = obsFn(obs) // Primary Observable
      var errorObsHandler = errorFn(obs)

      var sessionUpdateObsHandler = this.createSessionUpdateListener(this.state, obs.connObs)
      var receiverListener = this.createReceiverListener(config.receiverObs)

      var sessionListener = this.createSessionListener(
        this.state,
        obs,
        this.namespace,
        sessionUpdateObsHandler,
        messageObsHandler
      )

      var apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener
      )

      chrome.cast.initialize(
        apiConfig,
        initObsHandler,
        errorObsHandler
      )

      return new RxSenderDisposable(config, state)
    }).retryWhen(attempts => {
      return Rx.Observable.range(1, 5)
        .zip(attempts, function (i) { return i })
        .flatMap(i => {
          console.log('Chrome not detected. Will retry in ' + i + ' second(s)')
          return Rx.Observable.timer(i * 1000)
        })
    })
  }
  /*
    According to the documentation this function could be executed more than once.
    Therefore we should not use the complete function on the observable.
  */
  createSessionUpdateListener (state, obs) {
    return (isAlive) => {
      if (!isAlive) {
        state.session = null
        if (obs) {
          obs.next(DISCONNECTED)
        }
      }
      if (isAlive && obs) {
        obs.next(CONNECTED)
      }
    }
  }
  createSessionListener (state, obs, namespace, sessionUpdateListener, messageListener) {
    return (e) => {
      state.session = e
      state.session.addUpdateListener(sessionUpdateListener)
      state.session.addMessageListener(namespace, messageListener)
      obs.next('Session ID', e.sessionId)
    }
  }
  createReceiverListener (obs) {
    return (e) => {
      if (e === 'available') {
        obs.next(RECEIVER_AVAILABLE)
      } else {
        obs.next(RECEIVER_OFFLINE)
      }
    }
  }
}
