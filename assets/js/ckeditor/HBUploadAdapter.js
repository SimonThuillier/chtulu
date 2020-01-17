import {DataToPost, getHTTPUploadProps, getUrl, HB_ERROR, HB_SUCCESS, URL_UPLOAD} from "../util/server";

class HBUploadAdapter {
    constructor( loader ) {
        // The file loader instance to use during the upload.
        console.log('instanciating new HBUploadAdapter');
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        console.log("HBUploadAdapter, upload asked");
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {

                let fileNameParts;
                let name=file.name;
                if( (fileNameParts = /^(.+)\\.([^\\.]+)$/.exec(file.name)) !== null){
                    name = fileNameParts[1];
                }

                const url = getUrl(URL_UPLOAD,{
                    name:name,
                    contentType:file.type,
                    resourceType:1,
                    resourceId:null,
                    senderKey:'CK_HB_UPLOAD_ADAPTER',
                    _token:DataToPost()._token
                });
                let httpProps = getHTTPUploadProps(file.type);
                httpProps.body = file;

                console.log("HBUploadAdapter, upload begins",httpProps);

                fetch(url,httpProps)
                    .then(response => response.json())
                    .then(json => {
                            json.data = JSON.parse(json.data);
                            console.log(json);
                            switch (json.status) {
                                case HB_SUCCESS:
                                    console.log("HBUploadAdapter, upload post returned !",json);
                                    // todo : improve later
                                    const resourceId = Object.keys(json.data.resource)[0];
                                    const url = json.data.resource[resourceId].activeVersion.urlW800;

                                    resolve( {
                                        default: url,
                                        '500' : json.data.resource[resourceId].activeVersion.urlW500,
                                        '1': `HB://resource_id=${resourceId}`, // cheap trick to integrate id of the resource
                                        '800' : url
                                    } );
                                    break;
                                case HB_ERROR:
                                    reject(json.message);
                                    break;
                                default:
                            }
                        }
                    )
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        xhr.open( 'POST', 'http://example.com/image/upload/path', true );
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject, file ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve( {
                default: response.url
            } );
        } );

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest( file ) {
        // Prepare the form data.
        const data = new FormData();

        data.append( 'upload', file );

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        this.xhr.send( data );
    }
}


export default function HBUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new HBUploadAdapter( loader );
    };
}