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
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Link from '@ckeditor/ckeditor5-link/src/link';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import HDate from '../../ckeditor/ckeditor5-hdate-plugin/src/hdate';
import HGeo from '../../ckeditor/ckeditor5-hgeo-plugin/src/hgeo';

import {getDecoratedEditor} from "../../ckeditor/util";
import HBUploadAdapterPlugin from "../../ckeditor/HBUploadAdapter";

const UUID = require("uuid/v4");

const editorConfiguration = {
    plugins: [ Essentials, Bold, Italic, Paragraph,Link,Heading,
        Image,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,ImageResize,

        MediaEmbed,HDate,HGeo
    ],
    extraPlugins:[HBUploadAdapterPlugin],
    toolbar: [ 'heading','bold', 'italic','link','imageUpload','mediaEmbed','hDate','hGeo'],
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

        this.activeHBWidget=false;
        this.enableHBWidget=this.enableHBWidget.bind(this);
        this.disableHBWidget=this.disableHBWidget.bind(this);

        //console.clear();
        console.log('Article content editor instanciation');
        console.log(props);

        this.state = {
        };

        this.editor = null;
        this.hasFocused = false;
        this.pluginCallback = null;

        this.componentUid = require("uuid/v4")();
    }

    componentDidMount()
    {
        window.addEventListener("hb.content-editor-widget.enable", this.enableHBWidget);
        window.addEventListener("hb.content-editor-widget.disable", this.disableHBWidget);
    }

    componentWillUnmount(){
        window.removeEventListener("hb.content-editor-widget.enable", this.enableHBWidget);
        window.removeEventListener("hb.content-editor-widget.disable", this.disableHBWidget);
    }

    enableHBWidget(){
        this.activeHBWidget=true;
    }

    disableHBWidget(){
        this.activeHBWidget=false;
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
            if(this.editor) this.editor.setData(this.props.input.value);
        }
    }



    render()
    {
        const {input} = this.props;
        console.log("render ArticleContentEditor");

        return (
            <div>
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



                console.log( 'Editor is ready to use!', this.editor );
                console.log('ckeditor names', Array.from(this.editor.ui.componentFactory.names()),this.editor.config._config.plugins.map((p)=>{return p.pluginName}) );

                this.editor.setData(this.props.input.value);
                } }
                onChange={ ( event, editor ) => {
                    this.editor = editor;
                    console.log('Change.', event);
                    if (this.activeHBWidget) {
                        console.log("widget enabled, stop the event");

                    }

                const data = editor.getData();
                input.onChange(data);
                } }
                onUpdate={( event, editor ) => {
                this.editor = editor;
                console.log('Update.', editor);
                }}
                onBlur={ ( event, editor ) => {
                this.editor = editor;
                console.log( 'editor Blur.', event,editor );
                const data = editor.getData();
                input.onBlur(data);
                this.hasFocused=false;
                } }
                onFocus={ ( event, editor ) => {
                this.hasFocused = true;
                this.editor = editor;
                console.log( 'editor Focus.', event,editor );
                input.onFocus(event);
                this.hasFocused=true;
                } }
                />
            </div>
        )
    }
}

export default ArticleContentEditor;