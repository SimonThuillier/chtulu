import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getComponentClassType } from "../util/formUtil";
import {
    ControlLabel,
    FormGroup,
    FormControl,
    Overlay,
    OverlayTrigger,
    Popover,
    Col,
    HelpBlock
} from "react-bootstrap";
import HDatePicker from "./HDatePicker";

const defaultStyles = {
    horizontal: {
        paddingBottom: 15,
        paddingTop: 15,
        position: "relative"
    },
    vertical: {
        position: "relative"
    }
};

class HDateInput extends Component {
    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.inputRef = null;
        this.state = {
            value: ""
        };
    }

    handleClose() {
        console.log(this.inputRef.current);
        this.inputRef.click();
    }

    handleSave(value) {
        const {
            input: { onChange, onBlur }
        } = this.props;
        onChange(value);
        onBlur(value);
    }

    render() {
        const {
            input,
            label,
            placeholder,
            type,
            meta: { touched, error, warning },
            dispatch
        } = this.props;

        const alignment = this.props.alignment || "horizontal";
        let thisDefaultStyles = { ...defaultStyles[alignment] };
        const style = Object.assign(thisDefaultStyles, this.props.style || {});
        /*console.log("HDate rendered");
        console.log(input);
        console.log(meta);*/
        const hDateLabel =
            input.value && typeof input.value.getLabel !== "undefined"
                ? input.value.getLabel()
                : input.value;
        /*console.log(input.value);
        console.log(hDateLabel);*/

        let dateInput = this;

        switch (alignment) {
            case "verticallol":
                return (
                    <div>
                        <FormGroup
                            validationState={
                                !touched
                                    ? null
                                    : error
                                    ? "error"
                                    : warning
                                        ? "warning"
                                        : "success"
                            }
                            style={style}
                        >
                            {label !== null && <ControlLabel>{label}</ControlLabel>}
                            <FormControl
                                ref="target"
                                value={hDateLabel}
                                componentClass="input"
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                type="text"
                                style={{ textAlign: "inherit" }}
                                placeholder={placeholder}
                            />
                            {touched && (error || warning) && (
                                <HelpBlock>{error || warning}</HelpBlock>
                            )}
                        </FormGroup>
                        <Overlay
                            rootClose={true}
                            show={this.state.show}
                            //onHide={() => this.setState({ show: false })}
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
                    </div>
                );
            default:
                return (
                    <FormGroup
                        validationState={
                            !touched
                                ? null
                                : error
                                ? "error"
                                : warning
                                    ? "warning"
                                    : "success"
                        }
                        style={style}
                    >
                        {label !== null && (
                            <Col sm={3} md={2}>
                                <ControlLabel>{label}</ControlLabel>
                            </Col>
                        )}
                        <Col sm={9} md={10}>
                            <OverlayTrigger
                                trigger="click"
                                placement="left"
                                rootClose={true}
                                container={this.props.container || null}
                                rootCloseEvent={'click'}
                                overlay={
                                    <Popover id="popover-contained" arrowProps={null}>
                                        <HDatePicker
                                            initialValue={input.value}
                                            onClose={dateInput.handleClose}
                                            onSave={dateInput.handleSave}
                                        />
                                    </Popover>
                                }
                            >
                                <div ref={input => (this.inputRef = input)}>
                                    <FormControl
                                        value={hDateLabel}
                                        componentClass="input"
                                        //onFocus={this.handleFocus}
                                        //onBlur={this.handle}
                                        type="text"
                                        style={{ textAlign: "inherit" }}
                                        placeholder={placeholder}
                                    />
                                </div>
                            </OverlayTrigger>
                        </Col>

                        {touched && (error || warning) && (
                            <HelpBlock>{error || warning}</HelpBlock>
                        )}
                    </FormGroup>
                );
        }
    }
}

export default HDateInput;
