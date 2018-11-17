import { combineReducers } from 'redux-immutable'
import {
    SUBMIT_LOCALLY,
    RESET,
    GET,
    RECEIVE_GET,
    GET_ONE_BY_ID,
    RECEIVE_GET_ONE_BY_ID} from '../actions'
import WAOs from '../util/WAOs';
import GroupUtil from '../util/GroupUtil';
import SearchBagUtil from '../util/SearchBagUtil';
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

/**
 * object representing a given cache entry
 * total is the coreBag total number of items returned by the server, eg in the database and available for you
 * ids are in ASC order
 * @param coreBag
 * @param total
 * @param indexMap
 * @returns {{coreBagKey: string, ids: *, receivedAt: number}}
 */
const searchCacheEntry = function(coreBag,total,indexMap){
    return {
       coreBagKey : JSON.stringify(coreBag),
       total:total,
       indexMap : indexMap,
       receivedAt : Date.now()
    }
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
            //case LOAD_FOR_EDIT:
                //return state.set("pendingIds",(state.get("pendingIds").set(action.formUid,+action.id)));
            case GET:
                return state;
            case SUBMIT_LOCALLY:
                console.log("submit locally");
                console.log(action);
                const oldItem = state.getIn(["items",+action.id]);
                const oldInitialValues = oldItem.get("initialValues") || Imm.Map();
                let newInitialValues = Imm.Map();
                action.data.entrySeq().forEach((value,key)=>{
                    console.log(key);
                    console.log(value);
                    if(value[1] && value[1]!==oldItem.get(value[0]))
                        newInitialValues = newInitialValues.set(value[0],oldItem.get(value[0]));
                });
                newInitialValues = oldInitialValues.mergeDeepWith((oldVal,newVal) => newVal || oldVal, newInitialValues);
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
            case GET_ONE_BY_ID:
                return state;
            case RECEIVE_GET:
                /*console.log("action receive get");
                console.log(waoType);
                console.log(action);*/
                if(action.searchBag){
                    var total = action.total;
                    var coreBag = SearchBagUtil.getCoreBag(action.searchBag);
                    var {offset,order} = action.searchBag;
                    console.log(action.searchBag);
                    console.log(action.total);
                    console.log(coreBag);
                    console.log(state.getIn(["searchCache",JSON.stringify(coreBag)]));

                    var indexMap = state.hasIn(["searchCache",JSON.stringify(coreBag)])?
                        state.getIn(["searchCache",JSON.stringify(coreBag),"indexMap"]):new Map();
                    console.log(indexMap);
                    var index = 0;
                }
                action.waos.map(item => {
                    //console.log(item);
                    let rec = WAO(item);
                    //console.log(rec);
                    rec = rec.get("receiveRecord")(rec);
                    if(state.hasIn(["items",+rec.get("id")]))
                        state = state.setIn(["items",+rec.get("id")],
                            mergeRecords(state.getIn(["items",+rec.get("id")]),rec));
                    else
                        state = state.setIn(["items",+rec.get("id")],rec);

                    if(action.searchBag){
                        indexMap.set((order===SearchBagUtil.ASC)?offset+index:total-(offset+index)-1,+rec.get("id"));
                        index = index+1;
                    }
                });
                if(action.searchBag){
                    console.log("final cacheEntry");
                    console.log(searchCacheEntry(coreBag,total,indexMap));
                    state = state.setIn(["searchCache",JSON.stringify(coreBag)],searchCacheEntry(coreBag,total,indexMap));
                }
                return state;
            case RECEIVE_GET_ONE_BY_ID:
                //console.log("action receive get one by id");
                //console.log(waoType);
                //console.log(action);
                let rec = WAO(action.wao);
                //console.log(rec);
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
        const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
        const {offset,limit} = searchBag;
        if(! searchCacheEntry) return [];
        let indexMap = (searchBag.order===SearchBagUtil.ASC)?searchCacheEntry.indexMap:
            SearchBagUtil.invertIndexMap(searchCacheEntry.indexMap,searchCacheEntry.total);
        //console.log("proto new GetSelector");
        let selectedEntries = [];
        indexMap.forEach((v,k)=>{
            //console.log(`k : ${k}, v : ${v}`);
            if(k>=offset && k<(offset+limit)) selectedEntries.push(v);
        });
        //console.log(selectedEntries);

        return selectedEntries.map((id)=> items.get(+id));
    }
);
export const totalSelector2 = createSelector(
    [(state) => state.get("items"),(state) => state.get("searchCache")],
    (items,searchCache) => (searchBag) => {
        const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
        if(! searchCacheEntry) return -1;
        return searchCacheEntry.total;
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

