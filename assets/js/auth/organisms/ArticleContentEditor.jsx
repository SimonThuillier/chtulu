// NOTE: Use the editor from source (not a build)!
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';

import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';


import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import HDate from '../../ckeditor/ckeditor5-hdate-plugin/src/hdate';
import HGeo from '../../ckeditor/ckeditor5-hgeo-plugin/src/hgeo';

import {getDecoratedEditor} from "../../ckeditor/util";
import HBUploadAdapterPlugin from "../../ckeditor/HBUploadAdapter";

import {makeNewUIGeoMarker,makeNewUITimeMarker} from '../../util/explorerUtil';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import DowncastWriter from '@ckeditor/ckeditor5-engine/src/view/downcastwriter';

const UUID = require("uuid/v4");

const editorConfiguration = {
    plugins: [ Essentials, Bold, Italic,Underline, Paragraph,Link,List,BlockQuote,Heading,
        Image,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,ImageResize,

        MediaEmbed,HDate,HGeo
    ],
    extraPlugins:[HBUploadAdapterPlugin],
    toolbar: [ 'heading','bulletedList','blockQuote','|','bold', 'italic','underline','link','|','imageUpload','mediaEmbed','|','hDate','hGeo','|','undo','redo'],
    link: {
        addTargetToExternalLinks: true,
    },
    image:{toolbar:['imageStyle:full', 'imageStyle:side'],styles:[
            {name:'full',className: 'hb-full-image'},
            {name:'side',className: 'hb-side-image'}
        ]
    }

};



class ArticleContentEditor extends React.Component
{
    constructor(props)
    {
        super(props);

        //console.clear();
        console.log('Article content editor instanciation');
        console.log(props);
        this.onPaste = this.onPaste.bind(this);

        this.state = {
        };

        this.editor = BalloonEditor;
        this.hasFocused = false;
        this.pluginCallback = null;

        this.componentUid = require("uuid/v4")();
    }

    onPaste(evt,data)
    {
        console.log('editor on paste',evt,data.content);

        let index = 0;
        for(const child of data.content.getChildren()){
            if(!!child.hasClass && child.hasClass("hb-richtext-marker")){
                const writer = new UpcastWriter();
                const dwriter = new DowncastWriter();
                data.content._removeChildren(index);
                console.log('paste child ',child);
                if(child.hasAttribute('data-hgeo')){
                    let element = makeNewUIGeoMarker(
                        dwriter,
                        child.getAttribute('title'),
                        child.getAttribute('data-hgeo').replace(/"id":"/g,'"id":"n-')
                    );
                    console.log('paste new child ',element);
                    data.content._insertChild(index,element);


                    //data.content._appendChild(element);
                    console.log('paste data content',data.content);

                }
                else if(child.hasAttribute('data-hdate')){
                    let element = makeNewUITimeMarker(
                        dwriter,
                        child.getAttribute('title'),
                        child.getAttribute('data-hdate')
                    );
                    console.log('paste new child ',element);
                    data.content._insertChild(index,element);


                    //data.content._appendChild(element);
                    console.log('paste data content',data.content);
                }

            }
            index=index+1;
        }
    }

    componentDidMount()
    {

    }

    componentWillUnmount()
    {
        //this.editor.plugins.get( 'Clipboard' ).off( 'inputTransformation',this.onPaste );
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !this.hasFocused;
    }

    componentDidUpdate(prevProps)
    {
        //console.clear();
        //console.log('Article content editor did update');
        //console.log(this.props);
        //console.log(this.editor);

        if(this.props.input.value !== prevProps.input.value){
            //console.log(this.props.input.value);
            if(!!this.editor && !!this.editor.setData) this.editor.setData(this.props.input.value);
        }
    }



    render()
    {
        const {input} = this.props;
        //console.log("render ArticleContentEditor");

        return (
            <div className={'col-md-12'}>
                <CKEditor
                    editor={ BalloonEditor }
                    config={ editorConfiguration }
                    data={""}
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        this.editor = getDecoratedEditor(editor);
                        // disable css ck-reset-all class
                        const ckHiddenRoot = document.querySelector('.ck-reset_all');
                        if(!!ckHiddenRoot) ckHiddenRoot.classList.remove('ck-reset_all');



                        //console.log( 'Editor is ready to use!', this.editor );
                        //console.log('ckeditor names', Array.from(this.editor.ui.componentFactory.names()),this.editor.config._config.plugins.map((p)=>{return p.pluginName}) );

                        this.editor.plugins.get( 'Clipboard' ).on( 'inputTransformation',this.onPaste );

                        this.editor.setData(this.props.input.value || "Renseignez le corps de l'article");
                    } }
                    onChange={ ( event, editor ) => {
                        //this.editor = editor;

                        //const data = editor.getData();
                        //input.onChange(data);
                    } }
                    onUpdate={( event, editor ) => {
                        this.editor = editor;
                        //console.log('Update.', editor);
                    }}
                    onBlur={ ( event, editor ) => {
                        this.editor = editor;
                        //console.log( 'editor Blur.', event,editor );
                        const data = editor.getData();
                        input.onBlur(data);
                        this.hasFocused=false;
                    } }
                    onFocus={ ( event, editor ) => {
                        this.hasFocused = true;
                        this.editor = editor;
                        //console.log( 'editor Focus.', event,editor );
                        input.onFocus(event);
                        this.hasFocused=true;
                    } }
                />
            </div>
        )
    }
}

export default ArticleContentEditor;