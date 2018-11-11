import SearchBag from '../util/SearchBag';
import {
    URL_GET,
    URL_GET_ONE_BY_ID,
    getUrl,
    getHTTPProps,
    getHBProps,
    HB_SUCCESS,
    HB_ERROR
} from '../util/server';
import { normalize, schema } from 'normalizr';
import WAOs from '../util/WAOs';
import GroupUtil from "../util/GroupUtil";

export const LOAD_FOR_EDIT = 'LOAD_FOR_EDIT';
export const GET = 'GET';
export const RECEIVE_GET = 'RECEIVE_GET';
export const GET_ONE_BY_ID = 'GET_ONE_BY_ID';
export const RECEIVE_GET_ONE_BY_ID = 'RECEIVE_GET_ONE_BY_ID';

export const SUBMIT_LOCALLY = 'SUBMIT_LOCALLY';

export const TIMEOUT = 5000;
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

export const loadForEdit = (formUid,waoType,id) => (dispatch,state) => {
    console.log(`loadForEdit`);
    console.log(state);
};

export const submitLocally = (waoType,data,id) => ({
    type: SUBMIT_LOCALLY,
    waoType : waoType,
    data : data,
    id : id
});


export const get = (waoType,groups,searchBag=null) => ({
    type: GET,
    waoType : waoType,
    groups : groups,
    searchBag : searchBag || SearchBag()
});


const subReceiveGet = (waoType,rows) => {
    console.log("subreceive get");
    console.log(rows);
    const reducer = (accumulator, entity) => {
        accumulator =accumulator || true;
        let loadedGroups = entity.loadedGroups || true;
        console.log(accumulator);
        console.log(loadedGroups);
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
    }
};

export const receiveGet = (waoType,groups,searchBag,rows,
                           total,message="Données bien recues du serveur") => (dispatch,state) => {
    // let's normalize our received Data !
    const normData = normalize(rows,[WAOs.getIn([waoType,"schema"])]);
    console.log("normalizedData");
    console.log(normData);
    Object.keys(normData.entities).forEach((key)=>{
        if(key !== waoType){
            dispatch(subReceiveGet(key,Object.values(normData.entities[key])));
        }
    });

    return dispatch({
        type: RECEIVE_GET,
        waoType : waoType,
        groups:groups,
        searchBag : searchBag,
        receivedAt: Date.now(),
        total:total,
        waos: Object.values(normData.entities[waoType]),
    });
};

export const errorGet = (waoType,searchBag,message) => {
    console.log(`error Get fetching ${waoType} : ${message}`);
};

const fetchGet = (waoType,groups=true,searchBag) => (dispatch,state) => {
    dispatch(get(waoType,searchBag));
    const url = getUrl(URL_GET,getHBProps(waoType,groups,searchBag));

    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
            switch (json.status) {
                case HB_SUCCESS:
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

const shouldFetchGet = (state, waoType,groups,searchBag) => {
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

export const getIfNeeded = (waoType,groups=true,searchBag) => (dispatch, getState) => {
    searchBag = searchBag || SearchBag();
    if (shouldFetchGet(getState(), waoType,groups,searchBag)) {
        return dispatch(fetchGet(waoType,groups,searchBag))
    }
};

// GETONEBYID


export const getOneById = (waoType,groups,id) => ({
    type: GET_ONE_BY_ID,
    waoType : waoType,
    groups : groups,
    id : id
});

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

const fetchGetOneById = (waoType,groups=true,id) => (dispatch,state) => {
    dispatch(getOneById(waoType,groups,id));
    const url = getUrl(URL_GET_ONE_BY_ID,getHBProps(waoType,groups,id));

    return fetch(url,getHTTPProps())
        .then(response => response.json())
        .then(json => {
                switch (json.status) {
                    case HB_SUCCESS:
                        console.log(json);
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


const shouldFetchGetOneById = (state, waoType,groups,id) => {
    console.log(state);
    const item = state.getIn([waoType,"items",id]);
    if(!item || !item.get("loadedGroups")) return true;

    if(item.get("loadedGroups")){
        console.log("groupes deja charges");
        console.log(item.get("loadedGroups"));
        console.log("groupes a charger");
        console.log(groups);
        console.log("diff");
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

export const getOneByIdIfNeeded = (waoType,groups=true,id) => (dispatch, getState) => {
    if (shouldFetchGetOneById(getState(), waoType,groups,id)) {
        return dispatch(fetchGetOneById(waoType,groups,id))
    }
};

