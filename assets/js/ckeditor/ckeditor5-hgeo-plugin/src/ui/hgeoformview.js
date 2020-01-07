import View from '@ckeditor/ckeditor5-ui/src/view';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import HGeoWidget from '../../../../auth/widget/HGeoWidget';

/**
 * The link form view controller class.
 *
 * See {@link module:link/ui/linkformview~HDateFormView}.
 *
 * @extends module:ui/view~View
 */
export default class HDateFormView extends View {
    /**
     * Creates an instance of the {@link module:link/ui/linkformview~HDateFormView} class.
     *
     * Also see {@link #render}.
     *
     * @param {module:utils/locale~Locale} [locale] The localization services instance.
     * @param {module:utils/collection~Collection} [manualDecorators] Reference to manual decorators in
     * {@link module:link/linkcommand~LinkCommand#manualDecorators}.
     */
    constructor(locale, manualDecorators = []) {
        super(locale);
        //const t = locale.t;

        this.widget = HGeoWidget;

        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.hDate = null;

        /**
         * Tracks information about DOM focus in the form.
         *
         * @readonly
         * @member {module:utils/focustracker~FocusTracker}
         */
        this.focusTracker = new FocusTracker();

        /**
         * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
         *
         * @readonly
         * @member {module:utils/keystrokehandler~KeystrokeHandler}
         */
        this.keystrokes = new KeystrokeHandler();

        const classList = ['ck', 'ck-link-form'];


        this.setTemplate({
            tag: 'div',

            attributes: {
                class: classList,

                // https://github.com/ckeditor/ckeditor5-link/issues/90
                tabindex: '-1'
            },
            children: [this.widget.getDOMElement()]
        });
    }

    _bindWidget() {
        this.widget.props({
            onSave: this.onSave,
            onClose: this.onCancel
        });
    }

    onCancel() {
        this.fire('cancel');
    }

    onSave(value) {
        console.log(value);
        this.hDate = value;
        this.fire('submit');
        this.fire('cancel');
    }

    /**
     * Obtains the state of the {@link module:ui/button/switchbuttonview~SwitchButtonView switch buttons} representing
     * {@link module:link/linkcommand~LinkCommand#manualDecorators manual link decorators}
     * in the {@link module:link/ui/linkformview~HDateFormView}.
     *
     * @returns {Object.<String,Boolean>} Key-value pairs, where the key is the name of the decorator and the value is
     * its state.
     */
    getDecoratorSwitchesState() {
        return [];
    }

    /**
     * @inheritDoc
     */
    render() {
        console.log("render widget");
        super.render();
        this._bindWidget();
    }
}
