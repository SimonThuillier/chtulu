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
import HDatePicker from './HDatePicker';

import {MODALS,getDecoratedEditor} from "../../ckeditor/util";

const UUID = require("uuid/v4");

const editorConfiguration = {
    plugins: [ Essentials, Bold, Italic, Paragraph,Link,Heading,MediaEmbed,NewArticle,HDate ],
    toolbar: [ 'heading','bold', 'italic','link','mediaEmbed','newArticle','hDate'],
    link: {
        addTargetToExternalLinks: true,
    }
};



class ArticleContentEditor extends React.Component
{
    constructor(props)
    {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleHBPluginOpen = this.handleHBPluginOpen.bind(this);
        this.handleHBPluginSave = this.handleHBPluginSave.bind(this);
        this.handleHBPluginClose = this.handleHBPluginClose.bind(this);
        //console.clear();
        console.log('Article content editor instanciation');
        console.log(props);

        this.state = {
            showModal:null
        };

        this.editor = null;
        this.hasFocused = false;
        this.pluginCallback = null;

        this.componentUid = require("uuid/v4")();
    }

    toggleModal(modal){
        if(this.state.showModal === modal) this.setState({showModal:null});
        else this.setState({showModal:modal});
    }

    /**
     * when one of dedicated plugin is called the plugin access this function
     * */
    handleHBPluginOpen(modal,callback){

        console.log("open hbPlugin",modal);

        this.pluginCallback = callback;
        this.setState({showModal:modal});

    }

    handleHBPluginSave(value){

        console.log('HB plugin save',value);
        this.pluginCallback(`hb-article-content-editor-${this.state.showModal}-${UUID()}`,value);



        this.pluginCallback = null;
        this.setState({showModal:null})


    }

    handleHBPluginClose(){
        console.log("close hbPlugin");


        this.pluginCallback = null;
        this.setState({showModal:null})


    }

    componentDidMount()
    {
        console.log('jQuery ?',$);
        //console.clear();
        //console.log('Article content editor didmount');
        //console.log(this.props);
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
        const {showModal} = this.state;
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
                        /*console.log( 'Change.', editor );
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        console.log("editor change",data);
                        console.log(data);*/
                        //input.onChange(data);
                    } }
                    onBlur={ ( event, editor ) => {
                        this.editor = editor;
                        console.log( 'Blur.', editor );
                        const data = editor.getData();
                        input.onBlur(data);
                    } }
                    onFocus={ ( event, editor ) => {
                        this.hasFocused = true;
                        this.editor = editor;
                        console.log( 'Focus.', editor );
                        input.onFocus(event);
                    } }
                />
                <NewArticleModal show={showModal===MODALS.NEW_ARTICLE} handleClose={()=>{this.toggleModal(MODALS.NEW_ARTICLE)}}/>
                <Modal show={showModal===MODALS.TIME_MARKER} onHide={this.handleHBPluginClose}>
                    <HDatePicker
                        initialValue={null}
                        onFocus={()=>{}}
                        onClose={this.handleHBPluginClose}
                        onSave={this.handleHBPluginSave}
                    />
                </Modal>
            </div>
        )
    }
}

export default ArticleContentEditor;