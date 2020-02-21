import {
    DataToPost,
    getHTTPProps,
    getHTTPUploadProps,
    getUrl,
    HB_CONFIRM,
    HB_ERROR,
    HB_INFO,
    HB_SUCCESS,
    HB_WARNING,
    HTTP_POST,
    INITIAL_HRESPONSE,
    URL_CONTACT,
    URL_LOGIN,
    URL_LOGOUT,
    URL_POST,
    URL_UPLOAD
} from '../util/server';
import {denormalize, normalize} from 'normalizr';
import WAOs from '../util/WAOs';
import {getDataToPost} from '../util/WAOUtil';
import {entitiesSelector, getPendingTotalSelector} from '../shared/selectors';
import {INITIAL, SUBMITTING, SUBMITTING_COMPLETED} from '../util/notifications';
import {startSubmit, stopSubmit} from 'redux-form';
import {DISCARD, NOTIFY, receiveGetOneById} from "../shared/actions";


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

    const event = new CustomEvent('hb.has_posted.all');
    event.newItems = [];
    window.dispatchEvent(event);

    let entities = entitiesSelector(state);
    let dataToPost = DataToPost();//.add(waoType,id,normData);
    state.getIn(["app","entitiesToPost"]).entrySeq().forEach((entry)=>{
        let waoType = entry[0];
        let items = entry[1];
        items.entrySeq().forEach((entry)=>{
            let id = entry[0];
            let groups = entry[1];
            let normData = state.getIn([waoType,"items",+id]);
            if(!event.newItems.includes(waoType)) event.newItems.push(waoType);
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
                        window.dispatchEvent(event);
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




