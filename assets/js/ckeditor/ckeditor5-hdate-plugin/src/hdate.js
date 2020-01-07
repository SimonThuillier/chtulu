import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HDateEditing from './hdateediting';
import HDateUI from './hdateui';

/**
 * The hdate plugin.
 *
 * This plugin allows for the definition and placement of a HDate icon into rich text edited by ckeditor5
 *
 */
export default class HDate extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ HDateEditing, HDateUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HDate';
	}
}