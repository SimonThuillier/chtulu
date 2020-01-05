/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/linkcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import findLinkRange from './findlinkrange';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import {MODALS} from "../../util";
import {getHDateElement,getHDateRange} from "./utils";
const UUID = require("uuid/v4");
import HDate from '../../../util/HDate';

/**
 * The link command. It is used by the {@link module:link/link~Link link feature}.
 *
 * @extends module:core/command~Command
 */
export default class HDateCommand extends Command {
	/**
	 * The value of the `'linkHref'` attribute if the start of the selection is located in a node with this attribute.
	 *
	 * @observable
	 * @readonly
	 * @member {Object|undefined} #value
	 */

	constructor( editor ) {
		super( editor );

		/**
		 * A collection of {@link module:link/utils~ManualDecorator manual decorators}
		 * corresponding to the {@link module:link/link~LinkConfig#decorators decorator configuration}.
		 *
		 * You can consider it a model with states of manual decorators added to the currently selected link.
		 *
		 * @readonly
		 * @type {module:utils/collection~Collection}
		 */
		//this.manualDecorators = new Collection();

        this.hdate=null;
        this.hDateElement= null;
	}

	/**
	 * Synchronizes the state of {@link #manualDecorators} with the currently present elements in the model.
	 */
	// restoreManualDecoratorStates() {
	// 	for ( const manualDecorator of this.manualDecorators ) {
	// 		manualDecorator.value = this._getDecoratorStateFromModel( manualDecorator.id );
	// 	}
	// }

	/**
	 * @inheritDoc
	 */
	refresh() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;
		const model = this.editor.model;
		const doc = model.document;

		this.hDateElement=null;
		this.hdate=null;
        if ( selection.isCollapsed ) {
            console.log('is my node HDate ? refresh');
            this.hDateElement = getHDateElement( selection.getFirstPosition() );
            if(!!this.hDateElement)this.hdate = HDate.prototype.parseFromJson(this.hDateElement.getAttribute('data-hdate'));
        }

		console.log('hdatecommand refresh',this.hdate);
        this.isEnabled=true;
	}

	/**
	 * Executes the command.
	 *
	 * When the selection is non-collapsed, the `linkHref` attribute will be applied to nodes inside the selection, but only to
	 * those nodes where the `linkHref` attribute is allowed (disallowed nodes will be omitted).
	 *
	 * When the selection is collapsed and is not inside the text with the `linkHref` attribute, a
	 * new {@link module:engine/model/text~Text text node} with the `linkHref` attribute will be inserted in place of the caret, but
	 * only if such element is allowed in this place. The `_data` of the inserted text will equal the `href` parameter.
	 * The selection will be updated to wrap the just inserted text node.
	 *
	 * When the selection is collapsed and inside the text with the `linkHref` attribute, the attribute value will be updated.
	 *
	 * # Decorators and model attribute management
	 *
	 * There is an optional argument to this command that applies or removes model
	 * {@glink framework/guides/architecture/editing-engine#text-attributes text attributes} brought by
	 * {@link module:link/utils~ManualDecorator manual link decorators}.
	 *
	 * Text attribute names in the model correspond to the entries in the {@link module:link/link~LinkConfig#decorators configuration}.
	 * For every decorator configured, a model text attribute exists with the "link" prefix. For example, a `'linkMyDecorator'` attribute
	 * corresponds to `'myDecorator'` in the configuration.
	 *
	 * To learn more about link decorators, check out the {@link module:link/link~LinkConfig#decorators `config.link.decorators`}
	 * documentation.
	 *
	 * Here is how to manage decorator attributes with the link command:
	 *
	 *		const linkCommand = editor.commands.get( 'link' );
	 *
	 *		// Adding a new decorator attribute.
	 *		linkCommand.execute( 'http://example.com', {
	 *			linkIsExternal: true
	 *		} );
	 *
	 *		// Removing a decorator attribute from the selection.
	 *		linkCommand.execute( 'http://example.com', {
	 *			linkIsExternal: false
	 *		} );
	 *
	 *		// Adding multiple decorator attributes at the same time.
	 *		linkCommand.execute( 'http://example.com', {
	 *			linkIsExternal: true,
	 *			linkIsDownloadable: true,
	 *		} );
	 *
	 *		// Removing and adding decorator attributes at the same time.
	 *		linkCommand.execute( 'http://example.com', {
	 *			linkIsExternal: false,
	 *			linkFoo: true,
	 *			linkIsDownloadable: false,
	 *		} );
	 *
	 * **Note**: If the decorator attribute name is not specified, its state remains untouched.
	 * decorator attributes.
	 *
	 * @fires execute
	 * @param {String} hdate
	 * @param {Object} [manualDecoratorIds={}] The information about manual decorator attributes to be applied or removed upon execution.
	 */
	execute( hdate, manualDecoratorIds = {} ) {

		console.log('hdate command is called !',hdate);

		const model = this.editor.model;
		const selection = model.document.selection;
		// Stores information about manual decorators to turn them on/off when command is applied.
		const truthyManualDecorators = [];
		const falsyManualDecorators = [];

		/*for ( const name in manualDecoratorIds ) {
			if ( manualDecoratorIds[ name ] ) {
				truthyManualDecorators.push( name );
			} else {
				falsyManualDecorators.push( name );
			}
		}*/

		model.change( writer => {
            console.log('hdate command is called !',hdate);

            const firstPosition = selection.getFirstPosition();

            //If selection is collapsed and contains TimeMarker update it
            if (!!this.hDateElement) {

                //getHDateRange(this.hDateElement);
                const view = this.editor.editing.view;
                //const hDateRange =model.createRange(selection.getFirstPosition(),model.createPositionAt(this.hDateElement,'after'));

                const newAttributes = {};
                newAttributes['data-hdate'] = JSON.stringify(hdate);
                newAttributes['title'] = hdate.getLabel();

                writer.setAttributes(newAttributes,firstPosition.nodeAfter);
            }
            else{
                const key = `hb-article-content-editor-${MODALS.TIME_MARKER}-${UUID()}`;
                const hDateElement = writer.createElement( 'TimeMarker',
                    {
                        id:key,
                        title:hdate.getLabel(),
                        data_HDate:JSON.stringify(hdate)
                    });
                model.insertContent(hDateElement, firstPosition,'before');
                // Create new range wrapping created node.
                writer.setSelection( writer.createRangeOn( hDateElement ) );
            }

            /*this.hDateElement = null;
            this.hdate = null;
            this.isEnabled=false;*/
		} );
	}

	/**
	 * Provides information whether a decorator with a given name is present in the currently processed selection.
	 *
	 * @private
	 * @param {String} decoratorName The name of the manual decorator used in the model
	 * @returns {Boolean} The information whether a given decorator is currently present in the selection.
	 */
	_getDecoratorStateFromModel( decoratorName ) {
		const doc = this.editor.model.document;
		return doc.selection.getAttribute( decoratorName ) || false;
	}
}
