/**
 * @package hbase.js
 * @doc server.js : Handle data exchange between front-end app and the server
 * */

let urls = {
    crud_get : document.getElementById('hb-url-crud-get').getAttribute('data-url'),
    crud_get_one_by_id : document.getElementById('hb-url-crud-get-one-by-id').getAttribute('data-url'),
    crud_get_new : document.getElementById('hb-url-crud-get-new').getAttribute('data-url'),
    crud_post : document.getElementById('hb-url-crud-post').getAttribute('data-url')
};
let _token = document.getElementById('hb-security-token').getAttribute('data-token');

const TIMEOUT = 1000000;

/**
 * @param url string
 * @param params object
 * @returns {string}
 */
const buildGetUrl = function(url,params=null){
    if (!params || params==null) return encodeURI(url);
    else{
        let query = Object.keys(params)
            .map(k => k + '=' + params[k])
            .join('&');
        return encodeURI(url + '?' + query);
    }
};
/**
 * @param url string
 * @param props object
 * @param timeout integer
 * @returns {Promise<any>}
 */
const fetchWithTimeout = function( url,props, timeout ) {
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

/**
 * @class DTO
 */
const dtoPrototype = {
    dtoType: "rootDto",
    cacheLength:100,
    mapping: {},
    dependencies:{},
    pendingModification:false,
    finalize : function(groups=true){console.log("vanillaFinalize")},
    getPartial : function(groups = true){
        console.log(this);
        console.log(groups);
        if(typeof groups !== 'object' || !this.mapping) return this;
        let keys = {};
        for (let group in groups){
            if(typeof this.mapping[group] === 'undefined')
                throw new Error("Group " + group + " undefined for " + this.dtoType + " dto");
            this.mapping[group].forEach(function(item){
                keys[item] = groups[group];
            });
        }

        let copy = {};
        Object.keys(keys).forEach((item) => {
            if(typeof keys[item] === 'object' && typeof this[item].getPartial !== 'undefined'){
                copy[item] = this[item].getPartial(keys[item]);
            }
            else{
                //console.log(this[item]);
                copy[item] = this[item];
            }
        });
        return copy;
    }
};

const defaultPrototypes = {
    /**
     * @class Article
     */
    article:{
        dtoType : "article",
        cacheLength:100,
        dependencies:{detailImageResource:"resourceImage"},
        /**
         * @doc : function aimed to finalize constitution of new HArticle created by parsing JSon
         */
        finalize : function(groups=true){
            let jsonStr = null;
            if(this.beginHDate !== null){
                if(typeof this.beginHDate === "object"){jsonStr = JSON.stringify(this.beginHDate);}
                else{jsonStr = this.beginHDate;}
                this.beginHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            if(this.hasEndDate && this.endHDate !== null && this.endHDate !== ''){
                if(typeof this.endHDate === "object"){jsonStr = JSON.stringify(this.endHDate);}
                else{jsonStr = this.endHDate;}
                this.endHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            else{this.endHDate = null;}
            if(this.hteRange !== null){
                if(typeof this.hteRange === "object"){jsonStr = JSON.stringify(this.hteRange);}
                else{jsonStr = this.hteRange;}
                this.hteRange = hb.util.HDate.prototype.parseFromJson(jsonStr);
            }
            if(this.detailImageResource === "") this.detailImageResource = null;
            if(this.detailImageResource !== null){
                if(typeof this.detailImageResource === "string"){
                    this.detailImageResource = JSON.parse(this.detailImageResource);
                }
            }
        }
    },
    /**
     * @class ResourceGeometry
     */
    resourceGeometry : {
        dtoType : "resourceGeometry",
        cacheLength:50,
        getPointCoords(){
            if(typeof this.targetGeometry ==='undefined' ||
                typeof this.targetGeometry.value ==='undefined' ||
                typeof this.targetGeometry.value.type ==='undefined' ||
                this.targetGeometry.value.type !=='Point') return [0,0];
            return this.targetGeometry.value.coordinates;
        },
        getPointLat(){
            return this.getPointCoords()[0];
        },
        getPointLng(){
            return this.getPointCoords()[1];
        }
    }
};

let prototypes = {};
let cache = {};
const mappingDivs = document.getElementsByClassName('hb-dto-mapping');

for (let i = 0; i < mappingDivs.length; ++i) {
    let item = mappingDivs[i];
    let concreteDtoPrototype = Object.create(dtoPrototype);
    concreteDtoPrototype.mapping = JSON.parse(item.getAttribute('data-mapping'));
    prototypes[item.getAttribute('id').replace('hb-mapping-','')] = concreteDtoPrototype;
    cache[item.getAttribute('id').replace('hb-mapping-','')] = [];
}
Object.keys(prototypes).forEach(function(key,index) {
    if(defaultPrototypes.hasOwnProperty(key)) Object.assign(prototypes[key],defaultPrototypes[key]);
    Object.freeze(prototypes[key]);
});
/**
 * remove objects from the cache if queue exceed its limit
 */
const watchCache = function(type){
    while(cache[type].length > prototypes[type].cacheLength){
        cache[type].shift();
    }
};
/**
 * @param targetGroups object|boolean
 * @param sourceGroups object|boolean
 * @return object|boolean
 */
const mergeGroups = function(targetGroups,sourceGroups){
    if(typeof targetGroups !== 'object' || typeof sourceGroups !== 'object') return true;
    Object.keys(sourceGroups).forEach(function(key){
        if(typeof sourceGroups[key] === 'object'){
            if(typeof targetGroups[key] === 'object'){
                targetGroups[key] = mergeGroups(targetGroups[key],sourceGroups[key]);
            }
            else if(typeof targetGroups[key] === 'undefined'){
                targetGroups[key] = sourceGroups[key];
            }
        }
        else{
            targetGroups[key] = true;
        }
    });
    return targetGroups[key];
};
/**
 * // TODO : handle nesting
 * @param type string
 * @param baseGroups object|boolean
 * @param compareGroups object|boolean
 * @return object|null
 */
const diffGroups = function(type,baseGroups,compareGroups){
    let diff = null;
    if(typeof baseGroups !== 'object') return diff;
    if(typeof compareGroups !== 'object'){
        diff = {};
        Object.keys(prototypes[type].mapping).forEach(function(key){
            if(typeof baseGroups[key] === 'undefined'){
                diff[key] = true;
            }
        });
        return (Object.keys(diff).length > 0 ? diff:null);
    }
    else{
        diff = {};
        Object.keys(prototypes[type].mapping).forEach(function(key){
            if(typeof baseGroups[key] === 'undefined' && typeof compareGroups[key] !== 'undefined'){
                diff[key] = true;
            }
        });
        return (Object.keys(diff).length > 0 ? diff:null);
    }
};

/**
 * // TODO : improve nesting handling
 * @param type string
 * @param baseGroups object|boolean
 * @param compareGroups object|boolean
 * @return object|null
 */
const intersectGroups = function(type,baseGroups,compareGroups){
    if(typeof baseGroups !== 'object') return compareGroups;
    if(typeof compareGroups !== 'object') return baseGroups;
    let intersect = {};

    let baseSet = new Set(Object.keys(baseGroups));
    let compareSet = new Set(Object.keys(compareGroups));

    let setSection = new Set(
        [...baseSet].filter(x => compareSet.has(x)));

    setSection.forEach(function(key){
        intersect[key] = intersectGroups(type,baseGroups[key],compareGroups[key]);
    });
    return intersect;
};




/**
 * function called when dto data is received from the server
 * @param type
 * @param object
 */
const handleResponseObject = function(type,object){
    if(typeof cache[type] !== 'undefined' && typeof prototypes[type] !== 'undefined'){
        let cachedObject = cache[type].find(x => x.id === object.id);
        if(typeof cachedObject !== 'undefined'){
            let loadedGroups = mergeGroups(JSON.parse(JSON.stringify(cachedObject.loadedGroups)),object.loadedGroups);
            Object.assign(cachedObject,object);
            if(typeof object.finalize !=='undefined'){object.finalize(object.loadedGroups);}
            cachedObject.loadedGroups = loadedGroups;
            cache[type].push(cache[type].splice(cache[type].indexOf(cachedObject), 1)[0]);
            return cachedObject;
        }
        else{
            Object.setPrototypeOf(object,prototypes[type]);
            if(typeof object.finalize !=='undefined'){object.finalize();}
            cache[type].push(object);
            return object;
        }
    }
    return object; // fallback
};


console.log(prototypes);



let newObjects = {};
let idGenerators = {};

module.exports =
    {
        /**
         * @param search
         * @param sort
         * @param order
         * @param offset
         * @param limit
         * @returns object
         */
        createSearchBag : function(search={},sort='id',order='DESC',offset=0,limit=100){
            return {
                search : search,
                sort : sort,
                order : order,
                offset : offset,
                limit : limit
            }
        },
        /**
         * @param type
         * @param groups
         * @param id integer
         * @returns {Promise<any>}
         */
        getOneById : function(type,groups=true,id){
            return new Promise((resolve,reject) => {

                if(typeof cache[type] !== 'undefined'){
                    let cachedObject = cache[type].find(x => x.id = id);
                    if(cachedObject !== 'undefined'){
                        let diff = diffGroups(type,cachedObject.loadedGroups,groups);
                        if(diff === null) resolve({status:"success",message:"OK",data:cachedObject});
                    }
                    else{
                        groups = diff;
                    }
                }

                let url = buildGetUrl(urls.crud_get_one_by_id,{
                    type:type,
                    id:id,
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

                return fetchWithTimeout(url,requestProps,TIMEOUT)
                    .then(response => {console.log(response);
                        return response.json();})
                    .then(hResponse => {
                        console.log(hResponse);
                        console.log("posted");
                        if(hResponse.status === 'success'){
                            hResponse.data = handleResponseObject(type,hResponse.data);
                            watchCache(type);
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
        },
        /**
         * @param type
         * @param searchBag
         * @param groups
         * @returns {Promise<any>}
         */
        get : function(type,groups=true,searchBag=null){
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

                return fetchWithTimeout(url,requestProps,TIMEOUT)
                    .then(response => {console.log(response);
                        return response.json();})
                    .then(hResponse => {
                        console.log(hResponse);
                        console.log("posted");
                        if(hResponse.status === 'success'){
                            hResponse.rows = hResponse.rows.map(item => handleResponseObject(type,item) );
                            watchCache(type);
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
        },
        /**
         * @param type
         * @return Promise
         */
        getNew : function(type){
            return new Promise((resolve,reject) => {
                if(typeof idGenerators[type] === 'undefined'){
                    idGenerators[type] = new hb.util.cmn.getIdGenerator(0,-1);
                }
                if(typeof newObjects[type] !== 'undefined'){
                    console.log("already ok ");
                    let newObject = Object.create(typeof prototypes[type] !== 'undefined'?prototypes[type]:null);
                    newObject = Object.assign(newObject,newObjects[type]);
                    newObject.id = idGenerators[type]();
                    resolve(newObject);
                }
                else{
                    let url = buildGetUrl(urls.crud_get_new,{type:type});
                    console.log(url);

                    let requestProps = { method: 'GET',
                        headers: new Headers(),
                        credentials:'same-origin',
                        mode: 'same-origin',
                        cache: 'default' };

                    return fetchWithTimeout(url,requestProps,TIMEOUT)
                        .then(response => {
                            //console.log(response);
                            return response.json();})
                        .then(hResponse => {
                            console.log(hResponse);
                            console.log("loading");
                            if(hResponse.status === 'success'){
                                newObjects[type] = hResponse.data;
                                let newObject = Object.create(typeof prototypes[type] !== 'undefined'?prototypes[type]:null);
                                newObject = Object.assign(newObject,newObjects[type]);
                                newObject.id = idGenerators[type]();
                                console.log(newObject);
                                resolve(newObject);
                            }
                            else{
                                reject(new Error(hResponse.message));
                            }
                        })
                        .catch((error) => reject(error))
                        ;
                }

            });
        },
        /**
         * @param type
         * @param object
         * @param newData
         * @param groups
         * @returns {Promise<any>}
         */
        post : function(type,groups=true,object,newData=null){
            console.log(object);
            return new Promise((resolve,reject) => {
                let url = buildGetUrl(urls.crud_post,{type:type});

                let partial = object.getPartial(groups);
                if(newData !== null) Object.assign(partial,newData);
                partial.postedGroups = groups;
                partial._token = _token;

                let headers = new Headers();
                headers.append('Content-Type', 'application/json');

                let requestProps = { method: 'POST',
                    headers: headers,
                    credentials:'same-origin',
                    mode: 'same-origin',
                    body: JSON.stringify(partial),
                    cache: 'default' };

                console.log(requestProps.body);

                return fetchWithTimeout(url,requestProps,TIMEOUT)
                    .then(response => {console.log(response);
                        return response.json();})
                    .then(hResponse => {
                        console.log(hResponse);
                        console.log("posted");
                        if(hResponse.status === 'success'){
                            console.log(hResponse.data);
                            Object.assign(object,newData);
                            Object.assign(object,hResponse.data);
                            resolve(object);
                        }
                        else{
                            reject(new Error(hResponse.message));
                        }
                    })
                    .catch((error) => reject(error))
                    ;
            });
        },
        intersectGroups :function(type,baseGroups,compareGroups) {
            return intersectGroups(type,baseGroups,compareGroups);
        }
    };
