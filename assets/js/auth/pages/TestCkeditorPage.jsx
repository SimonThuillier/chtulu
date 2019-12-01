import React from 'react';
import {Helmet} from 'react-helmet';

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

const editorConfiguration = {
    plugins: [ Essentials, Bold, Italic, Paragraph,Link,Heading,MediaEmbed,NewArticle ],
    toolbar: [ 'heading','bold', 'italic','link','mediaEmbed','newArticle']
};

class TestCkeditorPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);

        console.log(window.BalloonEditor);

        this.state = {
            showModal:false
        }
    }

    toggleModal(){
        this.setState({showModal:!this.state.showModal});
    }

    componentDidMount()
    {

    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {



        return (
            <div>
                <Helmet>
                    <title>Test Ckeditor</title>
                </Helmet>
                <div className="content-wrapper hb-container">
                    <section className="content-header">
                        <h4>Test CkEditor</h4>
                    </section>
                    <section className="content">
                        <CKEditor
                            editor={ BalloonEditor }
                            config={ editorConfiguration }
                            data="<p>Hello from CKEditor 5!</p>"
                            onInit={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                                editor.toggleNewArticleModal = this.toggleModal;
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                console.log( { event, editor, data } );
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                        />
                        <NewArticleModal show={this.state.showModal} handleClose={this.toggleModal}/>
                    </section>
                </div>
            </div>
        )
    }
}

export default TestCkeditorPage;