/**
 * @package hbase.js
 * @doc server.js : Handle data exchange between front-end app and the server
 * */

let urls = {
    crud_get_new : document.getElementById('hb-url-crud-get-new').getAttribute('data-url')
};

const TIMEOUT = 2000;

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

module.exports =
    {
        /**
         * @param type
         * @return Promise
         */
        getNew : function(type){
            let url = buildGetUrl(urls.crud_get_new,{type:type});
            console.log(url);

            let requestProps = { method: 'GET',
                headers: new Headers(),
                credentials:'same-origin',
                mode: 'same-origin',
                cache: 'default' };


            return fetchWithTimeout(url,requestProps,TIMEOUT)
                .then(response => response.json())
                .catch(function(error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                })
                .then(function(hResponse){
                    console.log("toto");
                })
                ;

        }
    };
