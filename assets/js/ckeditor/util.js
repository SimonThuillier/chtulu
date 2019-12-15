export const MODALS = {NEW_ARTICLE:'NEW_ARTICLE',TIME_MARKER:'TIME_MARKER'};

/**
 * decorate ckEditor to register custom model types and conversion rules
 * @param editor
 */
export const getDecoratedEditor = (editor) =>{

    // editor.model.schema.register( 'TimeMarker', {
    //         allowIn:"$block",
    //         // allowAttributes: ['data-test'] ,
    //         allowContentOf: '$text',
    //         allowAttributes:['id','data_HDate','title'],
    //         inheritTypesFrom: '$block'
    //     }
    // );
    //
    //
    // editor.conversion.elementToElement( {
    //     model: 'TimeMarker',
    //     view: {
    //         name: 'i',
    //         classes: 'fa fa-history hb-richtext-marker'
    //     }
    //     ,
    //     upcastAlso: [
    //         'i',
    //         {
    //             classes  : 'fa fa-history hb-richtext-marker'
    //         }
    //     ]
    // } );
    //
    // editor.conversion.attributeToAttribute({
    //         model: {
    //             name: 'TimeMarker',
    //             key: 'title'
    //         },
    //         view: {
    //             name: 'i',
    //             key: 'title'
    //         }
    //     }
    // );
    //
    // editor.conversion.attributeToAttribute({
    //         model: {
    //             name: 'TimeMarker',
    //             key: 'id'
    //         },
    //         view: {
    //             name: 'i',
    //             key: 'id'
    //         }
    //     }
    // );
    //
    // editor.conversion.attributeToAttribute({
    //         model: {
    //             name: 'TimeMarker',
    //             key: 'data_HDate'
    //         },
    //         view: {
    //             name: 'i',
    //             key: 'data-hdate'
    //         }
    //     }
    // );

    return editor;
};