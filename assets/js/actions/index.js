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


export const GET = 'GET';
export const RECEIVE_GET = 'RECEIVE_GET';
export const GET_ONE_BY_ID = 'GET_ONE_BY_ID';
export const RECEIVE_GET_ONE_BY_ID = 'RECEIVE_GET_ONE_BY_ID';

const TIMEOUT = 1000000;
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



export const get = (waoType,groups,searchBag=null) => ({
    type: GET,
    waoType : waoType,
    groups : groups,
    searchBag : searchBag || SearchBag()
});


const subReceiveGet = (waoType,rows) => {
    const reducer = (accumulator, entity) => {
        accumulator =accumulator || true;
        let loadedGroups = entity.loadedGroups || true;
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
    // let's denormalize our received Data !
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

export const receiveGetOneById = (waoType,groups,id,data,message="Données bien recues du serveur") => {
    return {
        type: RECEIVE_GET_ONE_BY_ID,
        waoType : waoType,
        groups:groups,
        id : id,
        receivedAt: Date.now(),
        wao: data,
    }
};

const fetchGetOneById = (waoType,groups=true,id) => (dispatch,state) => {
    dispatch(getOneById(waoType,id));
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

