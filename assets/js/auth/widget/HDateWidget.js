/**
 * define the HDatePicker widget : creates one single instance of the DOM panel
 * returns a single widget object allowing fro retrieving the DOM panel element
 * and passing properties to it thanks to a redux container
 */

import {HDatePickerAdapter} from '../hoc/HDatePickerAdapter';
import React from 'react';
import ReactDOM from 'react-dom';

const windowPadding=15;


const id = 'hdate-picker-widget';
const containerId = 'hdate-picker-widget' + '-container';

const container = document.createElement("div");
container.id = containerId;
document.getElementById('hb-data').appendChild(container);

const widget = {
    id:id,
    dispatch:null,
    containerRef:null,

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
            React.createElement(HDatePickerAdapter, {
                setDispatch:(dispatch)=>{widget.dispatch=dispatch},
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
        const textElement = document.getElementById(this.id+'-input');

        if(! existingElement) return;

        const style={marginLeft:0,marginTop:0};
        if(existingElement.style){
            style.marginLeft = +existingElement.style.marginLeft.replace('px','');
            style.marginTop = +existingElement.style.marginTop.replace('px','');
        }
        //console.log('style',style);

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const bounds = existingElement.getBoundingClientRect();
        console.log('widget bounding Rect',bounds,windowWidth);

        if(bounds.right + windowPadding > windowWidth){
            style.marginLeft+=windowWidth-(bounds.right + windowPadding);
        }
        else{
            style.marginLeft+=Math.min(-style.marginLeft,windowWidth-(bounds.right + windowPadding));
        }
        if(bounds.bottom + windowPadding > windowHeight){
            style.marginTop+=windowHeight-(bounds.bottom + windowPadding);
        }
        else{
            style.marginTop+=Math.min(-style.marginTop,windowHeight-(bounds.bottom + windowPadding));
        }

        this.props({style:style});

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