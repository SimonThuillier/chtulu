/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/link
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import HDateEditing from './hdateediting';
import HDateUI from './hdateui';

/**
 * The link plugin.
 *
 * This is a "glue" plugin that loads the {@link module:link/linkediting~LinkEditing link editing feature}
 * and {@link module:link/linkui~LinkUI link UI feature}.
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