const SECURITY_TOKEN = document.getElementById('hb-security-token').getAttribute('data-token');
document.getElementById('hb-security-token').remove(); // to prevent visualisation of token

export const URL_GET = document.getElementById('hb-url-crud-get').getAttribute('data-url');
export const URL_GET_ONE_BY_ID = document.getElementById('hb-url-crud-get-one-by-id').getAttribute('data-url');
export const URL_GET_NEW = document.getElementById('hb-url-crud-get-new').getAttribute('data-url');
export const URL_POST = document.getElementById('hb-url-crud-post').getAttribute('data-url');
export const URL_UPLOAD = document.getElementById('hb-url-resource-upload').getAttribute('data-url');

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
export const DataToPost = function(){
    return Object.setPrototypeOf({
        _token:SECURITY_TOKEN,
        senderKey:null,
        waos:{}
    },DataToPostPrototype);
};

