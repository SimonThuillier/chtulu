import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUi from '@ckeditor/ckeditor5-link/src/linkui';

//import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import imageIcon from './calendar.svg';
import {MODALS} from "./util";

import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';


import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';


class HDateUi extends LinkUi{

    _createToolbarLinkButton() {
        const editor = this.editor;
        const linkCommand = editor.commands.get( 'link' );
        const t = editor.t;

        // Handle the `Ctrl+K` keystroke and show the panel.
        editor.keystrokes.set( linkKeystroke, ( keyEvtData, cancel ) => {
            // Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
            cancel();

            if ( linkCommand.isEnabled ) {
                this._showUI( true );
            }
        } );

        editor.ui.componentFactory.add( 'link', locale => {
            const button = new ButtonView( locale );

            button.isEnabled = true;
            button.label = t( 'Link' );
            button.icon = linkIcon;
            button.keystroke = linkKeystroke;
            button.tooltip = true;
            button.isToggleable = true;

            // Bind button to the command.
            button.bind( 'isEnabled' ).to( linkCommand, 'isEnabled' );
            button.bind( 'isOn' ).to( linkCommand, 'value', value => !!value );

            // Show the panel on button click.
            this.listenTo( button, 'execute', () => this._showUI( true ) );

            return button;
        } );
    }

};


export default HDateUi;



// init() {
//     console.log( 'HDatePlugin was initialized' );
//     const editor = this.editor;
//     this._balloon = this.editor.plugins.get( ContextualBalloon );
//
//     editor.ui.componentFactory.add( 'hDate', locale => {
//         const view = new ButtonView( locale );
//
//         view.set( {
//             label: 'Dater ce texte',
//             icon: imageIcon,
//             tooltip: true
//         } );
//
//         // Callback executed once the image is clicked.
//         view.on( 'execute', () => {
//             //const imageUrl = prompt( 'Image URL' );
//
//             //editor.toggleNewArticleModal();;
//
//             editor.model.change( writer => {
//
//                 console.log("execute HDate plugin");
//
//                 const lastPosition = editor.model.document.selection.getLastPosition();
//
//                 const callback = (key,value) =>{
//                     console.log(value);
//
//
//
//                     const hDateElement = writer.createElement( 'TimeMarker',
//                         {
//                             id:key,
//                             title:value.getLabel(),
//                             data_HDate:JSON.stringify(value)
//                         });
//                     editor.model.insertContent(hDateElement, lastPosition,'end');
//
//
//                 };
//
//                 editor.handleHBPluginOpen(MODALS.TIME_MARKER,callback);
//                 /*console.log(editor);
//                 console.log(editor.data.processor);
//                 //console.log(editor.model.document.selection.getLastRange());
//
//                 // writer method
//                 const paragraph = writer.createElement( 'span');
//                 const text = writer.createText("hello",paragraph);
//                 writer.insertElement(text,editor.model.document.selection.getLastPosition(),'end');
//
//                 // model method
//                 const content = '<span data-test="lol">a text linked to some date</span>.';
//                 const viewFragment = editor.data.processor.toView( content );
//                 console.log('viewFrag',viewFragment);
//                 const modelFragment = editor.data.toModel( viewFragment );
//                 console.log('modelFrag',modelFragment);
//
//                 const elementProperties = {};
//                 elementProperties['data-test'] = "lol";
//                 const footnoteElement = writer.createElement( 'TimeMarker',{title:'lol',hbtest:'hello'});
//                 console.log(footnoteElement);
//
//
//                 editor.model.insertContent( footnoteElement, editor.model.document.selection.getLastPosition(),'end');
//
//                 //editor.model.insertContent( modelFragment,editor.model.document.selection.getLastPosition(),'end');
//
//                 console.log("execute plugin");
//
//                 // Insert the image in the current selection location.
//                 //editor.model.insertContent( imageElement, editor.model.document.selection );*/
//             } );
//         } );
//
//         return view;
//     } );
// }
//
//
// /**
//  * Adds the {@link #formView} to the {@link #_balloon}.
//  *
//  * @protected
//  */
// _addFormView() {
//     //if ( this._isFormInPanel ) {
//     //   return;
//     //}
//
//     const editor = this.editor;
//     //const linkCommand = editor.commands.get( 'link' );
//
//     this._balloon.add( {
//         view: this.formView,
//         position: this._getBalloonPositionData()
//     } );
//
//     // Select input when form view is currently visible.
//     //if ( this._balloon.visibleView === this.formView ) {
//     //    this.formView.urlInputView.select();
//     //}
//
//     // Make sure that each time the panel shows up, the URL field remains in sync with the value of
//     // the command. If the user typed in the input, then canceled the balloon (`urlInputView#value` stays
//     // unaltered) and re-opened it without changing the value of the link command (e.g. because they
//     // clicked the same link), they would see the old value instead of the actual value of the command.
//     // https://github.com/ckeditor/ckeditor5-link/issues/78
//     // https://github.com/ckeditor/ckeditor5-link/issues/123
//     //this.formView.urlInputView.inputView.element.value = linkCommand.value || '';
// }
//
// _getBalloonPositionData() {
//     const view = this.editor.editing.view;
//     const viewDocument = view.document;
//     const targetLink = this._getSelectedLinkElement();
//
//     const target = targetLink ?
//         // When selection is inside link element, then attach panel to this element.
//         view.domConverter.mapViewToDom( targetLink ) :
//         // Otherwise attach panel to the selection.
//         view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );
//
//     return { target };
// }
//
// /**
//  * @inheritDoc
//  */
// static get pluginName() {
//     return 'HDatePlugin';
// }
//
// /**
//  * @inheritDoc
//  */
// static get requires() {
//     return [ ContextualBalloon ];
// }