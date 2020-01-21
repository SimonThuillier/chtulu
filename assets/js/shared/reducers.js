import {
    INITIAL,
    LOADING,
    LOADING_COMPLETED,
    SUBMITTING,
    SUBMITTING_COMPLETED
} from "../util/notifications";

import {
    NOTIFY_ARTICLE_SELECTION
} from "./actions";

import {
    NOTIFY,
    DISCARD,
    ADD_PENDING,
    REMOVE_PENDING
} from '../auth/actions';


import GroupUtil from '../util/GroupUtil';
import {getAllPropertiesInGroups} from "../util/WAOUtil";
const Imm = require("immutable");

/** THE SHARED APP REDUCER */
const initialAppState = Imm.Map({
    hbaseVersion:null,
    currentUser:null,
    entitiesToPost:Imm.Map(),
    notifications: Imm.Map(),
    articlesHistory:Imm.OrderedMap(),
    miscParams:Imm.Map()
});

export const appReducer = (state=initialAppState, action) =>{
    const {notifType,senderKey,senderParam,status,waoType,groups,id,extraData,message,errors} = action;
    console.log(action);
    //console.log(action);
    switch (action.type) {
        case NOTIFY:
            let notification=null;
            console.log(action);
            switch(notifType){
                case INITIAL :
                    notification = Imm.Map({
                        notifType : notifType,
                        senderKey : senderKey,
                        senderParam : senderParam || 'DEFAULT',
                        message:message,
                        extraData:extraData,
                        status:status,
                        receivedAt : Date.now(),
                    });
                    state = state.setIn(["notifications",senderKey,senderParam || 'DEFAULT',notifType],notification);
                    console.log(extraData);
                    if(extraData){
                        if(extraData.hbaseVersion) state = state.set('hbaseVersion',extraData.hbaseVersion);
                        console.log(extraData.hbaseVersion);
                        if(extraData.currentUser) state = state.set('currentUser',+extraData.currentUser.id);
                    }
                    return state;
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
                        discardedAt:null,
                        extraData:extraData,
                        message:message,
                        errors:errors
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
            if(id === null || +id===0){
                return state;
            }
            if(state.hasIn(["entitiesToPost",waoType,+id])){
                state = state.setIn(["entitiesToPost",waoType,+id],GroupUtil.merge(state.getIn(["entitiesToPost",waoType,+id]),groups));
            }
            else{
                state = state.setIn(["entitiesToPost",waoType,+id],groups);
            }
            return state;
        case REMOVE_PENDING:
            /*console.log("remove pending");
            console.log(action);*/
            if(state.hasIn(["entitiesToPost",waoType,+id])){
                let pendingGroups = state.getIn(["entitiesToPost",waoType,+id]);
                /*console.log("pending groups");
                console.log(pendingGroups);
                console.log("groups to remove from pending");
                console.log(groups);*/
                if(!groups){
                    state = state.removeIn(["entitiesToPost",waoType,+id]);
                }
                else{
                    let remainingGroups = GroupUtil.leftDiff(waoType,pendingGroups,groups);
                    /*console.log("remaining pending groups");
                    console.log(remainingGroups);*/
                    if(Object.keys(remainingGroups).length < 1) state = state.removeIn(["entitiesToPost",waoType,+id]);
                    else state = state.setIn(["entitiesToPost",waoType,+id],remainingGroups);
                }
            }
            return state;
        case NOTIFY_ARTICLE_SELECTION:
            return state.setIn(["articlesHistory",+id],(new Date()).getTime());
        default:
            return state;
    }
};

/** SHARED UTILITIES FOR REDUCERS */
export const mergeRecords = function(iRec,nRec,waoType){
    const iLoadedGroups = iRec.get("loadedGroups");
    const nLoadedGroups = nRec.get("loadedGroups");
    const nPostedGroups = nRec.get("postedGroups");

    let newInitialValues = iRec.get("initialValues");
    let mRec = iRec;

    //console.log("merging records");

    let loadedProperties = getAllPropertiesInGroups(waoType,Object.keys(nLoadedGroups));
    loadedProperties.forEach((property)=>{mRec = mRec.set(property,nRec.get(property));});
    mRec = mRec.set("loadedGroups",GroupUtil.merge(iLoadedGroups,nLoadedGroups));

    if(nPostedGroups && iRec.get("initialValues") ){
        //console.log("postedGroups");
        //console.log(nPostedGroups);
        let postedProperties = getAllPropertiesInGroups(waoType,Object.keys(nPostedGroups));
        //console.log("postedProperties");
        //console.log(postedProperties );

        postedProperties.forEach((property)=>{
            newInitialValues = newInitialValues.remove(property);
        });

        mRec = mRec.
        set("initialValues",newInitialValues).
        set("postedGroups",null);

        //console.log("newInitialValues");
        //console.log(newInitialValues.toJS());
    }


    /*console.log("merged object");
    console.log(mRec.toJS());*/
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
export const SearchCacheEntry = function(coreBagKey,total){
    let newEntry = Imm.Map();

    newEntry = newEntry.
    set("coreBagKey",coreBagKey).
    set("total",total).
    set("indexMap",Imm.Map()).
    set("receivedAt",Date.now()).
    set("invalidatedAt",null);

    return newEntry;
};

/**
 * function called when new objects have been added/deleted on one waoType to force reloading from the server
 * when new queries are executed
 * @param state
 */
export const invalidateAllCacheEntries = function(state){
    const cacheEntries = state.get("searchCache");

    cacheEntries.entrySeq().forEach(entry => {
            console.log(entry[0]);
            console.log(entry[1]);
            state = state.setIn(["searchCache",entry[0],"invalidatedAt"],Date.now());
        }
    );
    return state;
};

export const updateOnRecordReception = function(state,rec){
    const waoType = state.get("type");
    rec = rec.get("receiveRecord")(rec);
    let oldId = (+rec.get("oldId"))<0?+rec.get("oldId"):+rec.get("id");
    // case new item submitted : its definitive id has been attributed by the server
    let mustInvalidateCache = false;
    if(rec.get("toDelete")===true){
        state = state.removeIn(["items",+rec.get("id")]);
        mustInvalidateCache = true;
    }
    else if((+rec.get("id")) !== oldId){
        state = state.
        setIn(["items",+rec.get("id")],
            mergeRecords(state.getIn(["items",+oldId]),rec.set("oldId",0).remove("initialValues"),waoType)).
        removeIn(["items",oldId]).
        removeIn(["babyItemIds",oldId]).
        setIn(["createdItemIds",oldId],+rec.get("id"));
        mustInvalidateCache = true;
    }
    else if(state.hasIn(["items",+rec.get("id")]))
        state = state.setIn(["items",+rec.get("id")],
            mergeRecords(state.getIn(["items",+rec.get("id")]),rec,waoType));
    else
        state = state.setIn(["items",+rec.get("id")],rec);

    if(mustInvalidateCache) state = invalidateAllCacheEntries(state);

    return state;
};