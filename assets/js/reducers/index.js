import { combineReducers } from 'redux-immutable'
import {
    NOTIFY,
    DISCARD,
    SUBMIT_LOCALLY,
    RESET,
    RECEIVE_GET,
    RECEIVE_GET_ONE_BY_ID
} from '../actions';
import {
    LOADING,
    SUBMITTING,
    LOADING_COMPLETED,
    SUBMITTING_COMPLETED
} from '../util/notifications';

import WAOs from '../util/WAOs';
import GroupUtil from '../util/GroupUtil';
import SearchBagUtil from '../util/SearchBagUtil';
const Imm = require("immutable");
import { createSelector } from 'reselect';
import { reducer as reduxFormReducer } from "redux-form/immutable";


// app reducer
const initialAppState = Imm.Map({
    user:null,
    entitiesToPost:Imm.Map(),
    notifications: Imm.Map()
});

const appReducer = (state=initialAppState, action) =>{
    const {notifType,senderKey,senderParam,status} = action;
    switch (action.type) {
        case NOTIFY:
            let notification=null;
            switch(notifType){
                case LOADING :
                    notification = Imm.Map({
                        notifType : notifType,
                        senderKey : senderKey,
                        senderParam : senderParam || 'DEFAULT',
                        status:status,
                        receivedAt : Date.now(),
                    });
                    state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType],notification);
                    return state;
                case SUBMITTING :
                    notification = Imm.Map({
                        notifType : notifType,
                        senderKey : senderKey,
                        senderParam : senderParam || 'DEFAULT',
                        status:status,
                        receivedAt : Date.now(),
                    });
                    state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType],notification);
                    return state;
                case LOADING_COMPLETED :
                    notification = Imm.Map({
                        notifType : notifType,
                        senderKey : senderKey,
                        senderParam : senderParam || 'DEFAULT',
                        status:status,
                        receivedAt : Date.now(),
                    });
                    state = state.removeIn(["notifications",senderKey,senderParam || 'DEFAULT',LOADING]);
                    state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType],notification);
                    return state;
                case SUBMITTING_COMPLETED :
                    notification = Imm.Map({
                        notifType : notifType,
                        senderKey : senderKey,
                        senderParam : senderParam || 'DEFAULT',
                        status:status,
                        receivedAt : Date.now(),
                        discardedAt:null
                    });
                    state = state.removeIn(["notifications",senderKey,senderParam || 'DEFAULT',SUBMITTING]);
                    state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType],notification);
                    return state;
                default :
                    return state;
            }
        case DISCARD:
            if(state.hasIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType])){
                state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType,"discardedAt"],Date.now());
            }
            return state;
        default:
            return state;
    }
};



// waos reducers
const mergeRecords = function(iRec,nRec){
    const iLoadedGroups = iRec.get("loadedGroups");
    const nLoadedGroups = nRec.get("loadedGroups");
    const nPostedGroups = nRec.get("postedGroups");

    console.log("merging records");
    console.log(nPostedGroups);

    let mRec = iRec.mergeDeepWith((oldVal,newVal) => newVal || oldVal, nRec);
    mRec = mRec.set("loadedGroups",GroupUtil.merge(iLoadedGroups,nLoadedGroups));
    console.log("merged object");
    console.log(mRec.toJS());
    console.log("equality");
    console.log(mRec.toJSON() === iRec.toJSON());
    return mRec;
};


/**
 * object representing a given cache entry
 * total is the coreBag total number of items returned by the server, eg in the database and available for you
 * ids are in ASC order
 * @param coreBagKey
 * @param total : total number of items on server
 */
const SearchCacheEntry = function(coreBagKey,total){
    let newEntry = Imm.Map();

    newEntry = newEntry.
    set("coreBagKey",coreBagKey).
    set("total",total).
    set("indexMap",Imm.Map()).
    set("receivedAt",Date.now());

    return newEntry;
};

const concreteWaoType = (waoType) => {
    const initialWaoState = Imm.Map({
        type:waoType,
        total:-1,
        items:Imm.Map(),
        searchCache: Imm.Map()
    });
    const WAO = WAOs.getIn([waoType,"recordFactory"]);

    return (state=initialWaoState, action) => {
        if (action.waoType !== waoType) return state;
        console.log("reducer call");
        switch (action.type) {
            case SUBMIT_LOCALLY:
                console.log("submit locally");
                console.log(action);
                const oldItem = state.getIn(["items",+action.id]);
                const oldInitialValues = oldItem.get("initialValues") || Imm.Map();
                let newInitialValues = Imm.Map();
                action.data.entrySeq().forEach((value,key)=>{
                    console.log(key);
                    console.log(value);
                    if(value[1]!==oldItem.get(value[0]))
                        newInitialValues = newInitialValues.set(value[0],oldItem.get(value[0]));
                });
                newInitialValues = oldInitialValues.mergeDeepWith((oldVal,newVal) => newVal, newInitialValues);
                console.log(newInitialValues);

                const newItem = oldItem.
                mergeDeepWith((oldVal,newVal) => newVal, action.data).
                set("initialValues",newInitialValues);
                console.log(newItem.toJS());
                return state.setIn(["items",+action.id],newItem);
            case RESET:
                console.log("reset");
                for(let id of action.ids){
                    if(state.hasIn(["items",+id])){
                        let item = state.getIn(["items",+id]);
                        if(item.get("initialValues") && item.get("initialValues").size>0){
                            item = item.mergeDeepWith((oldVal,newVal) => newVal, item.get("initialValues"));
                        }
                        item = item.set("initialValues",null);
                        state = state.setIn(["items",+id],item);
                    }
                }
                return state;
            case RECEIVE_GET:
                action.waos.map(item => {
                    //console.log(item);
                    let rec = WAO(item);
                    console.log(+rec.get("id"));
                    rec = rec.get("receiveRecord")(rec);
                    if(state.hasIn(["items",+rec.get("id")]))
                        state = state.setIn(["items",+rec.get("id")],
                            mergeRecords(state.getIn(["items",+rec.get("id")]),rec));
                    else
                        state = state.setIn(["items",+rec.get("id")],rec);
                });
                if(action.searchBag && action.result){
                    let {offset,order} = action.searchBag;
                    let coreBag = SearchBagUtil.getCoreBag(action.searchBag);
                    let coreBagKey = JSON.stringify(coreBag);
                    if(!state.hasIn(["searchCache",JSON.stringify(coreBag)])){
                        state = state.setIn(["searchCache",coreBagKey],SearchCacheEntry(coreBagKey,action.total));
                    }
                    let indexMap = state.getIn(["searchCache",coreBagKey,"indexMap"]);
                    for(let i=0;i<action.result.length;i++){
                        let newStackIndex = (order===SearchBagUtil.ASC)?offset+i:action.total-(offset+i)-1;
                        indexMap = indexMap.set(+newStackIndex,+action.result[i]);
                    }
                    let entry = state.getIn(["searchCache",coreBagKey]);
                    entry = entry.
                    set("indexMap",indexMap).
                    set("total",action.total).
                    set("receivedAt",Date.now());
                    state = state.setIn(["searchCache",coreBagKey],entry);
                }
                return state;
            case RECEIVE_GET_ONE_BY_ID:
                console.log("action receive get one by id");
                console.log(action);
                let rec = WAO(action.wao);
                console.log(rec);
                rec = rec.get("receiveRecord")(rec);
                if(state.hasIn(["items",+rec.get("id")]))
                    state = state.setIn(["items",+rec.get("id")],
                        mergeRecords(state.getIn(["items",+rec.get("id")]),rec));
                else
                    state = state.setIn(["items",+rec.get("id")],rec);
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

