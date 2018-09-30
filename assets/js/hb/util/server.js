/**
 * @package hbase.js
 * @doc server.js : Handle data exchange between front-end app and the server
 * */

let urls = {
    crud_get : document.getElementById('hb-url-crud-get').getAttribute('data-url'),
    crud_get_new : document.getElementById('hb-url-crud-get-new').getAttribute('data-url'),
    crud_post : document.getElementById('hb-url-crud-post').getAttribute('data-url')
};
let _token = document.getElementById('hb-security-token').getAttribute('data-token');

const TIMEOUT = 1000000;

buildGetUrl = function(url,params=null){
    if (!params || params==null) return encodeURI(url);
    else{
        let query = Object.keys(params)
            .map(k => k + '=' + params[k])
            .join('&');
        return encodeURI(url + '?' + query);
    }
};

function fetchWithTimeout( url,props, timeout ) {
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
}

//function deepJsonStringify(object,)

/**
 * @class DTO
 */
const dtoPrototype = {
    dtoType: "rootDto",
    mapping: {},
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
const mappingDivs = document.getElementsByClassName('hb-dto-mapping');

for (let i = 0; i < mappingDivs.length; ++i) {
    let item = mappingDivs[i];
    let concreteDtoPrototype = Object.create(dtoPrototype);
    concreteDtoPrototype.mapping = JSON.parse(item.getAttribute('data-mapping'));
    prototypes[item.getAttribute('id').replace('hb-mapping-','')] = concreteDtoPrototype;
}
Object.keys(prototypes).forEach(function(key,index) {
    if(defaultPrototypes.hasOwnProperty(key)) Object.assign(prototypes[key],defaultPrototypes[key]);
    Object.freeze(prototypes[key]);
});

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
         * @param searchBag
         * @param groups
         * @returns {Promise<any>}
         */
        get : function(type,groups=true,searchBag=null){
            return new Promise((resolve,reject) => {
                //throw new Error("what ?");
                if(searchBag === null) searchBag = this.createSearchBag();
                let url = buildGetUrl(urls.crud_get,{
                    type:type,
                    searchBag:JSON.stringify(searchBag),
                    groups:JSON.stringify(groups)
                });

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
                            if(typeof prototypes[type] !== 'undefined'){
                                hResponse.rows.forEach(function(item){
                                    Object.setPrototypeOf(item,prototypes[type]);
                                    if(typeof item.finalize !=='undefined'){item.finalize();}
                                });
                            }
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
        }
    };
