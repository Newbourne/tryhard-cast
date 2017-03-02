import Rx from 'rx'

export default class RxSenderObservable {
  constructor (applicationId, namespace) {
    this.applicationId = applicationId
    this.namespace = namespace
    this.state = state

    // Observable
    return Rx.Observable.create(obs => {
      var chrome = window.chrome
      if (!chrome) {
        obs.error('chrome not detected.')
        return
      }
      var sessionRequest = new chrome.cast.SessionRequest(this.applicationId)

      var onInitSuccessHandler = this.createOnInitSuccess(obs)
      var onErrorHandler = this.createOnError(obs)

      var onSessionUpdateHandler = this.createOnSessionUpdateListener(this.state, obs)
      var onReceiveMessageHandler = this.createOnReceiveMessage(obs)
      var onSessionListenerHandler = this.createOnSessionListener(
        this.state,
        obs,
        this.namespace,
        onSessionUpdateHandler,
        onReceiveMessageHandler
      )
      var onReceiverListenerHandler = this.createOnReceiverMessage(obs)

      var apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        onSessionListenerHandler,
        onReceiverListenerHandler
      )

      chrome.cast.initialize(
        apiConfig,
        onInitSuccessHandler,
        onErrorHandler
      )
    }).retryWhen(attempts => {
      return Rx.Observable.range(1, 5)
        .zip(attempts, function (i) { return i })
        .flatMap(i => {
          console.log('Chrome not detected. Will retry in ' + i + ' second(s)')
          return Rx.Observable.timer(i * 1000)
        })
    })
  }
  createOnInitSuccess (obs) {
    return () => {
      obs.onNext('Init Success')
    }
  }
  createOnMessageSuccess (obs) {
    return (msg) => {
      obs.onNext('onSuccess ' + msg)
    }
  }
  createOnError (obs) {
    return (err) => {
      obs.onError(err)
    }
  }
  createOnSessionListener (state, obs, namespace, updateListener, receiveSessionMessage) {
    return (e) => {
      state.session = e
      state.session.addUpdateListener(updateListener)
      state.session.addMessageListener(namespace, receiveSessionMessage)
      obs.onNext('Connected')
    }
  }
  createOnSessionUpdateListener (state, obs) {
    return (isAlive) => {
      if (!isAlive) {
        state.session = null
        obs.onCompleted()
      }
      if (isAlive) {
        obs.onNext('CONNECTED')
        obs.onNext(state.session.sessionId)
      }
    }
  }
  createOnReceiveMessage (obs) {
    return (msg) => {
      obs.onNext(msg)
    }
  }
  createOnReceiverMessage (obs) {
    return (msg) => {
      if (msg === 'available') {
        obs.onNext('AVAILABLE')
      } else {
        obs.onNext('NOT AVAILABLE')
      }
    }
  }
}
