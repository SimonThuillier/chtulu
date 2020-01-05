/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/linkui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import { getHDateElement } from './utils';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import HDateFormView from './ui/hdateformview';

import HDateIcon from '../theme/icons/hdate.svg';

const linkKeystroke = 'Ctrl+Alt+K';

/**
 * The link UI plugin. It introduces the `'link'` and `'unlink'` buttons and support for the <kbd>Ctrl+K</kbd> keystroke.
 */
export default class HDateUI extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ ContextualBalloon ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'HDateUI';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        //editor.editing.view.addObserver( ClickObserver );

        /**
         * The view displayed inside the balloon.
         *
         * @member {module:link/ui/linkformview~HDateFormView}
         */
        this.formView = this._createFormView();


        /**
         * The contextual balloon plugin instance.
         *
         * @private
         * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
         */
        this._balloon = editor.plugins.get( ContextualBalloon );

        // Create toolbar buttons.
        this._createToolbarLinkButton();

        // Attach lifecycle actions to the the balloon.
        this._enableUserBalloonInteractions();
    }

    /**
     * Creates the {@link module:link/ui/linkformview~HDateFormView} instance.
     *
     * @private
     * @returns {module:link/ui/linkformview~HDateFormView} The link form view instance.
     */
    _createFormView() {
        const editor = this.editor;
        const hdateCommand = editor.commands.get( 'hdate' );

        const formView = new HDateFormView( editor.locale);

        formView.bind( 'hdate' ).to( hdateCommand, 'value' );

        // Form elements should be read-only when corresponding commands are disabled.
        //formView.to( linkCommand, 'isEnabled', value => !value );
        //formView.saveButtonView.bind( 'isEnabled' ).to( linkCommand );

        // Execute link command after clicking the "Save" button.
        this.listenTo( formView, 'submit', () => {
            console.log('HDateInput saved !',formView.hDate);
            window.dispatchEvent(new CustomEvent("hb.content-editor-widget.disable"));
            editor.execute( 'hdate', formView.hDate);
            this._hideUI();
        } );

        // Hide the panel after clicking the "Cancel" button.
        this.listenTo( formView, 'cancel', () => {
            console.log('HDateInput canceled !');
            this._hideUI();
        });

        // Close the panel on esc key press when the **form has focus**.
        formView.keystrokes.set( 'Esc', ( data, cancel ) => {
            this._hideUI();
            cancel();
        } );

        return formView;
    }

    /**
     * Creates a toolbar Link button. Clicking this button will show
     * a {@link #_balloon} attached to the selection.
     *
     * @private
     */
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

        editor.ui.componentFactory.add( 'hdate', locale => {
            const button = new ButtonView( locale );

            button.isEnabled = true;
            button.label = t( 'HDate' );
            button.icon = HDateIcon;
            button.keystroke = linkKeystroke;
            button.tooltip = true;
            button.isToggleable = true;

            // Bind button to the command.
            button.bind( 'isEnabled' ).to( linkCommand, 'isEnabled' );
            button.bind( 'isOn' ).to( linkCommand, 'isEnabled' );

            // Show the panel on button click.
            this.listenTo( button, 'execute', () => this._showUI( true ) );

            return button;
        } );
    }

    /**
     * Attaches actions that control whether the balloon panel containing the
     * {@link #formView} is visible or not.
     *
     * @private
     */
    _enableUserBalloonInteractions() {
        const viewDocument = this.editor.editing.view.document;

        // Handle click on view document and show panel when selection is placed inside the link element.
        // Keep panel open until selection will be inside the same link element.
        this.listenTo( viewDocument, 'click', () => {
            console.log('editor click');
            const parentLink = this._getSelectedHDateElement();

            if ( parentLink ) {
                console.log('editor click on hdate, show UI');
                // Then show panel but keep focus inside editor editable.
                this._showUI();
            }
        } );

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if ( this.this._balloon.hasView(this.formView )) {
                this._hideUI();
                cancel();
            }
        } );

        // Close on click outside of balloon panel element.
        clickOutsideHandler( {
            emitter: this.formView,
            activator: () => this._balloon.hasView(this.formView ),
            contextElements: [ this._balloon.view.element ],
            callback: () => {
                console.log('click outside');
                this._hideUI();
            }
        } );
    }

    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();

        // Destroy created UI components as they are not automatically destroyed (see ckeditor5#1341).
        this.formView.destroy();
    }

    /**
     * Shows the correct UI type for the current state of the command. It is either
     * {@link #formView} or {@link #actionsView}.
     *
     * @param {Boolean} forceVisible
     * @private
     */
    _showUI( forceVisible = false ) {
        const editor = this.editor;
        const hdateCommand = editor.commands.get( 'hdate' );

        if ( !hdateCommand.isEnabled ) {
            return;
        }

        this._addFormView();
        if ( forceVisible ) {
            this._balloon.showStack( 'main' );
        }

        // Begin responding to ui#update once the UI is added.
        this._startUpdatingUI();
    }

    /**
     * Adds the {@link #formView} to the {@link #_balloon}.
     *
     * @protected
     */
    _addFormView() {
        if ( this._balloon.hasView(this.formView ) ) {
            return;
        }



        const editor = this.editor;
        const hdateCommand = editor.commands.get( 'hdate' );
        hdateCommand.refresh();

        console.log('add form view',hdateCommand.hdate);

        this._balloon.add( {
            view: this.formView,
            position: this._getBalloonPositionData()
        } );

        //this.formView.focus();
        document.getElementById("hdate-picker-widget-form").focus();

        if(!!hdateCommand.hdate){
            this.formView.widget.props({initialValue:hdateCommand.hdate});
        }

        this.formView.widget.show();
    }

    /**
     * Makes the UI react to the {@link module:core/editor/editorui~EditorUI#event:update} event to
     * reposition itself when the editor UI should be refreshed.
     *
     * See: {@link #_hideUI} to learn when the UI stops reacting to the `update` event.
     *
     * @protected
     */
    _startUpdatingUI() {
        const editor = this.editor;
        const viewDocument = editor.editing.view.document;

        //let prevSelectedLink = this._getSelectedHDateElement();
        //let prevSelectionParent = getSelectionParent();

        window.dispatchEvent(new CustomEvent("hb.content-editor-widget.enable"));

        const update = () => {
            console.log('update editor');
            this._balloon.updatePosition( this._getBalloonPositionData() );
        };

        function getSelectionParent() {
            return viewDocument.selection.focus.getAncestors()
                .reverse()
                .find( node => node.is( 'element' ) );
        }

        this.listenTo( editor.ui, 'update', ()=>{
            console.log('update');
            update();
        });
        //this.listenTo( this._balloon, 'change:visibleView', ()=>{console.log('change:visibleView');update();});


    }

    /**
     * Removes the {@link #formView} from the {@link #_balloon}.
     *
     * See {@link #_addFormView}, {@link #_addActionsView}.
     *
     * @protected
     */
    _hideUI() {
        if ( !this._balloon.hasView(this.formView ) ) {
            return;
        }

        console.log('hide UI');

        const editor = this.editor;
        window.dispatchEvent(new CustomEvent("hb.content-editor-widget.disable"));
        this.stopListening( editor.ui, 'update' );
        this.stopListening( this._balloon, 'change:visibleView' );

        // Make sure the focus always gets back to the editable _before_ removing the focused form view.
        // Doing otherwise causes issues in some browsers. See https://github.com/ckeditor/ckeditor5-link/issues/193.
        editor.editing.view.focus();

        // Remove form first because it's on top of the stack.
        this._removeFormView();
    }

    /**
     * Removes the {@link #formView} from the {@link #_balloon}.
     *
     * @protected
     */
    _removeFormView() {
        if ( this._balloon.hasView(this.formView) ) {
            // Blur the input element before removing it from DOM to prevent issues in some browsers.
            // See https://github.com/ckeditor/ckeditor5/issues/1501.
            //this.formView.saveButtonView.focus();
            this.formView.widget.hide();
            this._balloon.remove( this.formView );

            // Because the form has an input which has focus, the focus must be brought back
            // to the editor. Otherwise, it would be lost.
            //this.editor.editing.view.focus();
        }
    }

    /**
     * Returns positioning options for the {@link #_balloon}. They control the way the balloon is attached
     * to the target element or selection.
     *
     * If the selection is collapsed and inside a link element, the panel will be attached to the
     * entire link element. Otherwise, it will be attached to the selection.
     *
     * @private
     * @returns {module:utils/dom/position~Options}
     */
    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const targetLink = this._getSelectedHDateElement();

        const target = targetLink ?
            // When selection is inside link element, then attach panel to this element.
            view.domConverter.mapViewToDom( targetLink ) :
            // Otherwise attach panel to the selection.
            view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );



        return { target };
    }

    /**
     * Returns the link {@link module:engine/view/attributeelement~AttributeElement} under
     * the {@link module:engine/view/document~Document editing view's} selection or `null`
     * if there is none.
     *
     * **Note**: For a non–collapsed selection, the link element is only returned when **fully**
     * selected and the **only** element within the selection boundaries.
     *
     * @private
     * @returns {module:engine/view/attributeelement~AttributeElement|null}
     */
    _getSelectedHDateElement() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;

        /*console.log("is there a selected HDateElement ?");

        console.log(selection);
        console.log(selection.getFirstPosition());
        console.log(selection.getFirstPosition().parent);
        console.log(selection.getFirstPosition().parent._textData);*/
        if ( selection.isCollapsed ) {
            return getHDateElement( selection.getFirstPosition() );
        } else {
            return null;
            // // The range for fully selected link is usually anchored in adjacent text nodes.
            // // Trim it to get closer to the actual link element.
            // const range = selection.getFirstRange().getTrimmed();
            // const startLink = findHDateElementAncestor( range.start );
            // const endLink = findHDateElementAncestor( range.end );
            //
            // if ( !startLink || startLink != endLink ) {
            // 	return null;
            // }
            //
            // // Check if the link element is fully selected.
            // if ( view.createRangeIn( startLink ).getTrimmed().isEqual( range ) ) {
            // 	return startLink;
            // } else {
            // 	return null;
            // }
        }
    }
}

// Returns a link element if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:engine/view/attributeelement~AttributeElement|null} Link element at the position or null.
function findHDateElementAncestor( position ) {
    return position.getAncestors().find( ancestor => getHDateElement( ancestor ) );
}
