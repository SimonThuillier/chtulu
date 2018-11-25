import SearchBag from '../util/SearchBag';
import {
    HTTP_POST,
    URL_GET,
    URL_GET_ONE_BY_ID,
    getUrl,
    getHTTPProps,
    getHBProps,
    DataToPost,
    HB_SUCCESS,
    HB_ERROR,
    URL_POST,
    SECURITY_TOKEN
} from '../util/server';
import { normalize,denormalize, schema } from 'normalizr';
import WAOs from '../util/WAOs';
import {getDataToPost} from '../util/WAOUtil';
import GroupUtil from "../util/GroupUtil";
import SearchBagUtil from '../util/SearchBagUtil';
import {entitiesSelector} from '../selectors';
import {LOADING,LOADING_COMPLETED,SUBMITTING,SUBMITTING_COMPLETED} from '../util/notifications';

// notifications actions
export const NOTIFY = 'NOTIFY';
export const DISCARD = 'DISCARD';
// data reception actions
export const GET = 'GET';
export const RECEIVE_GET = 'RECEIVE_GET';
export const GET_ONE_BY_ID = 'GET_ONE_BY_ID';
export const RECEIVE_GET_ONE_BY_ID = 'RECEIVE_GET_ONE_BY_ID';
// form actions
export const SUBMIT_LOCALLY = 'SUBMIT_LOCALLY';
export const RESET = 'RESET';
// submission to server actions
export const POST_ONE = 'POST_ONE';
export const POST_ALL = 'POST_ALL';

export const TIMEOUT = 5000;


export const notify = (notifType,senderKey=null,senderParam=null,status=HB_SUCCESS) => ({
    type: NOTIFY,
    notifType : notifType,
    senderKey : senderKey || 'HBAPP',
    senderParam: senderParam,
    status:status
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


export const postOne = (waoType,groups=true,id,senderKey) => (dispatch,getState) => {
    const state = getState();
    let entities = entitiesSelector(state);
    //entities = {articleType:{'2':{id:2,label:"lol"}},resource:{}};
    /*console.log("entities");
    console.log(entities);
    console.log("schema");
    console.log(WAOs.getIn([waoType,"schema"]));*/
    let normData = state.getIn([waoType,"items",+id]);
    /*console.log(`denormData to send ${id}`);
    console.log(normData);
    console.log(`normData to send ${id}`);*/
    //normData.type=2;
    normData = denormalize(normData,WAOs.getIn([waoType,"schema"]),entities);
    normData = normData.toJS();
    /*console.log(normData);
    console.log("groups to send");
    console.log(groups);*/
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

    dispatch(notify(SUBMITTING,senderKey || 'HBAPP',id));

    return fetch(url,httpProps)
        .then(response => response.json())
        .then(json => {
            console.log("post returned !");
            json.data = JSON.parse(json.data);
            console.log(json);
                switch (json.status) {
                    case HB_SUCCESS:
                        dispatch(notify(SUBMITTING_COMPLETED,senderKey || 'HBAPP',id,HB_SUCCESS));
                        handlePostBackData(json.data,dispatch);
                        //dispatch(receiveGet(waoType,groups,searchBag,json.rows,json.total,json.message));
                        break;
                    case HB_ERROR:
                        //dispatch(errorGet(waoType,groups,searchBag,json.message));
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
            console.log("redispatched object after post");
            console.log(object);
            dispatch(receiveGetOneById(waoType,groups,id,object,"Données bien enregistrées sur le serveur"));


        });

    });


};

export const submitLocally = (waoType,data,id) => ({
    type: SUBMIT_LOCALLY,
    waoType : waoType,
    data : data,
    id : id
});

export const reset = (waoType,ids) => ({
    type: RESET,
    waoType : waoType,
    ids : ids
});


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
    console.log(rows);
    console.log("normalizedData");
    console.log(normData);
    Object.keys(normData.entities).forEach((key)=>{
        if(key !== waoType){
            dispatch(subReceiveGet(key,Object.values(normData.entities[key])));
        }
    });

    console.log("searchbag - result");
    console.log(searchBag);
    console.log(normData.result);

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
    console.log(`error Get fetching ${waoType} : ${message}`);
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
                    dispatch(notify(LOADING_COMPLETED,senderKey,coreBagKey,HB_SUCCESS));
                    dispatch(receiveGet(waoType,groups,searchBag,json.rows,json.total,json.message));
                    break;
                case HB_ERROR:
                    dispatch(errorGet(waoType,groups,searchBag,json.message));
                    break;
                default:
            }
        }
        )
};

const shouldFetchGet = (state, waoType,groups,searchBag,senderKey=null) => {
    const searchCacheEntry = state.getIn([waoType,"searchCache",
        JSON.stringify(SearchBagUtil.getCoreBag(searchBag))]);
    //console.log(`shouldFetchGet 0 `);
    if(!searchCacheEntry) return true;
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
    console.log(`shouldFetchGet : ${shouldFetchGet(getState(), waoType,groups,searchBag,senderKey)}`);

    if (shouldFetchGet(getState(), waoType,groups,searchBag,senderKey)) {
        return dispatch(fetchGet(waoType,groups,searchBag,senderKey))
    }
};

// GETONEBYID


// export const getOneById = (waoType,groups,id) => ({
//     type: GET_ONE_BY_ID,
//     waoType : waoType,
//     groups : groups,
//     id : id
// });

export const receiveGetOneById = (waoType,groups,id,data,message="Données bien recues du serveur") =>
    (dispatch,state) => {
    // let's normalize our received Data !
    console.log(`denormalizedData ${waoType} with id ${id}`);
    console.log(data);
    const normData = normalize(data,WAOs.getIn([waoType,"schema"]));
    console.log("normalizedData");
    console.log(normData);
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

const fetchGetOneById = (waoType,groups=true,id,senderKey) => (dispatch,state) => {
    dispatch(notify(LOADING,senderKey,id));
    const url = getUrl(URL_GET_ONE_BY_ID,getHBProps(waoType,groups,id));

    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
                switch (json.status) {
                    case HB_SUCCESS:
                        console.log(json);
                        dispatch(notify(LOADING_COMPLETED,senderKey,id,HB_SUCCESS));
                        dispatch(receiveGetOneById(waoType,groups,id,json.data,json.message));
                        break;
                    case HB_ERROR:
                        dispatch(errorGet(waoType,groups,id,json.message));
                        break;
                    default:
                }
            }
        )
};


const shouldFetchGetOneById = (state, waoType,groups,id,senderKey=null) => {
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
        console.log(diff);
        if(Object.keys(diff).length < 1) return false;
    }



    /*const posts = state.postsBySubreddit[subreddit]
    if (!posts) {
        return true
    }
    if (posts.isFetching) {
        return false
    }
    return posts.didInvalidate*/
    return true;
};

export const getOneByIdIfNeeded = (waoType,groups=true,id,senderKey=null) => (dispatch, getState) => {
    if (shouldFetchGetOneById(getState(), waoType,groups,id,senderKey)) {
        return dispatch(fetchGetOneById(waoType,groups,id,senderKey))
    }
};




