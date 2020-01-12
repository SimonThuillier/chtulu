
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HDateCommand from './hdatecommand';

/**
 * The HDate engine feature.
 *
 * It introduces the `data_HDate="[HDate json serialization]"` attribute in the model which renders to the view
 * as a `<icon data_HDate="[HDate json serialization]">` element
 * as well as `'hdate'` command.
 */
export default class HDateEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HDateEditing';
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

        editor.model.schema.register( 'TimeMarker', {
                allowIn:"$block",
                allowContentOf: [],
                allowAttributes:['id','data_HDate','title'],
                inheritTypesFrom: '$block'
            }
        );

        editor.conversion.elementToElement( {
            model: 'TimeMarker',
            view: {
                name: 'icon',
                classes: 'fa fa-history hb-richtext-marker'
            }
            ,
            upcastAlso: {
                //attributes:{'data-hdate':/^.+$/}
                classes:'fa-history'
            }
        } );

        // editor.conversion.attributeToElement( {
        //     model: 'TimeMarker',
        //     view: 'data-hdate'
        //     ,
        //     upcastAlso: [
        //         {attributes: 'data-hdate'}
        //     ]
        // } );

        editor.conversion.attributeToAttribute({
                model: {
                    name: 'TimeMarker',
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
                    key: 'data_HDate'
                },
                view: {
                    name: 'icon',
                    key: 'data-hdate'
                }
            }
        );

		// Create hdate command.
		editor.commands.add( 'hdate', new HDateCommand( editor ) );
	}
}
