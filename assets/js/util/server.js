const SECURITY_TOKEN = document.getElementById('hb-security-token').getAttribute('data-token');
document.getElementById('hb-security-token').remove(); // to prevent visualisation of token

const getDataUrlOrNa = (domId) =>{
    const element = document.getElementById(domId);
    if(typeof element === 'undefined' || element === null) return '_NA_';
    const url = element.getAttribute('data-url');
    element.remove();
    return url;
};

const getInnerHtmlOrNa = (domId) =>{
    const element = document.getElementById(domId);
    if(typeof element === 'undefined' || element === null) return '_NA_';
    const html = element.innerHTML;
    element.remove();
    return html;
};


let initialHResponse = getDataUrlOrNa('hb-initial-response');
console.log(initialHResponse);
if(initialHResponse && initialHResponse !== '_NA_') initialHResponse = JSON.parse(initialHResponse);
else initialHResponse = null;
let currentUserId = null;
if(initialHResponse!==null && initialHResponse.data &&
    initialHResponse.data.currentUser && initialHResponse.data.currentUser.id) {
    currentUserId = +initialHResponse.data.currentUser.id;
}

export const URL_DEFAULT_IMAGE_MINI = getDataUrlOrNa('hb-url-default-image-mini');
export const URL_DEFAULT_IMAGE_DETAIL = getDataUrlOrNa('hb-url-default-image-detail');

/*console.log(URL_DEFAULT_IMAGE_MINI);
console.log(URL_DEFAULT_IMAGE_DETAIL);*/

export const INITIAL_HRESPONSE = initialHResponse;
export const CURRENT_USER_ID = currentUserId;

export const URL_REGISTER = getDataUrlOrNa('hb-url-security-register');
export const URL_LOGIN = getDataUrlOrNa('hb-url-security-login');
export const URL_LOGOUT = getDataUrlOrNa('hb-url-security-logout');

export const URL_CONTACT = getDataUrlOrNa('hb-url-contact-contact');

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

export const CONTACT_TYPES = [
    {id:'BUG',label:"Signaler un bug"},
    {id:'PROBLEM',label:"Signaler un abus"},
    {id:'HOWTO',label:"Comment faire"},
    {id:'IDEA',label:"Proposer une evolution ou une nouvelle fonctionnalité"},
    {id:'ABOUT',label:"Poser des questions sur le projet"},
    {id:'THANKS',label:"Remercier l'équipe car ça fait toujours plaisir :)"}
    ];

let ROOT_URL = '/app';
export const setRootUrl = (root)=>{
    ROOT_URL = root;
};
export const getRootUrl = ()=>ROOT_URL;

export const HELP_DIVS = {
   consult: getInnerHtmlOrNa('hb-html-help-consult'),
    edit: getInnerHtmlOrNa('hb-html-help-edit'),
    mainArticlePage: getInnerHtmlOrNa('hb-html-help-main-article-page')
};


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

