import tape from 'tape'
import _test from 'tape-promise'
import sinon from 'sinon'
import Rx from 'rxjs/Rx'

import RxReceiverObservable from './../../src/RxReceiverObservable'
import { obsFn } from './../../src/ObsFn'


const test = _test(tape)

test('Rx Receiver Observable Tests', (t) => {

  t.test('should return error for cast not found', (t) => {
    t.plan(3)

    global.window = {}

    var obsNextSpy = sinon.spy()
    var obsErrorSpy = sinon.spy()
    var obsCompleteSpy = sinon.spy()

    var config = { }
    var state = { }

    var subscription = new RxReceiverObservable(config, state)
    
    var obsSpy = {
      next: obsNextSpy,
      error: obsErrorSpy,
      complete: obsCompleteSpy
    }

    subscription.subscribe(obsSpy)

    t.equal(obsNextSpy.notCalled, true)
    t.equal(obsErrorSpy.calledOnce, true)
    t.equal(obsCompleteSpy.notCalled, true)

    t.end()
  })

  t.test('should test all observers in the observable', (ti) => {
    global.window = {
      cast: {
        receiver: {
          CastReceiverManager: { 
            getInstance() { return { addEventListener() {} } },
            getCastMessageBus(){ return { addEventListener() {} } }
          }
        }
      }
    }

    // will fail
    // need to find way to fire onReady event from mocked objects.
    // F* me right?
    // Maybe create another class for a mock cast receiver
    // instead of doing it within the test
    ti.test('should test ready observer', (tt) => {
      tt.plan(1)
      
      var obsNextSpy = sinon.spy()

      var config = {
        readyObs: obsFn({ next: obsNextSpy })
      }
      var state = { }

      var subscription = new RxReceiverObservable(config, state)

      subscription.subscribe({})

      tt.equal(obsNextSpy.calledOnce, true)

      tt.end()
    })
  })
})