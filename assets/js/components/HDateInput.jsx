import React, {Component} from "react";
import {getOneByIdSelector, getSelector} from "../reducers";
import { connect } from 'react-redux'
import {getComponentClassType} from "../util/formUtil";
import { change as reduxFormChange} from 'redux-form/immutable';
import {ControlLabel,FormGroup,FormControl,Overlay,Col} from 'react-bootstrap';
import HDatePicker from './HDatePicker';

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

class HDateInput extends Component {
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
        this.setState({ value: value });
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
        const { input, label, type, meta ,dispatch} = this.props;
        const alignment = this.props.alignment || 'horizontal';
        const style = Object.assign(defaultStyles[alignment],this.props.style || {});
        /*console.log("HDate rendered");
        console.log(input);
        console.log(meta);*/
        const hDateLabel = (input.value && typeof input.value.getLabel !== 'undefined')?input.value.getLabel():input.value;
        /*console.log(input.value);
        console.log(hDateLabel);*/

        switch(alignment){
            case 'vertical':
                return (
                    <FormGroup validationState={null} style={style} >
                        <ControlLabel>{label}</ControlLabel>
                        <FormControl
                            ref='target'
                            value={hDateLabel}
                            componentClass="input"
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            type="text"
                            placeholder={label}>
                        </FormControl>
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
                            <HDatePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                    </FormGroup>
                );
            default:
                return (
                    <FormGroup validationState={null} style={style} >
                        <Col sm={3} md={2}>
                        <ControlLabel>{label}</ControlLabel>
                        </Col>
                        <Col sm={9} md={10}>
                        <FormControl
                            ref='target'
                            value={hDateLabel}
                            componentClass="input"
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            type="text"
                            placeholder={label}>
                        </FormControl>

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

                            <HDatePicker
                                className="lol"
                                initialValue={input.value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onClose={this.handleClose}
                                onSave={this.handleSave}
                            />
                        </Overlay>
                    </FormGroup>
                );
        }
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps)(HDateInput);