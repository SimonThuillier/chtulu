import { combineReducers } from 'redux-immutable'
import {LOAD_FOR_EDIT,GET,RECEIVE_GET,GET_ONE_BY_ID,RECEIVE_GET_ONE_BY_ID} from '../actions'
import WAOs from '../util/WAOs'
import GroupUtil from '../util/GroupUtil';
const Imm = require("immutable");
import { createSelector } from 'reselect';
import { reducer as reduxFormReducer } from "redux-form/immutable";

const mergeRecords = function(iRec,nRec){
    const iLoadedGroups = iRec.get("loadedGroups");
    const nLoadedGroups = nRec.get("loadedGroups");

    let mRec = iRec.mergeDeepWith((oldVal,newVal) => newVal || oldVal, nRec);
    mRec = mRec.set("loadedGroups",GroupUtil.merge(iLoadedGroups,nLoadedGroups));
    console.log("merged object");
    console.log(mRec.toJS());
    console.log("equality");
    console.log(mRec.toJSON() === iRec.toJSON());
    return mRec;
};

const searchCacheEntry = function(searchBag,ids){
    return {
       searchBagKey : JSON.stringify(searchBag),
       ids : ids,
       receivedAt : Date.now()
    }
};

const concreteWaoType = (waoType) => {
    const initialWaoState = Imm.Map({
        type:waoType,
        total:-1,
        items:Imm.Map(),
        pendingIds:Imm.Map(),
        searchCache: Imm.Map()
    });
    const WAO = WAOs.getIn([waoType,"recordFactory"]);

    return (state=initialWaoState, action) => {
        if (action.waoType !== waoType) return state;
        console.log("reducer call");
        switch (action.type) {
            //case LOAD_FOR_EDIT:
                //return state.set("pendingIds",(state.get("pendingIds").set(action.formUid,+action.id)));
            case GET:
                return state;
            case GET_ONE_BY_ID:
                return state;
            case RECEIVE_GET:
                console.log("action receive get");
                console.log(waoType);
                console.log(action);
                let ids = [];
                action.waos.map(item => {
                    console.log(item);
                    let rec = WAO(item);
                    console.log(rec);
                    rec = rec.get("receiveRecord")(rec);
                    if(state.get("items").has(+rec.get("id")))
                        state = state.set("items",
                            state.get("items").set(+rec.get("id"),mergeRecords(state.get("items").get(+rec.get("id")),rec)));
                    else
                        state = state.set("items",
                            state.get("items").set(+rec.get("id"),rec));
                    ids.push(+rec.get("id"));
                });
                if(action.searchBag)
                    state = state.set("searchCache",
                        state.get("searchCache").set(JSON.stringify(action.searchBag),searchCacheEntry(action.searchBag,ids)));
                return state;
            case RECEIVE_GET_ONE_BY_ID:
                console.log("action receive get one by id");
                console.log(waoType);
                console.log(action);
                let rec = WAO(action.wao);
                rec = rec.get("receiveRecord")(rec);
                if(state.get("items").has(+rec.get("id")))
                    state = state.set("items",
                        state.get("items").set(+rec.get("id"),mergeRecords(state.get("items").get(+rec.get("id")),rec)));
                else
                    state = state.set("items",
                        state.get("items").set(+rec.get("id"),rec));
                return state;
            default:
                return state;
        }
    }
};

export const getOneByIdSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (id) => items.get(+id)
);
export const getByIdsSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (ids) => ids.map(id => items.get(+id))
);
export const getSelector = createSelector(
    [(state) => state.get("items"),(state) => state.get("searchCache")],
    (items,searchCache) => (searchBag) => {
        const searchCacheEntry = searchCache.get(JSON.stringify(searchBag));
        if(! searchCacheEntry) return [];
        return searchCacheEntry.ids.map((id)=> items.get(+id));
    }
);
export const getPendingSelector = createSelector(
    [(state) => state.get("items"),(state) => state.get("pendingIds")],
    (items,pendingIds) => (uid) => (pendingIds.has(uid))?items.get(+pendingIds.get(uid)):null
);

/*
let getOneByIdSelectorsToExport = {};
let getByIdsSelectorsToExport = {};
let getSelectorsToExport = {};
*/

let waoReducers = {};
WAOs.entrySeq().forEach(entry => {
    waoReducers[entry[0]] = concreteWaoType(entry[0]);
    //getOneByIdSelectorsToExport[entry[0]] = getOneByIdSelector(state[entry[0]]);
    //getByIdsSelectorsToExport[entry[0]] = getByIdsSelector(state[entry[0]]);
    //getSelectorsToExport[entry[0]] = getSelector(state[entry[0]]);
});

/*const formReducer = (state = null, action) => {
    switch (action.type) {
        case LOAD:
            console.log(`load pending ${action.waoType} of id ${action.id} for form of uid ${action.formUid}`);
            return state.set("data",action.data);
        default:
            return state;
    }
};
waoReducers.formReducer = formReducer;*/
waoReducers.form =  reduxFormReducer;

export const rootReducer = combineReducers(
    waoReducers);

/*export const getOneByIdSelectors = getOneByIdSelectorsToExport;
export const getByIdsSelectors = getByIdsSelectorsToExport;
export const getSelectors = getSelectorsToExport;*/

