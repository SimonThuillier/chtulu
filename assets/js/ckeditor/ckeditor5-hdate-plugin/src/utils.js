/**
 * Returns the element if a given view node is the HDate element, null if not
 *
 * @param {module:engine/model/position~Position} position
 * @returns {Element|null}
 */
export function getHDateElement( position) {

    //console.log('is my node HDate ?',position,position.getAncestors());

    // case at the beginning of paragraph
    try{
        //console.log('is my node HDate ?',position.parent.childCount);
        if(+position.offset ===0 && !!position.parent.childCount && +position.parent.childCount>0){
            const firstChild = position.parent.getChild(0);
            //console.log('is my node HDate ?',position.parent.childCount,firstChild);
            if(firstChild.hasAttribute('data-hdate')){
                //console.log('my node is HDate !');
                return firstChild;
            }
        }
    }
    catch(e){}

    //console.log('is my node HDate2 ?',position,position.parent._textData,position.offset);
    if(!!position.parent && !!position.parent._textData && position.parent._textData.length === +position.offset){
        const ancestors = position.getAncestors();
        let ancestor = null;

        for (let i=ancestors.length-1;i>=0;i--){
            ancestor = ancestors[i];
            if(!!ancestor.nextSibling){
                if(ancestor.nextSibling.hasAttribute('data-hdate')) return ancestor.nextSibling;
                else return null;
            }
        }
    }



    /*if(!position.parent || !position.parent.nextSibling){
        // case after one containerElement (like another time or geomarker)
        const nodeAfter = position.nodeAfter;
        if(!!nodeAfter && nodeAfter.hasAttribute('data-hdate')){
            return nodeAfter;
        }
    }
    else{
        // case at the end of some text
        const offset= position.offset;
        const length = position.parent.data?position.parent.data.length:0;

        const nextSibling = position.parent.nextSibling;

        //console.log('is my node HDate ?',position.parent,nextSibling,offset,length);

        if(+offset === +length && nextSibling.hasAttribute('data-hdate')){
            //console.log('my node is HDate !');
            return nextSibling;
        }
    }*/

	return null;
}
