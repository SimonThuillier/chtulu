/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/linkediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HDateCommand from './hdatecommand';
import '../theme/link.css';

const HIGHLIGHT_CLASS = 'ck-link_selected';
const DECORATOR_AUTOMATIC = 'automatic';
const DECORATOR_MANUAL = 'manual';
const EXTERNAL_LINKS_REGEXP = /^(https?:)?\/\//;

/**
 * The link engine feature.
 *
 * It introduces the `linkHref="url"` attribute in the model which renders to the view as a `<a href="url">` element
 * as well as `'link'` and `'unlink'` commands.
 *
 * @extends module:core/plugin~Plugin
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

		/*editor.config.define( 'link', {
			addTargetToExternalLinks: false
		} );*/
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const locale = editor.locale;

        editor.model.schema.register( 'TimeMarker', {
                allowIn:"$block",
                // allowAttributes: ['data-test'] ,
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
            upcastAlso: [
                'icon',
                {
                    classes  : 'fa fa-history hb-richtext-marker'
                }
            ]
        } );

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

		// Create linking commands.
		editor.commands.add( 'hdate', new HDateCommand( editor ) );
	}
}
