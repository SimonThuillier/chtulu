import { combineReducers } from 'redux'
import {GET,RECEIVE_GET} from '../actions'

const types = (state = {
    isFetching: false,
    items: []
}, action) => {
    switch (action.type) {
        case GET:
            return {
                ...state,
                didInvalidate: true
            }
        default:
            return state
    }
};

const ArticleType = (state = {items:null}, action) => {
    console.log("reducer ArticleType appelé");
    switch (action.type) {
        case GET:
            return state;
        case RECEIVE_GET:
            console.log("action receive get");
            console.log(action);
            action.waos.map(item => state.items.set(item.id,item));
            return {
                ...state
            };
        default:
            if(state.items === null){state.items= new Map();}
            return state;
    }
};

const rootReducer = combineReducers({
    ArticleType
});

export default rootReducer
