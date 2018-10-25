import React from 'react'
import { render } from 'react-dom'
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/Auth'
import {rootReducer} from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = [ thunk ];

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('hb-wrapper')
);
