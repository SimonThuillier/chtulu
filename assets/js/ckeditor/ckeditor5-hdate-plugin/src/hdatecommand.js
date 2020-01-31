import Command from '@ckeditor/ckeditor5-core/src/command';

import {getHDateElement} from "./utils";
const UUID = require("uuid/v4");
import HDate from '../../../util/HDate';
import {makeNewTimeMarker} from '../../../util/explorerUtil';

/**
 * The link command. It is used by the {@link module:link/link~Link link feature}.
 *
 * @extends module:core/command~Command
 */
export default class HDateCommand extends Command {
	/**
	 * The value of the `'data_HDate'` attribute if the start of the selection is located in a node with this attribute.
	 *
	 * @observable
	 * @readonly
	 * @member {Object|undefined} #value
	 */

	constructor( editor ) {
		super( editor );

        this.hdate=null;
        this.hDateElement= null;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;

		this.hDateElement=null;
		this.hdate=null;
        this.isEnabled=true;
        this.isOn=false;
        if ( selection.isCollapsed ) {
            //console.log('is my node HDate ? refresh');
            this.hDateElement = getHDateElement( selection.getFirstPosition() );
            if(!!this.hDateElement){
                this.hdate = HDate.prototype.parseFromJson(this.hDateElement.getAttribute('data-hdate'));
                this.isOn=true;
                console.log('hdate of hdateElement = ',this.hdate);
            }

        }

		//console.log('hdatecommand refresh',this.hdate);

	}

	/**
	 * Executes the command.
	 *
	 * if the element already exists its writer element data_HDate is updated according to the new hdate value
	 * else a new model element is inserted with data_HDate corresponding to the given hdate
	 *
	 * @fires execute
	 * @param {String} hdate
	 * @param {Object} [manualDecoratorIds={}] The information about manual decorator attributes to be applied or removed upon execution.
	 */
	execute( hdate, manualDecoratorIds = {} ) {

		const model = this.editor.model;
		const selection = model.document.selection;

		model.change( writer => {
            //console.log('hdate command is called !',hdate);

            const firstPosition = selection.getFirstPosition();

            //If selection is collapsed and contains TimeMarker update it
            if (!!this.hDateElement) {

                const newAttributes = {};
                newAttributes['data_HDate'] = JSON.stringify(hdate);
                newAttributes['title'] = hdate.getLabel();

                writer.setAttributes(newAttributes,firstPosition.nodeAfter);
            }
            else{
                const hDateElement = makeNewTimeMarker(
                    writer,hdate.getLabel(),JSON.stringify(hdate));

                    /*writer.createElement( 'TimeMarker',
                    {
                        id:key,
                        title:hdate.getLabel(),
                        data_HDate:JSON.stringify(hdate)
                    });*/
                writer.insertText(' ', firstPosition,'before');
                model.insertContent(hDateElement, firstPosition,'before');
                writer.insertText(' ', firstPosition,'before');
                // Create new range wrapping created node.
                //writer.setSelection( writer.createRangeOn( hDateElement ) );
            }

            this.hDateElement = null;
            this.hdate = null;
            this.isEnabled=false;
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
