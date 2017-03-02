export obsFn = (obs) => {
  return (e) => {
    if (obs) {
      obs.next(e)
    }
  }
}

export completedFn = (obs) => {
  return () => {
    if (obs){
      obs.complete()
    }
  }
}