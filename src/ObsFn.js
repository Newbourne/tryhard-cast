export function obsFn (obs) {
  return (e) => {
    if (obs) {
      obs.next(e)
    }
  }
}

export function completedFn (obs) {
  return () => {
    if (obs) {
      obs.complete()
    }
  }
}

export function errorFn (obs) {
  return (err) => {
    if (obs) {
      obs.error(err)
    }
  }
}
