import { combineReducers } from 'redux'
import {
    GET
} from '../actions'

const getData = (state = 'reactjs', action) => {
    switch (action.type) {
        case GET:
            return {type:{1:{id:1,label:"1"},2:{id:2,label:"2"}}};
        default:
            return {type:{1:{id:1,label:"1"},2:{id:2,label:"2"}}};
    }
};

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
//
// const postsBySubreddit = (state = { }, action) => {
//     switch (action.type) {
//         case INVALIDATE_SUBREDDIT:
//         case RECEIVE_POSTS:
//         case REQUEST_POSTS:
//             return {
//                 ...state,
//                 [action.subreddit]: posts(state[action.subreddit], action)
//             }
//         default:
//             return state
//     }
// }

const rootReducer = combineReducers({
    getData
});

export default rootReducer
