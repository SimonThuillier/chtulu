import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HGeoEditing from './hgeoediting';
import HGeoUI from './hgeoui';

/**
 * The hgeoplugin.
 *
 * This plugin allows for the definition and placement of a HGeo icon into rich text edited by ckeditor5
 *
 */
export default class HGeo extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ HGeoEditing, HGeoUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HGeo';
	}
}