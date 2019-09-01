import React from 'react'
import { render } from 'react-dom'
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Auth from './auth/Auth'
import {rootReducer} from './auth/reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
require('./app.js');

const middleware = [ thunk ];

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

render(
    <Provider store={store}>
        <Auth/>
    </Provider>,
    document.getElementById('hb-wrapper')
);
