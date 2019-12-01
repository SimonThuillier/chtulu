import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

//import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import imageIcon from './ink.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import {MODALS} from "./util";

class NewArticlePlugin extends Plugin {

    init() {
        console.log( 'NewArticlePlugin was initialized' );
        const editor = this.editor;

        editor.ui.componentFactory.add( 'newArticle', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'New article',
                icon: imageIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                //const imageUrl = prompt( 'Image URL' );



                editor.model.change( writer => {

                    editor.toggleModal(MODALS.NEW_ARTICLE);

                    const content = '<p>A paragraph with <a href="https://ckeditor.com">some link</a>.';
                    const viewFragment = editor.data.processor.toView( content );
                    console.log('viewFrag',viewFragment);
                    const modelFragment = editor.data.toModel( viewFragment );
                    console.log('modelFrag',modelFragment);

                    editor.model.insertContent( modelFragment ,editor.model.document.selection.getLastPosition(),'end');

                    console.log("execute plugin");

                    // Insert the image in the current selection location.
                    //editor.model.insertContent( imageElement, editor.model.document.selection );
                } );
            } );

            return view;
        } );
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'NewArticlePlugin';
    }
};


export default NewArticlePlugin;