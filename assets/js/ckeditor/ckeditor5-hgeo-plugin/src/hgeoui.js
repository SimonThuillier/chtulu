
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { getHDateElement } from './utils';
import HGeoFormView from './ui/hgeoformview';

import HGeoIcon from '../theme/icons/earth.svg';

const linkKeystroke = 'Ctrl+Alt+G';

/**
 * The link UI plugin. It binds the HDatePicker widget and supports for the <kbd>Ctrl+ALT+H</kbd> keystroke.
 */
export default class HGeoUI extends Plugin {
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
        return 'HGeoUI';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        editor.editing.view.addObserver( ClickObserver );

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
     * Creates the HDateFormView instance.
     *
     * @private
     * @returns HDateFormView form view instance.
     */
    _createFormView() {
        const editor = this.editor;
        const hgeoCommand = editor.commands.get( 'hgeo' );

        const formView = new HGeoFormView( editor.locale);

        formView.bind( 'hgeo' ).to( hgeoCommand, 'value' );

        // Form elements should be read-only when corresponding commands are disabled.
        //formView.to( linkCommand, 'isEnabled', value => !value );
        //formView.saveButtonView.bind( 'isEnabled' ).to( linkCommand );

        // Execute link command after clicking the "Save" button.
        this.listenTo( formView, 'submit', () => {
            //console.log('HDateInput saved !',formView.hDate);
            //window.dispatchEvent(new CustomEvent("hb.content-editor-widget.disable"));
            editor.execute( 'hgeo', formView.data);
            this._hideUI();
        } );

        // Hide the panel after clicking the "Cancel" button.
        this.listenTo( formView, 'cancel', () => {
            //console.log('HDateInput canceled !');
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
     * Creates a toolbar HDate button. Clicking this button will show
     *
     * @private
     */
    _createToolbarLinkButton() {
        const editor = this.editor;
        const hgeoCommand = editor.commands.get( 'hgeo' );
        const t = editor.t;

        // Handle the `Ctrl+Alt+H` keystroke and show the panel.
        editor.keystrokes.set( linkKeystroke, ( keyEvtData, cancel ) => {
            // Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
            cancel();
            if ( hgeoCommand.isEnabled ) {
                this._showUI( true );
            }
        } );

        editor.ui.componentFactory.add( 'hgeo', locale => {
            const button = new ButtonView( locale );

            button.isEnabled = true;
            button.label = t( 'HGeo' );
            button.icon = HGeoIcon;
            button.keystroke = linkKeystroke;
            button.tooltip = true;
            button.isToggleable = true;

            // Bind button to the command.
            button.bind( 'isEnabled' ).to( hgeoCommand, 'isEnabled' );
            button.bind( 'isOn' ).to( hgeoCommand, 'isOn' );

            // Show the panel on button click.
            this.listenTo( button, 'execute', () => this._showUI( true ) );

            return button;
        } );
    }

    /**
     * Attaches actions that control whether the balloon panel containing the formView is visible or not.
     * @private
     */
    _enableUserBalloonInteractions() {
        const viewDocument = this.editor.editing.view.document;

        // Handle click on view document and show panel when selection is placed inside the link element.
        // Keep panel open until selection will be inside the same link element.
        this.listenTo( viewDocument, 'click', () => {
            //console.log('editor click');
            const parentLink = this._getSelectedHDateElement();

            if ( parentLink ) {
                //console.log('editor click on hdate, show UI');
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
                //console.log('click outside');
                this._hideUI();
            }
        } );
    }

    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();
    }

    /**
     * Shows the hDateFormView UI
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
     * Adds the hDateFormView to the balloon
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

        //console.log('add form view',hdateCommand.hdate);

        this._balloon.add( {
            view: this.formView,
            position: this._getBalloonPositionData()
        } );

        if(!!hdateCommand.hdate){
            this.formView.widget.props({initialValue:hdateCommand.hdate});
        }
        window.dispatchEvent(new CustomEvent('hb.widget.enable'));
        this.formView.widget.show();
    }

    /**
     * Makes the UI react to the event:update event to
     * reposition itself when the editor UI should be refreshed.
     *
     * See: _hideUI to learn when the UI stops reacting to the `update` event.
     *
     * @protected
     */
    _startUpdatingUI() {
        const editor = this.editor;

        const update = () => {
            //console.log('update editor');
            this._balloon.updatePosition( this._getBalloonPositionData() );
        };

        this.listenTo( editor.ui, 'update',update);
        this.listenTo( this._balloon, 'change:visibleView',update);
    }

    /**
     * Removes the hDateformView} from the _balloon
     * @protected
     */
    _hideUI() {
        if ( !this._balloon.hasView(this.formView ) ) {
            return;
        }

        //console.log('hide UI');

        const editor = this.editor;
        //window.dispatchEvent(new CustomEvent("hb.content-editor-widget.disable"));
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
            this._balloon.remove( this.formView );
            window.dispatchEvent(new CustomEvent('hb.widget.disable'));
        }
    }

    /**
     * Returns positioning options for the {HDateFormView_balloon}. They control the way the balloon is attached
     * to the target element or selection.
     *
     * the position is the beginning of the selection or juste before the created TimeMarker
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

        if ( selection.isCollapsed ) {
            return getHDateElement( selection.getFirstPosition() );
        } else {
            return null;
        }
    }
}
