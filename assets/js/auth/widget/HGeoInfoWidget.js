/**
 * define the HGeoInfoPicker widget : creates one single instance of the DOM panel
 * returns a single widget object allowing for retrieving the DOM panel element
 * and passing properties to it thanks to a redux container
 */

import {HGeoInfoPickerAdapter} from '../hoc/HGeoInfoPickerAdapter';
import React from 'react';
import ReactDOM from 'react-dom';

const windowPadding=10;

const id = 'hgeo-info-picker-widget';
const containerId = 'hgeo-info-picker-widget' + '-container';

const container = document.createElement("div");
container.style=Object.assign(container.style,{"z-index":16000});
container.id = containerId;
document.getElementById('hb-data').appendChild(container);

const widget = {
    id:id,
    dispatch:null,
    containerRef:null,
    map:null,

    props:function(props){
        if(!this.dispatch){
            return;
        }
        this.dispatch({type:'PROPS',props:props});
    },
    /**
     * returns the panel DOM element
     * @returns {HTMLElement}
     */
    getDOMElement:function(){
        const existingElement = document.getElementById(this.id);
        if(!! existingElement){
            //existingElement.remove();
            return existingElement;
        }

        // else create it
        // first unmount and clean the node
        try{
            ReactDOM.unmountComponentAtNode(container);
        }catch(e){};
        // then create
        ReactDOM.render(
            React.createElement(HGeoInfoPickerAdapter, {
                setDispatch:(dispatch)=>{widget.dispatch=dispatch},
                setMap:(map)=>{this.map=map;},
                key:widget.id,
                id:widget.id,
                initialValue:null,
                onFocus:()=>{},
                onClose:()=>{},
                onSave:()=>{},
                setContainerRef:this.setContainerRef,
            }, null)
            , document.getElementById(containerId));

        return document.getElementById(this.id)
    },
    setContainerRef:function(ref){
        this.containerRef = ref;
    },
    /**
     * adjust position of widget to stay inside the page
     */
    show:function(){
        console.log('widget containerRef',this.containerRef);
        const existingElement = document.getElementById(this.id);
        const mapElement = document.getElementById('hgeo-picker-widget-map-div');

        if(! existingElement) return;


        const style={marginLeft:0,marginTop:0};
        if(existingElement.style){
            style.marginLeft = +existingElement.style.marginLeft.replace('px','');
            style.marginTop = +existingElement.style.marginTop.replace('px','');
        }

        const bounds = existingElement.getBoundingClientRect();
        const mapBounds = mapElement.getBoundingClientRect();
        console.log('widget+map bounding Rect',bounds,mapBounds);

        if(bounds.right + windowPadding > mapBounds.right){
            style.marginLeft+=mapBounds.right-(bounds.right + windowPadding);
        }
        else{
            style.marginLeft+=Math.min(-style.marginLeft,mapBounds.right-(bounds.right + windowPadding));
        }
        if(bounds.bottom + windowPadding > mapBounds.bottom){
            style.marginTop+=mapBounds.bottom-(bounds.bottom + windowPadding);
        }
        else{
            style.marginTop+=Math.min(-style.marginTop,mapBounds.bottom-(bounds.bottom + windowPadding));
        }

        this.props({style:style});
        existingElement.focus();

        if(!!this.map) this.map.invalidateSize();
    },
    onClick:function(e){
        //e.stopPropagation();
        //e.preventDefault();
        console.log('widget click');
    }

};

widget.props = widget.props.bind(widget);
widget.getDOMElement = widget.getDOMElement.bind(widget);
widget.setContainerRef = widget.setContainerRef.bind(widget);
widget.onClick = widget.onClick.bind(widget);

export default widget;