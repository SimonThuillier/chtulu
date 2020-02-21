import React from "react";

import {
    Overlay,
    Popover
} from "react-bootstrap";
import HDatePicker from "../organisms/HDatePicker";

const windowPadding=15;


const componentUid = require("uuid/v4")();

class HBExplorerDateInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.inputRef = null;
        this.state = {
            show:false,
            value: "",
            pickerStyle:{}
        };

        this.targetLol = React.createRef();
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    handleFocus(){
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this.setState({show:true});

        setTimeout(()=>{
            const existingElement = document.getElementById('reactbs-overlayed-date-picker');
            console.log("toggle show hDatePicker",existingElement);

            if(! existingElement) return;

            const style={marginLeft:0,marginTop:0};
            if(existingElement.style){
                style.marginLeft = +existingElement.style.marginLeft.replace('px','');
                style.marginTop = +existingElement.style.marginTop.replace('px','');
            }
            //console.log('style',style);



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

            console.log("hDatePicker ",style);

            this.setState({pickerStyle:style});
        },20);


    }

    handleBlur(){
        this.setState({show:false});
    }

    handleClose() {
        this.setState({show:false});
        //console.log(this.inputRef.current);
        if(this.inputRef) this.inputRef.click();
    }

    handleSave(value) {
        const {setHInterval} = this.props;
        setHInterval(value);
        this.setState({show:false});
    }

    render() {
        const {setHInterval,input} = this.props;
        const {pickerStyle} = this.state;

        const hDateLabel =
            input && typeof input.getLabel !== "undefined"
                ? input.getLabel()
                : input;

        console.log('input',input,hDateLabel);

        return (
            <div
                className={'form-group'}
                style={{
                    //position: "absolute",
                    display: "inline-block",
                    padding: 0,
                    margin: 0,
                    width: 260,
                    fontSize: "13px",
                    textAlign: "center"
                }}
            >
                <Overlay
                rootClose={true}
                show={this.state.show}
                onHide={()=>{}}
                placement="left"
                container={null}
                target={this.targetLol.current}
            >
                <Popover key={`popover-contained-${componentUid}`} id={`popover-contained-${componentUid}`}>
                    <div ref={this.overlay}>
                        <HDatePicker
                            id={'reactbs-overlayed-date-picker'}
                            initialValue={input}
                            onFocus={this.handleFocus}
                            onClose={this.handleClose}
                            onSave={this.handleSave}
                            onBlur = {this.handleBlur}
                            style={pickerStyle}
                        />
                    </div>
                </Popover>
            </Overlay>

                <input
                    ref={this.targetLol}
                    onClick={this.handleFocus}
                    value={hDateLabel}
                    style={{
                        textAlign:'inherit',
                        display:'inline',
                        fontSize:'13px',
                        width:'260px',
                        height:'35px'
                    }}
                />
            </div>
        );
    }
}

export default HBExplorerDateInput;
