const SECURITY_TOKEN = document.getElementById('hb-security-token').getAttribute('data-token');
document.getElementById('hb-security-token').remove(); // to prevent visualisation of token

const getDataUrlOrNa = (domId) =>{
    const element = document.getElementById(domId);
    if(typeof element === 'undefined' || element === null) return '_NA_';
    const url = element.getAttribute('data-url');
    element.remove();
    return url;
};

let initialHResponse = getDataUrlOrNa('hb-initial-response');
console.log(initialHResponse);
if(initialHResponse && initialHResponse !== '_NA_') initialHResponse = JSON.parse(initialHResponse);
else initialHResponse = null;

export const URL_DEFAULT_IMAGE_MINI = getDataUrlOrNa('hb-url-default-image-mini');
export const URL_DEFAULT_IMAGE_DETAIL = getDataUrlOrNa('hb-url-default-image-detail');

console.log(URL_DEFAULT_IMAGE_MINI);
console.log(URL_DEFAULT_IMAGE_DETAIL);

export const INITIAL_HRESPONSE = initialHResponse;

export const URL_REGISTER = getDataUrlOrNa('hb-url-security-register');
export const URL_LOGIN = getDataUrlOrNa('hb-url-security-login');
export const URL_LOGOUT = getDataUrlOrNa('hb-url-security-logout');

export const URL_GET = getDataUrlOrNa('hb-url-get-get');
export const URL_GET_ONE_BY_ID = getDataUrlOrNa('hb-url-get-get-one-by-id');
export const URL_GET_NEW = getDataUrlOrNa('hb-url-get-get-new');

export const URL_POST = getDataUrlOrNa('hb-url-post-post');
export const URL_UPLOAD = getDataUrlOrNa('hb-url-post-upload-resource');

export const HTTP_GET='GET';
export const HTTP_POST='POST';

export const HB_SUCCESS="success";
export const HB_INFO="info";
export const HB_WARNING="warning";
export const HB_ERROR="error";
export const HB_CONFIRM="confirm";

export const RESOURCE_IMAGE={id:1,label:"Image"};
export const RESOURCE_TEXT={id:2,label:"Texte"};

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
export const getHTTPProps = function(method=HTTP_GET){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Connection', 'Keep-Alive');

    return {
        method: method,
        headers: headers,
        credentials:'same-origin',
        mode: 'same-origin',
        cache: 'default'
    };
};
/**
 * @returns {object}
 */
export const getHTTPUploadProps = function(contentType){
    let headers = new Headers();
    headers.append('Content-Type', contentType);

    return {
        method: HTTP_POST,
        headers: headers,
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
    //console.log(`idOrSearchbag : ${idOrSearchBag}`);

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
export const DataToPost = function(senderKey=null){
    return Object.setPrototypeOf({
        _token:SECURITY_TOKEN,
        senderKey:senderKey,
        waos:{}
    },DataToPostPrototype);
};

