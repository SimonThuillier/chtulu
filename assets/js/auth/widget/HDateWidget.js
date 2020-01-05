import {HDatePickerAdapter,setProp,INITIAL_VALUE_KEY} from '../hoc/HDatePickerAdapter';
import React from 'react';
import ReactDOM from 'react-dom';


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
            console.warn("dispatch is null");
            return;
        }
        this.dispatch({type:'PROPS',props:props});
    },
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
    show:function(){
        console.log('widget containerRef',this.containerRef);
        const existingElement = document.getElementById(this.id);
        const textElement = document.getElementById(this.id+'-input');

        if(! existingElement) return;
        existingElement.focus();

        const windowWidth = window.innerWidth;

        const bounds = existingElement.getBoundingClientRect();
        console.log('widget bounding Rect',bounds,windowWidth);

        if(bounds.right + 25 > windowWidth){
            this.props({style:{marginLeft:windowWidth-(bounds.right + 25)}});
        }
        else{
            this.props({style:{marginLeft:0}});
        }

        //textElement.focus();
        //existingElement.removeEventListener('mousedown',this.onClick);
        //existingElement.addEventListener('mousedown',this.onClick);


    },
    hide:function(){
        const existingElement = document.getElementById(this.id);
        //if(!! existingElement) container.appendChild(existingElement);

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