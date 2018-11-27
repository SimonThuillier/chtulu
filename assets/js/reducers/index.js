import { combineReducers } from 'redux-immutable'
import {
    NOTIFY,
    DISCARD,
    SUBMIT_LOCALLY,
    ADD_PENDING,
    REMOVE_PENDING,
    RESET,
    RESET_ALL_PENDING,
    RECEIVE_GET,
    RECEIVE_GET_ONE_BY_ID,
    RECEIVE_NEW,
    CREATE_NEW,
    DELETE
} from '../actions';
import {
    LOADING,
    SUBMITTING,
    LOADING_COMPLETED,
    SUBMITTING_COMPLETED
} from '../util/notifications';

import WAOs from '../util/WAOs';
import {getAllPropertiesInGroups} from '../util/WAOUtil';
import GroupUtil from '../util/GroupUtil';
import SearchBagUtil from '../util/SearchBagUtil';
const Imm = require("immutable");
import { reducer as reduxFormReducer } from "redux-form/immutable";
import Common from '../util/common';


// app reducer
const initialAppState = Imm.Map({
    user:null,
    entitiesToPost:Imm.Map(),
    notifications: Imm.Map()
});

const appReducer = (state=initialAppState, action) =>{
    const {notifType,senderKey,senderParam,status,waoType,groups,id} = action;
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
        case ADD_PENDING:
            if(state.hasIn(["entitiesToPost",waoType,+id])){
                state = state.setIn(["entitiesToPost",waoType,+id],GroupUtil.merge(state.getIn(["entitiesToPost",waoType,+id]),groups));
            }
            else{
                state = state.setIn(["entitiesToPost",waoType,+id],groups);
            }
            return state;
        case REMOVE_PENDING:
            console.log("remove pending");
            console.log(action);
            if(state.hasIn(["entitiesToPost",waoType,+id])){
                let pendingGroups = state.getIn(["entitiesToPost",waoType,+id]);
                console.log("pending groups");
                console.log(pendingGroups);
                console.log("groups to remove from pending");
                console.log(groups);
                let remainingGroups = GroupUtil.leftDiff(waoType,pendingGroups,groups);
                console.log("remaining pending groups");
                console.log(remainingGroups);
                if(Object.keys(remainingGroups).length < 1) state = state.removeIn(["entitiesToPost",waoType,+id]);
                else state = state.setIn(["entitiesToPost",waoType,+id],remainingGroups);
            }
            return state;
        default:
            return state;
    }
};




// waos reducers
const mergeRecords = function(iRec,nRec,waoType){
    const iLoadedGroups = iRec.get("loadedGroups");
    const nLoadedGroups = nRec.get("loadedGroups");
    const nPostedGroups = nRec.get("postedGroups");

    let newInitialValues = iRec.get("initialValues");
    let mRec = iRec;

    console.log("merging records");
    if(nPostedGroups && iRec.get("initialValues") ){
        //console.log("postedGroups");
        //console.log(nPostedGroups);
        let postedProperties = getAllPropertiesInGroups(waoType,Object.keys(nPostedGroups));
        let loadedProperties = getAllPropertiesInGroups(waoType,Object.keys(nLoadedGroups));
        //console.log("postedProperties");
        //console.log(postedProperties );

        postedProperties.forEach((property)=>{newInitialValues = newInitialValues.remove(property);});
        loadedProperties.forEach((property)=>{mRec = mRec.set(property,nRec.get(property));});
        //console.log("newInitialValues");
        //console.log(newInitialValues.toJS());
    }

    mRec = mRec.
    set("loadedGroups",GroupUtil.merge(iLoadedGroups,nLoadedGroups)).
    set("initialValues",newInitialValues).
    set("postedGroups",null);
    console.log("merged object");
    console.log(mRec.toJS());
    /*console.log("equality");
    console.log(mRec.toJSON() === iRec.toJSON());*/
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

const updateOnRecordReception = function(state,rec){
    const waoType = state.get("type");
    rec = rec.get("receiveRecord")(rec);
    let oldId = (+rec.get("oldId"))<0?+rec.get("oldId"):+rec.get("id");
    // case new item submitted : its definitive id has been attributed by the server
    if((+rec.get("id")) !== oldId)
        state = state.
        setIn(["items",+rec.get("id")],
            mergeRecords(state.getIn(["items",+oldId]),rec.set("oldId",0).remove("initialValues"),waoType)).
        removeIn(["items",oldId]).
        removeIn(["babyItemIds",oldId]).
        set("searchCache",Imm.Map());
    else if(state.hasIn(["items",+rec.get("id")]))
        state = state.setIn(["items",+rec.get("id")],
            mergeRecords(state.getIn(["items",+rec.get("id")]),rec,waoType));
    else
        state = state.setIn(["items",+rec.get("id")],rec);

    return state;
};


const concreteWaoType = (waoType) => {
    const initialWaoState = Imm.Map({
        type:waoType,
        total:-1,
        nextNewId:-1,
        newItem:null,
        babyItemIds:Imm.Map(),
        items:Imm.Map(),
        searchCache: Imm.Map()
    });
    const WAO = WAOs.getIn([waoType,"recordFactory"]);
    const idGenerator = Common.getIdGenerator(-1,-1);

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
                        let newInitialValues = item.hasIn("initialValues",null);
                        item = item.set("initialValues",null);
                        state = state.setIn(["items",+id],item);
                    }
                }
                return state;
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
                state = updateOnRecordReception(state,rec);
                return state;
            case RECEIVE_NEW:
                console.log(`receiveNew ${waoType}`);
                console.log(action);
                let newRec = WAO(action.wao);
                newRec = newRec.get("receiveRecord")(newRec);
                state = state.set("newItem",newRec);
                return state;
            case CREATE_NEW:
                if(! state.get("newItem")) return state;
                console.log(`createNew ${waoType}`);
                console.log(action);
                let newId = idGenerator();
                let babyRec = state.get("newItem");
                console.log(babyRec);
                babyRec = babyRec.set("id",newId).set("initialValues",Imm.Map({id:0}));
                state = state.
                setIn(["items",newId],babyRec).
                setIn(["babyItemIds",newId],newId).
                set("nextNewId",newId-1);
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

