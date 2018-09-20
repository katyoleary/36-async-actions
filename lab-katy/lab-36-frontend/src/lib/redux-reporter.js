'use strict';

const reporter = store => next => action => {
  console.log('ACTION REDUX REPORTER', action);
  try {
    let result = next(action);
    console.log('STATE REDUX REPORTER', store.getState());
    return result;
  } catch (error) {
    error.action = action;
    console.error('ERROR IN REDUX REDUCER', error);
    return error;
  }
}

export default reporter;