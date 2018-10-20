import SearchBag from '../util/SearchBag';
import {URL_GET,getUrl,getHTTPProps,getHBProps,HB_SUCCESS,HB_ERROR} from '../util/server';


export const GET = 'GET';
export const RECEIVE_GET = 'RECEIVE_GET';

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

export const receiveGet = (waoType,groups,searchBag,rows,total,message="Données bien recues du serveur") => {
    return {
        type: RECEIVE_GET,
        waoType : waoType,
        groups:groups,
        searchBag : searchBag,
        receivedAt: Date.now(),
        total:total,
        waos: rows,
    }
};

export const errorGet = (waoType,searchBag,message) => {
    console.log(`error Get fetching ${waoType} : ${message}`);
};

const fetchGet = (waoType,groups=true,searchBag) => (dispatch,state) => {
    dispatch(get(waoType,searchBag));
    const url = getUrl(URL_GET,getHBProps(waoType,groups,searchBag));
    console.log("type get url");


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


/*get : function(type,groups=true,searchBag=null,onDataLoading=null){
    return new Promise((resolve,reject) => {

        if(searchBag === null) searchBag = this.createSearchBag();
        let url = buildGetUrl(urls.crud_get,{
            type:type,
            searchBag:JSON.stringify(searchBag),
            groups:JSON.stringify(groups)
        });
        console.log(url);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let requestProps = { method: 'GET',
            headers: new Headers(),
            credentials:'same-origin',
            mode: 'same-origin',
            cache: 'default' };

        if(onDataLoading !== null) onDataLoading.call();

        return fetchWithTimeout(url,requestProps,TIMEOUT)
            .then(response => {console.log(response);
                return response.json();})
            .then(hResponse => {
                console.log(hResponse);
                console.log("posted");
                if(hResponse.status === 'success'){
                    hResponse.rows = hResponse.rows.map(item => handleResponseObject(type,item) );
                    watchCache(type);
                    console.log("cache after get");
                    console.log(cache);
                    resolve(hResponse);
                }
                else{
                    reject(new Error(hResponse.message));
                }
            })
            .catch((error) => reject(error))
            ;
    });
}*/





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

