import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../selectors";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
import {ControlLabel,FormGroup,FormControl,Overlay,Col,HelpBlock,Button} from 'react-bootstrap';
import ResourcePicker from './ResourcePicker';

const defaultStyles = {
    horizontal:{
        paddingBottom: 15,
        paddingTop: 15,
        position: "relative"
    },
    vertical:{
        position: "relative"
    }
};

class ImageInput extends Component {
    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.focusCounter = 0;

        this.state = {
            show: false,
            value: ""
        };
    }

    handleClose() {
        setTimeout(() => {
            this.focusCounter = 0;
            console.log(`onClose ${this.focusCounter}`);
            this.setState({ show: false });
        }, 20);
    }

    handleSave(value) {
        const {input:{onChange,onBlur}} = this.props;

        console.log("saving hdate");
        console.log(this.props);
        console.log(value);
        onChange(value);
        onBlur(value);

        //this.setState({ value: value });
    }

    handleFocus() {
        this.focusCounter = this.focusCounter + 1;
        console.log(`onFocus ${this.focusCounter}`);
        this.setState({ show: true });
    }

    handleBlur() {
        const counter = this.focusCounter + 0;
        console.log(`onBlur ${counter}`);
        setTimeout(() => {
            console.log(
                `timedOut bluer oldCounter ${counter} vs ${this.focusCounter}`
            );
            if (this.focusCounter === counter) {
                this.setState({ show: false });
            }
        }, 15);
    }



    render(){
        const { input, label, type,  meta: {touched,error,warning} ,dispatch} = this.props;

        const alignment = this.props.alignment || 'horizontal';
        const style = Object.assign(defaultStyles[alignment],this.props.style || {});
        /*console.log("HDate rendered");
        console.log(input);
        console.log(meta);*/
        const hDateLabel = "ImageInput";
        /*console.log(input.value);
        console.log(hDateLabel);*/

        switch(alignment){
            case 'vertical':
                return (
                    <FormGroup
                        validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                        style={style} >
                        <ControlLabel>{label}</ControlLabel>
                        <Button
                            ref='target'
                            onClick={this.handleFocus}
                        >{hDateLabel}</Button>
                        <Overlay
                            rootClose={true}
                            show={this.state.show}
                            onHide={() => this.setState({ show: false })}
                            placement="left"
                            container={this}
                            target={() => {
                                return ReactDOM.findDOMNode(this.refs.target);
                            }}
                        >
                            <ResourcePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                        {touched && (error || warning) &&
                        <HelpBlock>{error|| warning}</HelpBlock>
                        }
                    </FormGroup>
                );
            default:
                return (
                    <FormGroup
                        validationState={!touched?null:(error?"error":(warning?"warning":"success"))}
                        style={style} >
                        <Col sm={3} md={2}>
                            <ControlLabel>{label}</ControlLabel>
                        </Col>
                        <Col sm={9} md={10}>
                            <Button
                                ref='target'
                                onClick={this.handleFocus}
                            >{hDateLabel}</Button>
                        </Col>
                        <Overlay
                            rootClose={true}
                            show={this.state.show}
                            onHide={() => this.setState({ show: false })}
                            placement="left"
                            container={this}
                            target={() => {
                                console.log(this.refs);
                                console.log(ReactDOM.findDOMNode(this.refs.target));
                                return ReactDOM.findDOMNode(this.refs.target);
                            }}
                        >

                            <ResourcePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                        {touched && (error || warning) &&
                        <HelpBlock>{error || warning}</HelpBlock>
                        }
                    </FormGroup>
                );
        }
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps)(ImageInput);