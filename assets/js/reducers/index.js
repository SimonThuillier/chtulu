import { combineReducers } from 'redux'
import {GET,RECEIVE_GET,GET_ONE_BY_ID,RECEIVE_GET_ONE_BY_ID} from '../actions'
import WAOs from '../util/WAOs'
import GroupUtil from '../util/GroupUtil';
const Imm = require("immutable");
import { createSelector } from 'reselect';

const mergeRecords = function(iRec,nRec){
    const iLoadedGroups = iRec.get("loadedGroups");
    const nLoadedGroups = nRec.get("loadedGroups");

    let mRec = iRec.mergeDeepWith((oldVal,newVal) => newVal || oldVal, nRec);
    mRec = mRec.set("loadedGroups",GroupUtil.merge(iLoadedGroups,nLoadedGroups));
    console.log("merged object");
    console.log(mRec.toJS());
    return mRec;
};

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
            case GET_ONE_BY_ID:
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
            case RECEIVE_GET_ONE_BY_ID:
                console.log("action receive get one by id");
                console.log(waoType);
                console.log(action);
                let rec = WAO(action.wao);
                rec = rec.get("receiveRecord")(rec);
                if(state.items.has(rec.get("id"))) state.items.set(rec.get("id"),mergeRecords(state.items.get(rec.get("id")),rec));
                else state.items.set(rec.get("id"),rec);
                return {
                    ...state
                };
            default:
                return state;
        }
    }
};

const getOneByIdSelector = (waoType) => {
    return (state) => {
        const items = state[waoType].items;
        return (id) => items.get(id);
    }
};

let getOneByIdSelectorsToExport = {};

let waoReducers = {};
WAOs.entrySeq().forEach(entry => {
    waoReducers[entry[0]] = concreteWaoType(entry[0]);
    getOneByIdSelectorsToExport[entry[0]] = createSelector(
        [ getOneByIdSelector(entry[0]) ],
        (item) => item
    );
});

export const rootReducer = combineReducers(
    waoReducers);

export const getOneByIdSelectors = getOneByIdSelectorsToExport;

