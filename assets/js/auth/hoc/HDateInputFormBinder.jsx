import withExtraProps from "./withExtraProps";
import React from "react";
import { Field} from 'redux-form/immutable';
import {
    Popover,Overlay
} from 'react-bootstrap';
import HDateInput from '../molecules/HDateInput2';
import HDatePicker from '../organisms/HDatePicker';


export default class HDateInputFormBinder extends React.Component {
    constructor(props) {
        super(props);
        this.componentUid = props.componentUid;

        this.toggleShow = this.toggleShow.bind(this);
        this.onClick = this.onClick.bind(this);

        this.handleSave = this.handleSave.bind(this);

        this.target = React.createRef();
        this.overlay = React.createRef();


        this.setRealInput = this.setRealInput.bind(this);
        this.realInput = null; // ugly but ok for now to handle save

        this.state = {
            show:false
        };
    }

    setRealInput(input){
        this.realInput = input;
        console.log("realInput");
        console.log(this.realInput);
    }

    componentDidMount() {window.addEventListener("click",this.onClick,true);}
    componentWillUnmount(){window.removeEventListener("click",this.onClick,true);}

    toggleShow(e){
        if(!this.state.show){
            console.log("toggle show");
            setTimeout(()=>{
                //console.log(this.overlay);
                if(this.overlay && this.overlay.current &&
                    this.overlay.current.parentNode &&
                    this.overlay.current.parentNode.parentNode){
                    const overlayRoot = this.overlay.current.parentNode.parentNode;
                    let left = +((overlayRoot.style.left).replace('px',''));
                    let top = +((overlayRoot.style.top).replace('px',''));
                    overlayRoot.style.left = `${left+150}px`;
                    overlayRoot.style.top = `${top-320}px`;
                    console.log(overlayRoot);

                }
            },20);
        }



        this.setState({show:!this.state.show});
        if(!!e){
            e.stopPropagation();
            e.preventDefault();
        }
        // console.log(e);
    }

    handleSave(value) {
        console.log(value);
        console.log(this.realInput);

        this.realInput.handleSave(value);
    }

    onClick(e){
        const {overlay} = this;
        const {show} = this.state;
        // console.log(`click : ${(show && overlay.current !== null && !overlay.current.contains(e.target))}`);
        if(show && overlay.current !== null && !overlay.current.contains(e.target)){
            this.toggleShow();
        }
    }

    render(){
        const {dispatch,container,name,label} = this.props;
        const {target} = this;
        const {show} = this.state;

        const initialValue= (this.realInput && this.realInput.props.input && this.realInput.props.input.value) || null;

        return (
                    <div>
                        <Field
                            ref={target}
                            key={`hdate-input-${this.componentUid}-${name}`}
                            name={name}
                            type="text"
                            component={withExtraProps(HDateInput,{
                                container:container||null,
                                show:show,
                                toggleShow:this.toggleShow,
                                setRealInput:this.setRealInput // ugly but ok for now
                            })}
                            label={label}
                        />
                        <Overlay
                            key={`overlay-trigger-${this.componentUid}-${name}`}
                            target={target.current}
                            placement="left"
                            container={container || null}
                            show={show}
                        >
                            <Popover key={`popover-contained-${this.componentUid}-${name}`} id={`popover-contained-${this.componentUid}`}>
                                <div ref={this.overlay}>
                                    <HDatePicker
                                        initialValue={initialValue}
                                        onClose={this.toggleShow}
                                        onSave={this.handleSave}
                                    />
                                </div>
                            </Popover>
                        </Overlay>
                    </div>
        );
    }
}