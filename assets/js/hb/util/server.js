/**
 * @package hbase.js
 * @doc server.js : Handle data exchange between front-end app and the server
 * */

let urls = {
    crud_get_new : document.getElementById('hb-url-crud-get-new').getAttribute('data-url')
};

const TIMEOUT = 10000;

buildGetUrl = function(url,params){
    if (!params) return encodeURI(url);
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


let newObjects = {};
let idGenerators = {};


const prototypes = {article:{
            /**
             * @doc : function aimed to finalize constitution of new HArticle created by parsing JSon
             * @return {hb.util.dto.Article}
             */
            finalize : function(){
                //console.log(this);
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
        resourceGeometry : {
            getPointLat(){
                if(typeof this.value ==='undefined' ||
                    typeof this.value.type ==='undefined' ||
                    this.value.type !=='Point') return 0;
                return this.value.coordinates[0];
            },
            getPointLng(){
                if(typeof this.value ==='undefined' ||
                    typeof this.value.type ==='undefined' ||
                    this.value.type !=='Point') return 0;
                return this.value.coordinates[1];
            }


        }
    }
;

module.exports =
    {
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
                        .then(response => response.json())
                        .then(hResponse => {
                            //console.log(hResponse);
                            console.log("loading");
                            if(hResponse.status === 'success'){
                                newObjects[type] = hResponse.data;
                                let newObject = Object.create(typeof prototypes[type] !== 'undefined'?prototypes[type]:null);
                                newObject = Object.assign(newObject,newObjects[type]);
                                newObject.id = idGenerators[type]();
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
        }
    };
