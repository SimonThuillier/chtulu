import { combineReducers } from 'redux-immutable'
import {
    RECEIVE_GET,
    RECEIVE_GET_ONE_BY_ID
} from '../actions';

import WAOs from '../util/WAOs';
import SearchBagUtil from '../util/SearchBagUtil';
const Imm = require("immutable");
import { reducer as reduxFormReducer } from "redux-form/immutable";
import {appReducer,updateOnRecordReception,SearchCacheEntry} from '../shared/reducers';

/** SIMPLIFIED READ ONLY REDUCERS FOR WAOS */
const concreteWaoType = (waoType) => {
    const initialWaoState = Imm.Map({
        type:waoType,
        total:-1,
        //nextNewId:-1,
        //newItem:null,
        //babyItemIds:Imm.Map(),
        //createdItemIds:Imm.Map(),
        items:Imm.Map(),
        searchCache: Imm.Map()
    });
    const WAO = WAOs.getIn([waoType,"recordFactory"]);

    return (state=initialWaoState, action) => {
        if (action.waoType !== waoType) return state;
        //console.log("reducer call");
        switch (action.type) {
            case RECEIVE_GET:
                action.waos.map(item => {
                    //console.log(item);
                    let rec = WAO(item);
                    state = updateOnRecordReception(state,rec);
                });
                if(action.searchBag && action.result){
                    let {offset,order} = action.searchBag;
                    let coreBag = SearchBagUtil.getCoreBag(action.searchBag);
                    let coreBagKey = JSON.stringify(coreBag);
                    if(!state.hasIn(["searchCache",JSON.stringify(coreBag)])){
                        state = state.setIn(["searchCache",coreBagKey],SearchCacheEntry(coreBagKey,action.total));
                    }
                    let indexMap = state.getIn(["searchCache",coreBagKey,"indexMap"]);
                    /*console.log("receive get");
                    console.log(action);*/
                    for(let i=0;i<action.result.length;i++){
                        //console.log('indexMap key');
                        //console.log(`order ${order} , offset ${offset} , total ${action.total}`);
                        let newStackIndex = (order===SearchBagUtil.ASC)?offset+i:action.total-(offset+i)-1;
                        //console.log(`newStackIndex ${newStackIndex}`);
                        indexMap = indexMap.set(+newStackIndex,+action.result[i]);
                    }
                    // indexMap = indexMap.sortBy((v,k)=>+k,(a,b)=>a>b?1:a<b?-1:0); TODO : check if it can work
                    let entry = state.getIn(["searchCache",coreBagKey]);
                    entry = entry.
                    set("indexMap",indexMap).
                    set("total",action.total).
                    set("receivedAt",Date.now());
                    state = state.setIn(["searchCache",coreBagKey],entry);
                }
                return state;
            case RECEIVE_GET_ONE_BY_ID:
                /*console.log("action receive get one by id");
                console.log(action);*/
                let rec = WAO(action.wao);
                state = updateOnRecordReception(state,rec);
                return state;
            default:
                return state;
        }
    }
};

let waoReducers = {};
WAOs.entrySeq().forEach(entry => {
    waoReducers[entry[0]] = concreteWaoType(entry[0]);
});

waoReducers.app =  appReducer;
waoReducers.form =  reduxFormReducer;

export const rootReducer = combineReducers(
    waoReducers);

