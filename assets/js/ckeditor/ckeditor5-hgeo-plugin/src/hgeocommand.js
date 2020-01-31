import Command from '@ckeditor/ckeditor5-core/src/command';

import {getHGeoElement} from "./utils";
const UUID = require("uuid/v4");
import {makeNewGeoMarker,getTitleFromFeatures} from '../../../util/explorerUtil';

/**
 * The link command. It is used by the {@link module:link/link~Link link feature}.
 *
 * @extends module:core/command~Command
 */
export default class HGeoCommand extends Command {
	/**
	 * The value of the `'data_HGeo'` attribute if the start of the selection is located in a node with this attribute.
	 *
	 * @observable
	 * @readonly
	 * @member {Object|undefined} #value
	 */

	constructor( editor ) {
		super( editor );

        this.geoData=null;
        this.hGeoElement= null;
	}

    /**
     * @inheritDoc
     */
    refresh() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;

        this.hGeoElement=null;
        this.geoData=null;
        this.isEnabled=true;
        this.isOn=false;
        if (selection.isCollapsed) {
            //console.log('is my node HDate ? refresh');
            this.hGeoElement = getHGeoElement( selection.getFirstPosition() );
            if(!!this.hGeoElement){
                this.geoData = JSON.parse(this.hGeoElement.getAttribute("data-hgeo"));
                this.isOn=true;
                console.log('geoData of hgeoElement = ',this.geoData);
            }
        }

        //console.log('hdatecommand refresh',this.hdate);

    }

	/**
	 * Executes the command.
	 *
	 * if the element already exists its writer element data_HGeo is updated according to the new geoData value
	 * else a new model element is inserted with data_HGeo corresponding to the given geoData
	 *
	 * @fires execute
	 * @param {String} geoData
	 * @param {Object} [manualDecoratorIds={}] The information about manual decorator attributes to be applied or removed upon execution.
	 */
	execute( geoData, manualDecoratorIds = {} ) {

		const model = this.editor.model;
		const selection = model.document.selection;

		model.change( writer => {
            console.log('geo command is called !',geoData);

            const firstPosition = selection.getFirstPosition();

            //If selection is collapsed and contains TimeMarker update it
            if (!!this.hGeoElement) {

                const newAttributes = {};

                newAttributes['data_HGeo'] = JSON.stringify(geoData);
                newAttributes['title'] = getTitleFromFeatures(geoData.drawnItems.features);

                writer.setAttributes(newAttributes,firstPosition.nodeAfter);
            }
            else{
                const hGeoElement = makeNewGeoMarker(
                    writer,
                    getTitleFromFeatures(geoData.drawnItems.features),
                    JSON.stringify(geoData)
                );


                    /*writer.createElement( 'GeoMarker',
                    {
                        id:key,
                        data_HGeo:JSON.stringify(geoData),
                        title:getTitleFromFeatures(geoData.drawnItems.features)
                    });*/
                writer.insertText(' ', firstPosition,'before');
                model.insertContent(hGeoElement, firstPosition,'before');
                writer.insertText(' ', firstPosition,'before');
                // Create new range wrapping created node.
                writer.setSelection( writer.createRangeOn( hGeoElement ) );
            }

            this.hGeoElement = null;
            this.geoData = null;
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
