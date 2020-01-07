import React from 'react';

import {
    Modal,
    OverlayTrigger,
    Tooltip,
    Button,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import NewArticleModal from '../organisms/NewArticleModal';

// NOTE: Use the editor from source (not a build)!
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Link from '@ckeditor/ckeditor5-link/src/link';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import NewArticle from '../../ckeditor/NewArticlePlugin.js';
import HDate from '../../ckeditor/ckeditor5-hdate-plugin/src/hdate';
import HGeo from '../../ckeditor/ckeditor5-hgeo-plugin/src/hgeo';

import {getDecoratedEditor} from "../../ckeditor/util";

const UUID = require("uuid/v4");

const editorConfiguration = {
    plugins: [ Essentials, Bold, Italic, Paragraph,Link,Heading,MediaEmbed,NewArticle,HDate,HGeo ],
    toolbar: [ 'heading','bold', 'italic','link','mediaEmbed','newArticle','hDate','hGeo'],
    link: {
        addTargetToExternalLinks: true,
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
                        editor.handleHBPluginOpen = this.handleHBPluginOpen;

                        this.editor.setData(this.props.input.value);
                    } }
                    onChange={ ( event, editor ) => {
                        this.editor = editor;
                        console.log( 'Change.', event );
                        if(this.activeHBWidget){
                            console.log("widget enabled, stop the event");
                            //event.off();
                            //event.stop();
                        }
                        /*const data = editor.getData();
                        console.log( { event, editor, data } );
                        console.log("editor change",data);
                        console.log(data);*/
                        //input.onChange(data);
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