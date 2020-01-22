import SearchBag from '../util/SearchBag';
import {
    HTTP_POST,
    URL_GET,
    URL_GET_ONE_BY_ID,
    URL_GET_NEW,
    URL_UPLOAD,
    URL_LOGOUT,
    URL_CONTACT,
    getUrl,
    getHTTPProps,
    getHTTPUploadProps,
    getHBProps,
    DataToPost,
    HB_SUCCESS,
    HB_ERROR,
    URL_POST, HB_WARNING, INITIAL_HRESPONSE, HB_INFO, HB_CONFIRM, URL_LOGIN, URL_REGISTER
} from '../util/server';
import { normalize,denormalize, schema } from 'normalizr';
import WAOs from '../util/WAOs';
import {getDataToPost} from '../util/WAOUtil';
import GroupUtil from "../util/GroupUtil";
import SearchBagUtil from '../util/SearchBagUtil';
import {entitiesSelector,getPendingTotalSelector} from '../shared/selectors';
import {INITIAL, LOADING, LOADING_COMPLETED, SUBMITTING, SUBMITTING_COMPLETED} from '../util/notifications';
import {startSubmit,stopSubmit} from 'redux-form';

// notifications actions
export const NOTIFY = 'NOTIFY';
export const DISCARD = 'DISCARD';
// data reception actions
export const GET = 'GET';
export const RECEIVE_GET = 'RECEIVE_GET';
export const RECEIVE_NEW = 'RECEIVE_NEW';
export const GET_ONE_BY_ID = 'GET_ONE_BY_ID';
export const RECEIVE_GET_ONE_BY_ID = 'RECEIVE_GET_ONE_BY_ID';
// data creation and removal
export const CREATE_NEW = 'CREATE_NEW';
export const DELETE = 'DELETE';
// form actions
export const SUBMIT_LOCALLY = 'SUBMIT_LOCALLY';
export const RESET = 'RESET';
export const ADD_PENDING = 'ADD_PENDING';
export const REMOVE_PENDING = 'REMOVE_PENDING';
export const RESET_ALL_PENDING = 'RESET_ALL_PENDING';
// submission to server actions
export const POST_ONE = 'POST_ONE';
export const POST_ALL = 'POST_ALL';

export const TIMEOUT = 5000;

// MAP to hold the various get called made and prevent double calls
const pendingAPICalls = new Map();


export const notify = (notifType,
                       senderKey=null,
                       senderParam=null,
                       status=HB_SUCCESS,
                       extraData=null,
                       message='',
                       errors=null) => ({
    type: NOTIFY,
    notifType : notifType,
    senderKey : senderKey || 'HBAPP',
    senderParam: senderParam,
    status:status,
    extraData:extraData,
    message:message,
    errors:errors
});

export const discard = (notifType,senderKey=null,senderParam=null) => ({
    type: DISCARD,
    notifType : notifType,
    senderKey : senderKey || 'HBAPP',
    senderParam: senderParam
});

/**
 * @param url string
 * @param props object
 * @param timeout integer
 * @returns {Promise<any>}
 */
const fetchWithTimeout = function( url,props, timeout=TIMEOUT ) {
    return new Promise( (resolve, reject) => {
        // Set timeout timer
        let timer = setTimeout(
            () => reject( new Error('Request timed out') ),
            timeout
        );

        fetch( url ,props).then(
            response => resolve( response ),
            err => reject( err )
        ).finally( () => clearTimeout(timer) );
    })
};

export const uploadResource = (file,name,contentType,resourceType,senderKey,resourceId=null) => (dispatch,getState) => {
    console.log("upload resource",file,name,contentType,resourceType,senderKey);

    const url = getUrl(URL_UPLOAD,{
        name:name,
        contentType:contentType,
        resourceType:resourceType.id,
        resourceId:resourceId,
        senderKey:senderKey,
        _token:DataToPost()._token
    });
    let httpProps = getHTTPUploadProps(contentType);
    httpProps.body = file;

    //console.log(httpProps);

    //console.log(`senderKey : ${senderKey}`);

    dispatch(notify(SUBMITTING,senderKey,0));

    return fetch(url,httpProps)
        .then(response => response.json())
        .then(json => {
                json.data = JSON.parse(json.data);
                console.log("upload post returned !",json);
                switch (json.status) {
                    case HB_SUCCESS:
                        // not canonical but fast to to
                        // todo : improve later
                        const resourceId = Object.keys(json.data.resource)[0];
                        console.log(json.data);
                        console.log(`resourceId ${resourceId}`);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',0,HB_SUCCESS,{resourceId:+resourceId}));
                        handlePostBackData(json.data,dispatch);
                        break;
                    case HB_ERROR:
                        console.log(json.data);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',0,HB_ERROR,null,json.message));
                        break;
                    default:
                }
            }
        )
};




export const postOne = (waoType,groups=true,id,senderKey) => (dispatch,getState) => {
    console.log("postOne");


    const state = getState();
    let entities = entitiesSelector(state);
    //entities = {articleType:{'2':{id:2,label:"lol"}},resource:{}};
    /*console.log("entities");
    console.log(entities);
    console.log("schema");
    console.log(WAOs.getIn([waoType,"schema"]));*/
    let normData = state.getIn([waoType,"items",+id]);
    console.log(senderKey);
    console.log('lol2');
    console.log(`denormData to send ${id}`);
    console.log(normData);
    console.log(`normData to send ${id}`);
    //normData.type=2;
    normData = denormalize(normData,WAOs.getIn([waoType,"schema"]),entities);
    normData = normData.toJS();
    /*console.log(normData);
    console.log("groups to send");
    console.log(groups);*/
    if(!groups){
        groups = state.getIn(["app","entitiesToPost",waoType,+id]) || true;
    }
    normData = getDataToPost(waoType,normData,groups);
    /*console.log(`partial normData to send ${id}`);
    console.log(normData);*/

    let dataToPost = DataToPost().add(waoType,id,normData);
    console.log(`dataToPost`);
    console.log(dataToPost);

    const url = getUrl(URL_POST);
    let httpProps = getHTTPProps(HTTP_POST);
    httpProps.body = JSON.stringify(dataToPost);

    //console.log(httpProps);

    //dispatch(startAsyncValidation(senderKey));
    dispatch(startSubmit(senderKey));
    dispatch(notify(SUBMITTING,senderKey || 'HBAPP',id));

    return fetch(url,httpProps)
        .then(response => response.json())
        .catch(exception => {
            dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',id,HB_ERROR,null,"Le serveur est tombé en erreur :(",null));
            }
        )
        .then(json => {
            console.log("post returned !");
            console.log(json);
            json.data = JSON.parse(json.data);
                switch (json.status) {
                    case HB_SUCCESS:
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',id,HB_SUCCESS));
                        dispatch(stopSubmit(senderKey,null));
                        handlePostBackData(json.data,dispatch);
                        //dispatch(receiveGet(waoType,groups,searchBag,json.rows,json.total,json.message));
                        break;
                    case HB_ERROR:
                        console.log("retour en erreur : ");
                        console.log(json.errors);
                        //json.errors = JSON.parse(json.errors);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',id,HB_ERROR,null,json.message,json.errors));
                        //dispatch(errorGet(waoType,groups,searchBag,json.message));
                        //dispatch(stopSubmit(senderKey,json.errors));
                        let thisError = json.errors?json.errors[Object.keys(json.errors)[0]]:null;
                        dispatch(stopSubmit(senderKey,thisError));
                        handlePostBackData(json.data,dispatch);
                        break;
                    default:
                }
            }
        )
};

export const postAll = (senderKey=null) => (dispatch,getState) => {
    const state = getState();
    const pendingTotalSelector = getPendingTotalSelector(state.get("app"));
    if(pendingTotalSelector()<1) return;

    let entities = entitiesSelector(state);
    let dataToPost = DataToPost();//.add(waoType,id,normData);
    state.getIn(["app","entitiesToPost"]).entrySeq().forEach((entry)=>{
        let waoType = entry[0];
        let items = entry[1];
        items.entrySeq().forEach((entry)=>{
            let id = entry[0];
            let groups = entry[1];
            let normData = state.getIn([waoType,"items",+id]);
            console.log(`post all : ${waoType} , ${id} `);
            console.log(normData);
            normData = denormalize(normData,WAOs.getIn([waoType,"schema"]),entities);
            normData = normData.toJS();
            normData = getDataToPost(waoType,normData,groups);
            dataToPost.add(waoType,id,normData);
        });
    });

    //console.log(`dataToPost ALL !`);
    //console.log(dataToPost);

    const url = getUrl(URL_POST);
    let httpProps = getHTTPProps(HTTP_POST);
    httpProps.body = JSON.stringify(dataToPost);

    dispatch(notify(SUBMITTING,senderKey || 'HBAPP',null));

    return fetch(url,httpProps)
        .then(response => response.json())
        .catch(exception => {
                dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',id,HB_ERROR,null,"Le serveur est tombé en erreur :(",null));
            }
        )
        .then(json => {
                //console.log("post returned !");
                json.data = JSON.parse(json.data);
                //console.log(json);
                switch (json.status) {
                    case HB_SUCCESS:
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',null,HB_SUCCESS));
                        handlePostBackData(json.data,dispatch);
                        //dispatch(receiveGet(waoType,groups,searchBag,json.rows,json.total,json.message));
                        break;
                    case HB_ERROR:
                        console.log("retour en erreur : ");
                        console.log(json.errors);
                        //json.errors = JSON.parse(json.errors);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',null,HB_ERROR,null,json.message,json.errors));
                        handlePostBackData(json.data,dispatch);
                        break;
                    default:
                }
            }
        )
};



const handlePostBackData = (backData,dispatch) =>{
    Object.keys(backData).forEach((waoType)=>{
        Object.keys(backData[waoType]).forEach((id)=>{
            let object = backData[waoType][id];
            let groups = object.backGroups;
            let postedGroups = object.loadedGroups;
            object.loadedGroups = groups;
            object.postedGroups = postedGroups;
            //receiveGetOneById = (waoType,groups,id,data,message="Données bien recues du serveur")
            //console.log("redispatched object after post");
            //console.log(object);
            dispatch(removePending(waoType,+object.oldId<0?+object.oldId:+id,object.toDelete?null:postedGroups));
            dispatch(receiveGetOneById(waoType,groups,id,object,"Données bien enregistrées sur le serveur"));
        });
    });
};

export const addPending = (waoType,id,groups) => ({
        type: ADD_PENDING,
        waoType: waoType,
        groups: groups,
        id: id
    }
);

export const removePending = (waoType,id,groups) => ({
        type: REMOVE_PENDING,
        waoType: waoType,
        groups: groups,
        id: id
    }
);

// pour gestion du cas limite d'edition d'un element en cours de creation
const pendingCreations = {};

export const submitLocally = (waoType,data,id,groups) => (dispatch,getState) => {
    if(getState().hasIn([waoType,"items",+id])){
        dispatch(addPending(waoType,id,groups));
        return dispatch({
            type: SUBMIT_LOCALLY,
            waoType: waoType,
            data: data,
            id: id
        });
    }
    else{
        /*if(!pendingCreations.has(`${waoType}-${id}`)){
            dispatch(getOneByIdIfNeeded(waoType,groups,id));
            setTimeout(()=>{
                pendingCreations.set(`${waoType}-${id}`,{data:data,groups:groups});
            },20);
        }
        else{
            pendingCreations.set(`${waoType}-${id}`,{data:data,groups:groups});
        }*/
    }
};

export const reset = (waoType,ids,groups) => (dispatch,state) =>{
    ids.forEach((id)=>{
        setTimeout(()=>dispatch(removePending(waoType,id,groups)),10);
    });

    return dispatch({
            type: RESET,
            waoType : waoType,
            ids : ids
        });
};

export const deleteLocally = (waoType,ids) => (dispatch,state) => {
    ids.forEach((id)=>{
        if(+id> 0 ) dispatch(addPending(waoType,id,{minimal:true}));
        else dispatch(removePending(waoType,id,null));
    });
    return dispatch({
        type: DELETE,
        waoType: waoType,
        ids: ids
    });
};

export const resetAll = (waoType,ids,groups) => (dispatch,getState) =>{
    const state = getState();
    const pendingTotalSelector = getPendingTotalSelector(state.get("app"));
    if(pendingTotalSelector()<1) return;

    let entities = entitiesSelector(state);
    let dataToPost = DataToPost();//.add(waoType,id,normData);
    state.getIn(["app","entitiesToPost"]).entrySeq().forEach((entry)=>{
        let waoType = entry[0];
        let items = entry[1];
        items.entrySeq().forEach((entry)=>{
            let id = entry[0];
            let groups = entry[1];
            console.log('remove pending',waoType,id,groups);
            dispatch(removePending(waoType,id,groups));
            let normData = state.getIn([waoType,"items",+id]);
            normData = denormalize(normData,WAOs.getIn([waoType,"schema"]),entities);
            normData = normData.toJS();
            normData = getDataToPost(waoType,normData,groups);
            dataToPost.add(waoType,id,normData);
        });
    });

    // effectively remove all pending data recursively
    /*console.log("data to reset");
    console.log(dataToPost);*/

    Object.keys(dataToPost.waos).forEach((waoType)=>{
        const normData = normalize(dataToPost.waos[waoType],[WAOs.getIn([waoType,"schema"])]);
        //console.log("resetAll renormalized data",normData);
        Object.keys(normData.entities).forEach((normWaoType)=>{
            dispatch({
                type: RESET,
                waoType : normWaoType,
                ids : Object.keys(normData.entities[normWaoType])
            });
        });
    });
};


export const get = (waoType,groups,searchBag=null) => ({
    type: GET,
    waoType : waoType,
    groups : groups,
    searchBag : searchBag || SearchBag()
});


const subReceiveGet = (waoType,rows) => {
    //console.log("subreceive get");
    //console.log(rows);
    const reducer = (accumulator, entity) => {
        accumulator =accumulator || true;
        let loadedGroups = entity.loadedGroups || true;
        //console.log(accumulator);
        //console.log(loadedGroups);
        return GroupUtil.intersect(waoType,accumulator,loadedGroups);
    };

    return {
        type: RECEIVE_GET,
        waoType : waoType,
        groups:rows.reduce(reducer),
        searchBag : null,
        receivedAt: Date.now(),
        total:-1,
        waos: rows,
        result:null
    }
};

export const receiveGet = (waoType,groups,searchBag,rows,
                           total,message="Données bien recues du serveur") => (dispatch,state) => {
    // let's normalize our received Data !
    const normData = normalize(rows,[WAOs.getIn([waoType,"schema"])]);
    /*console.log(rows);
    console.log("normalizedData");
    console.log(normData);*/
    Object.keys(normData.entities).forEach((key)=>{
        if(key !== waoType){
            dispatch(subReceiveGet(key,Object.values(normData.entities[key])));
        }
    });

    /*console.log("searchbag - result");
    console.log(searchBag);
    console.log(normData.result);*/

    //console.log(normData.entities[waoType]);

    return dispatch({
        type: RECEIVE_GET,
        waoType : waoType,
        groups:groups,
        searchBag : searchBag,
        receivedAt: Date.now(),
        total:total,
        waos: normData.entities[waoType]?Object.values(normData.entities[waoType]):[],
        result:normData.result
    });
};

export const errorGet = (waoType,searchBag,message) => {
    console.error(`error Get fetching ${waoType} : ${message}`);
};

const fetchGet = (waoType,groups=true,searchBag,senderKey) => (dispatch,state) => {
    const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));

    dispatch(notify(LOADING,senderKey || 'HBAPP',coreBagKey));

    const url = getUrl(URL_GET,getHBProps(waoType,groups,searchBag));

    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
            switch (json.status) {
                case HB_SUCCESS:
                    dispatch(receiveGet(waoType,groups,searchBag,json.rows,json.total,json.message));
                    dispatch(notify(LOADING_COMPLETED,senderKey,coreBagKey,HB_SUCCESS));
                    break;
                case HB_ERROR:
                    dispatch(errorGet(waoType,groups,searchBag,json.message));
                    dispatch(notify(LOADING_COMPLETED,senderKey,coreBagKey,HB_ERROR));
                    break;
                default:
            }
        }
        )
};

const shouldFetchGet = (state, waoType,groups,searchBag,senderKey=null) => {
    const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));
    if (state.hasIn(["app","notifications",senderKey,coreBagKey,LOADING])) return false;

    const searchCacheEntry = state.getIn([waoType,"searchCache",
        JSON.stringify(SearchBagUtil.getCoreBag(searchBag))]);
    //console.log(`shouldFetchGet 0 `);
    if(!searchCacheEntry || searchCacheEntry.get('invalidatedAt') !== null) return true;
    //console.log(`shouldFetchGet 1 `);
    let indexMap = searchCacheEntry.get("indexMap");
    indexMap = (searchBag.order===SearchBagUtil.ASC)?indexMap:
        SearchBagUtil.invertIndexMap(indexMap,searchCacheEntry.get("total"));
    /*console.log("indexMap");
    console.log(indexMap);
    console.log(searchBag);*/

    for(let i=searchBag.offset;i<searchBag.offset+searchBag.limit;i++){
        if(typeof indexMap.get(i) === 'undefined') return true;
    }
    //console.log(`shouldFetchGet 3 `);
    return false;
};

export const getIfNeeded = (waoType,groups=true,searchBag,senderKey=null) => (dispatch, getState) => {
    searchBag = searchBag || SearchBag();
    //console.log(`shouldFetchGet : ${shouldFetchGet(getState(), waoType,groups,searchBag,senderKey)}`);

    if (shouldFetchGet(getState(), waoType,groups,searchBag,senderKey)) {
        return dispatch(fetchGet(waoType,groups,searchBag,senderKey))
    }
};

export const receiveGetOneById = (waoType,groups,id,data,message="Données bien recues du serveur") =>
    (dispatch,state) => {
    // let's normalize our received Data !
    /*console.log(`denormalizedData ${waoType} with id ${id}`);
    console.log(data);*/
    const normData = normalize(data,WAOs.getIn([waoType,"schema"]));
        console.log('normalize receive data',waoType,WAOs.getIn([waoType,"schema"]), data,normData);
    /*console.log("normalizedData");
    console.log(normData);*/
    Object.keys(normData.entities).forEach((key)=>{
        if(key !== waoType){
            dispatch(subReceiveGet(key,Object.values(normData.entities[key])));
        }
    });

    return dispatch({
        type: RECEIVE_GET_ONE_BY_ID,
        waoType : waoType,
        groups:groups,
        id : id,
        receivedAt: Date.now(),
        wao: Object.values(normData.entities[waoType])[0],
    });
};

const APICallKey = (callType,waoType,groups=true,id=null,searchBag=null) =>{
    switch (callType){
        case 'getOneById' :
            return `${waoType}_${id}_${JSON.stringify(groups)}`;
            break;
        default :
            return 'NA';
            break;
    }
};

const fetchGetOneById = (waoType,groups=true,id,senderKey) => (dispatch,state) => {
    pendingAPICalls.set(APICallKey('getOneById',waoType,groups,id),new Date());
    dispatch(notify(LOADING,senderKey,id));
    const url = getUrl(URL_GET_ONE_BY_ID,getHBProps(waoType,groups,id));

    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
            pendingAPICalls.delete(APICallKey('getOneById',waoType,groups,id));
                switch (json.status) {
                    case HB_SUCCESS:
                        console.info(json);
                        dispatch(notify(LOADING_COMPLETED,senderKey,id,HB_SUCCESS));
                        dispatch(receiveGetOneById(waoType,groups,id,json.data,json.message));
                        break;
                    case HB_ERROR:
                        dispatch(notify(LOADING_COMPLETED,senderKey,id,HB_ERROR));
                        dispatch(errorGet(waoType,groups,id,json.message));
                        break;
                    default:
                }
            }
        )
};


const shouldFetchGetOneById = (state, waoType,groups,id,senderKey=null) => {
    if(pendingAPICalls.has(APICallKey('getOneById',waoType,groups,id))) return false;
    if(state.hasIn(["app","notifications",senderKey || 'HBAPP',id || 'DEFAULT',LOADING])) return false;

    const item = state.getIn([waoType,"items",id]);
    if(!item || !item.get("loadedGroups")) return true;

    if(item.get("loadedGroups")){
        /*console.log("groupes deja charges");
        console.log(item.get("loadedGroups"));
        console.log("groupes a charger");
        console.log(groups);
        console.log("diff");*/
        let diff = GroupUtil.leftDiff(waoType,groups,item.get("loadedGroups"));
        //console.log(diff);
        if(Object.keys(diff).length < 1) return false;
    }
    return true;
};

export const getOneByIdIfNeeded = (waoType,groups=true,id,senderKey=null) => (dispatch, getState) => {
    if (id===null) return;
    // new case
    if(+id<0){
        // only one new item can be created at a time, so be carefull different components don't ask it at the same time !!!!
        if(shouldFetchNew(getState(),waoType)){
            console.log(`should fetch new ${waoType}`);
            dispatch(fetchNew(waoType,id,senderKey));
            pendingCreations[waoType] = pendingCreations[waoType] || new Map();
            pendingCreations[waoType].set(id,{groups:groups,senderKey:senderKey});
            console.log(`should fetch new ${waoType}`,pendingCreations);
        }
        else {
            setTimeout(()=>{
                if (!getState().hasIn([waoType,"items",+id]) && +id>=+getState().getIn([waoType,"nextNewId"])){
                    dispatch(createNew(waoType));
                    /*if(pendingCreations.has(`${waoType}-${id}`)){
                        const {data,groups} = pendingCreations.get(`${waoType}-${id}`);
                        setTimeout(()=>{
                            dispatch(submitLocally(waoType,data,id,groups));
                        },10);
                        pendingCreations.delete(`${waoType}-${id}`);
                    }*/
                }
            },5);
        }
    }
    // standard case
    else if (shouldFetchGetOneById(getState(), waoType,groups,id,senderKey)) {
        return dispatch(fetchGetOneById(waoType,groups,id,senderKey))
    }
};

const shouldFetchNew = (state,waoType) => {
    if (state.hasIn(["app","notifications",waoType,'DEFAULT'])) return false;
    return ! state.getIn([waoType,"newItem"]);
};

export const fetchNew = (waoType,id,senderKey) => (dispatch) => {
    const url = getUrl(URL_GET_NEW,getHBProps(waoType,null,0));
    dispatch(notify(LOADING,waoType,null));
    dispatch(notify(LOADING,senderKey,id));
    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
                switch (json.status) {
                    case HB_SUCCESS:

                        const normData = normalize(json.data,WAOs.getIn([waoType,"schema"]));
                        console.log('normalize receiveNew data',waoType,WAOs.getIn([waoType,"schema"]), json.data,normData);
                        Object.keys(normData.entities).forEach((key)=>{
                            if(key !== waoType){
                                dispatch(subReceiveGet(key,Object.values(normData.entities[key])));
                            }
                        });
                        dispatch(receiveNew(waoType,normData.entities[waoType][0]));
                        setTimeout(()=>{
                            console.log('pendingCreations=',pendingCreations);
                            if(!!pendingCreations[waoType]){
                                pendingCreations[waoType].forEach(({senderKey},id)=>{
                                    dispatch(createNew(waoType));
                                    dispatch(notify(LOADING_COMPLETED,senderKey,id,HB_SUCCESS));
                                });
                            }


                            dispatch(notify(LOADING_COMPLETED,waoType,null,HB_SUCCESS));
                        },20);
                        /*setTimeout(()=>{
                            if(pendingCreations.has(`${waoType}-${id}`)){
                                const {data,groups} = pendingCreations.get(`${waoType}-${id}`);
                                setTimeout(()=>{
                                    dispatch(submitLocally(waoType,data,id,groups));
                                },20);
                                pendingCreations.delete(`${waoType}-${id}`);
                            }
                        },30);*/

                        break;
                    case HB_ERROR:
                        setTimeout(()=>{
                            dispatch(notify(LOADING_COMPLETED,senderKey,id,HB_ERROR));
                            dispatch(notify(LOADING_COMPLETED,waoType,null,HB_ERROR));
                        },10);
                        dispatch(errorGet(waoType,null,0,json.message));
                        break;
                    default:
                }
            }
        )
};

const receiveNew = (waoType,data) => ({
    type:RECEIVE_NEW,
    waoType : waoType,
    receivedAt: Date.now(),
    wao: data
});

const createNew = (waoType) => ({
    type:CREATE_NEW,
    waoType : waoType,
    receivedAt: Date.now()
});



let hasLoadedInitialHResponse = false;
export const loadInitialHResponse = (senderKey=null) => (dispatch, getState) => {
    if(hasLoadedInitialHResponse) return;
    hasLoadedInitialHResponse = true;
    if(INITIAL_HRESPONSE === null) return;
    const json = INITIAL_HRESPONSE;
    console.log(`initialHResponse`);
    console.log(json);

    switch (json.status) {
        case HB_SUCCESS:
            console.log(`notify initialHResponse`);
            return dispatch(notify(INITIAL,senderKey,0,HB_SUCCESS,json.data,json.message));
            break;
        case HB_INFO:
            console.log(`notify initialHResponse`);
            return dispatch(notify(INITIAL,senderKey,0,HB_INFO,json.data,json.message));
            break;
        case HB_ERROR:
            console.error(json.message);
            console.log(json.errors);
            return dispatch(notify(INITIAL,senderKey,0,HB_ERROR,json.data,json.message,json.errors));
            break;
        case HB_WARNING:
            console.warn(json.message);
            return dispatch(notify(INITIAL,senderKey,0,HB_WARNING,json.data,json.message,json.errors));
            break;
        case HB_CONFIRM:
            setTimeout(()=>{dispatch(discard(INITIAL,senderKey,0))},1000);
            console.log(json.data);
            if(json.data.currentUser) dispatch(receiveGetOneById(
                "user",
                json.data.currentUser.loadedGroups,
                +json.data.currentUser.id,
                json.data.currentUser
            ));
            return dispatch(notify(INITIAL,senderKey,0,HB_CONFIRM,json.data,json.message,json.errors));
            break;
        default:
    }
};


export const logout = (senderKey) => (dispatch, getState) => {
    console.log("logout");

    let dataToPost = DataToPost(senderKey);
    console.log(`dataToPost`);
    console.log(dataToPost);

    const url = getUrl(URL_LOGOUT);
    let httpProps = getHTTPProps(HTTP_POST);
    httpProps.body = JSON.stringify(dataToPost);

    return fetch(url,httpProps)
        .then(response => response.json())
        .catch(exception => {
                dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_ERROR,null,"Le serveur est tombé en erreur :(",null));
            }
        )
        .then(json => {
                console.log("post returned !");
                console.log(json);
                switch (json.status) {
                    case HB_SUCCESS:
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_SUCCESS,{redirectTo:URL_LOGIN},json.message));
                        break;
                    case HB_ERROR:
                        console.error(json.message);
                        console.log(json.errors);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_ERROR,json.data,json.message,json.errors));
                        break;
                    case HB_WARNING:
                        console.warn(json.message);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_WARNING,json.data,json.message,json.errors));
                        break;
                    default:
                }
            }
        )
};



export const sendContact = (data,senderKey) => (dispatch, getState) => {
    console.log("send contact");
    console.log(data);

    let dataToPost = DataToPost(senderKey);
    dataToPost = Object.assign(dataToPost,data);
    console.log(`dataToPost`);
    console.log(dataToPost);

    const url = getUrl(URL_CONTACT);
    let httpProps = getHTTPProps(HTTP_POST);
    httpProps.body = JSON.stringify(dataToPost);

    dispatch(notify(SUBMITTING,senderKey,0));

    return fetch(url,httpProps)
        .then(response => response.json())
        .catch(exception => {
                dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_ERROR,null,"Le serveur est tombé en erreur :(",null));
            }
        )
        .then(json => {
                console.log("post returned !");
                console.log(json);
                switch (json.status) {
                    case HB_SUCCESS:
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_SUCCESS,json.data,json.message));
                        break;
                    case HB_ERROR:
                        console.error(json.message);
                        console.log(json.errors);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_ERROR,json.data,json.message,json.errors));
                        break;
                    case HB_WARNING:
                        console.warn(json.message);
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey,0,HB_WARNING,json.data,json.message,json.errors));
                        break;
                    default:
                }
            }
        )
};




