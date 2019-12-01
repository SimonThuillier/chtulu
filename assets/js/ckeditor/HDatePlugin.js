import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

//import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import imageIcon from './calendar.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {MODALS} from "./util";


class HDatePlugin extends Plugin {

    init() {
        console.log( 'HDatePlugin was initialized' );
        const editor = this.editor;

        editor.ui.componentFactory.add( 'hDate', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Dater ce texte',
                icon: imageIcon,
                tooltip: true
            } );

            editor.model.schema.register( 'TimeMarker', {
                allowIn:"$block",
                // allowAttributes: ['data-test'] ,
                allowContentOf: '$text',
                allowAttributesOf: '$block',
                inheritTypesFrom: '$block'
            }
            );


            editor.conversion.elementToElement( {
                model: 'TimeMarker',
                view: {
                    name: 'i',
                    classes: 'fa fa-history hb-richtext-marker'
                }
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                //const imageUrl = prompt( 'Image URL' );

                //editor.toggleNewArticleModal();;

                editor.model.change( writer => {

                    console.log("execute HDate plugin");
                    editor.toggleModal(MODALS.TIME_MARKER);
                    console.log(editor);
                    console.log(editor.data.processor);
                    //console.log(editor.model.document.selection.getLastRange());

                    // writer method
                    /*const paragraph = writer.createElement( 'span');
                    const text = writer.createText("hello",paragraph);
                    writer.insertElement(text,editor.model.document.selection.getLastPosition(),'end');*/

                    // model method
                    const content = '<span data-test="lol">a text linked to some date</span>.';
                    const viewFragment = editor.data.processor.toView( content );
                    console.log('viewFrag',viewFragment);
                    const modelFragment = editor.data.toModel( viewFragment );
                    console.log('modelFrag',modelFragment);

                    const elementProperties = {};
                    elementProperties['data-test'] = "lol";
                    const footnoteElement = writer.createElement( 'TimeMarker',{});
                    console.log(footnoteElement);


                    editor.model.insertContent( footnoteElement, editor.model.document.selection.getLastPosition(),'end');

                    //editor.model.insertContent( modelFragment,editor.model.document.selection.getLastPosition(),'end');

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
        return 'HDatePlugin';
    }
};


export default HDatePlugin;