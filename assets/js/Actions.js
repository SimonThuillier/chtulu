import Dispatcher from 'Dispatcher.js';
import ActionTypes from 'ActionTypes.js';

const Actions = {
    get(text) {
        Dispatcher.dispatch({
            type: ActionTypes.GET,
            text,
        });
    },
};

export default Actions;