import { combineReducers } from 'redux'
import {GET,RECEIVE_GET} from '../actions'
import WAOs from '../util/WAOs'
const Imm = require("immutable");

const concreteWaoType = (waoType) => {
    const initialWaoState = {
        type:waoType,
        total:-1,
        items:new Map()
    };
    const WAO = WAOs.getIn([waoType,"recordFactory"]);

    return (state=initialWaoState, action) => {
        if (action.waoType !== waoType) return state;
        switch (action.type) {
            case GET:
                return state;
            case RECEIVE_GET:
                console.log("action receive get");
                console.log(waoType);
                console.log(action);
                action.waos.map(item => {
                    let rec = WAO(item);
                    rec = rec.get("receiveRecord")(rec);
                    state.items.set(rec.get("id"),rec);
                });
                return {
                    ...state
                };
            default:
                return state;
        }
    }
};

let waoReducers = {};
WAOs.entrySeq().forEach(entry => {
    waoReducers[entry[0]] = concreteWaoType(entry[0]);
});

const rootReducer = combineReducers(
    waoReducers);

export default rootReducer
