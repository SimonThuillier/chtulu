import React from 'react'
import { render } from 'react-dom'
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/Auth'
import reducer from './reducers'
import thunk from 'redux-thunk'

const middleware = [ thunk ];

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('hb-wrapper')
);
