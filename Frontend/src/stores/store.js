import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import counterReducer from './reducer'


export const store = createStore(counterReducer, applyMiddleware(thunk))