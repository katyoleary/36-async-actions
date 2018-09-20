'use strict';

import { combineReducers } from 'redux';
import lists from './list-reducer';

export default combineReducers({ lists });
//other reducers are passed in here when we add them