
export const URL_GET = document.getElementById('hb-url-crud-get').getAttribute('data-url');
export const URL_GET_ONE_BY_ID = document.getElementById('hb-url-crud-get-one-by-id').getAttribute('data-url');
export const URL_GET_NEW = document.getElementById('hb-url-crud-get-new').getAttribute('data-url');
export const URL_POST = document.getElementById('hb-url-crud-post').getAttribute('data-url');

export const SECURITY_TOKEN = document.getElementById('hb-security-token').getAttribute('data-token');

export const HB_SUCCESS="success";
export const HB_INFO="info";
export const HB_WARNING="warning";
export const HB_ERROR="error";
export const HB_CONFIRM="confirm";

/**
 * @param url string
 * @param params object
 * @returns {string}
 */
export const getUrl = function(url,params=null){
    if (!params || params==null) return encodeURI(url);
    else{
        let query = Object.keys(params)
            .map(k => `${k}=${params[k]}`)
            .join('&');
        return encodeURI(`${url}?${query}`);
    }
};
/**
 * @returns {object}
 */
export const getHTTPProps = function(){
    return {
        method: 'GET',
        headers: (new Headers()).append('Content-Type', 'application/json'),
        credentials:'same-origin',
        mode: 'same-origin',
        cache: 'default'
    };
};
/**
 * @returns {object}
 */
export const getHBProps = function(waoType,groups,idOrSearchBag){
    let props = {
        type: waoType,
        groups: JSON.stringify(groups)
    };

    if(typeof idOrSearchBag === 'object' || typeof idOrSearchBag === 'boolean') {
        props.searchBag = JSON.stringify(idOrSearchBag);
    }
    else if (typeof idOrSearchBag === 'number') {
        props.id = idOrSearchBag
    }
    else{
        throw `Unsupported research criteria ${typeof idOrSearchBag} for idOrSearchBag`;
    }
    return props;
};

/**
 * @param status
 * @param message
 * @param data
 * @param errors
 * @returns object
 */
export const HResponse = function(status=HB_SUCCESS,message="OK",data=null,errors=null){
    return {
        status : status,
        message : message,
        data : data,
        errors : errors
    }
};

const DataToPostPrototype = {
    add : function(waoType,id,data){
        const {waos} = this;
        if (! waos[waoType]) waos[waoType] = {};
        waos[waoType][id] = data;
        return this;
    }
};

/**
 * standard data for posting to server
 * @constructor
 */
export const DataToPost = function(){
    return Object.setPrototypeOf({
        waos:{}
    },DataToPostPrototype);
};

