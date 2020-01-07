
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HGeoCommand from './hgeocommand';

/**
 * The HDate engine feature.
 *
 * It introduces the `data_HDate="[HDate json serialization]"` attribute in the model which renders to the view
 * as a `<icon data_HDate="[HDate json serialization]">` element
 * as well as `'hdate'` command.
 */
export default class HGeoEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HGeoEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const locale = editor.locale;

        editor.model.schema.register( 'GeoMarker', {
                allowIn:"$block",
                allowContentOf: [],
                allowAttributes:['id','data_atomic_position','title'],
                inheritTypesFrom: '$block'
            }
        );

        editor.conversion.elementToElement( {
            model: 'GeoMarker',
            view: {
                name: 'icon',
                classes: 'fa fa-geo hb-richtext-marker'
            }
            ,
            upcastAlso: [
                'icon',
                {
                    classes  : 'fa fa-geo hb-richtext-marker'
                }
            ]
        } );

        editor.conversion.attributeToAttribute({
                model: {
                    name: 'GeoMarker',
                    key: 'title'
                },
                view: {
                    name: 'icon',
                    key: 'title'
                }
            }
        );

        editor.conversion.attributeToAttribute({
                model: {
                    name: 'TimeMarker',
                    key: 'id'
                },
                view: {
                    name: 'icon',
                    key: 'id'
                }
            }
        );

        editor.conversion.attributeToAttribute({
                model: {
                    name: 'TimeMarker',
                    key: 'data_atomic_position'
                },
                view: {
                    name: 'icon',
                    key: 'data-atomic-position'
                }
            }
        );

		// Create hgeo command.
		editor.commands.add( 'hgeo', new HGeoCommand( editor ) );
	}
}
