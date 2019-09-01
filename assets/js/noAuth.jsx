import React from 'react'
import { render } from 'react-dom'
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import NoAuth from './noAuth/NoAuth'
import {rootReducer} from './noAuth/reducers'
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
        <NoAuth/>
    </Provider>,
    document.getElementById('hb-wrapper')
);
