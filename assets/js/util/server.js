
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
export const getHBProps = function(waoType,searchBag,groups){
    return {
        type:waoType,
        searchBag:JSON.stringify(searchBag),
        groups:JSON.stringify(groups)
    };
};

