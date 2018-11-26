import React from "react";
import {Glyphicon,OverlayTrigger,Button} from 'react-bootstrap';
import {resetTooltip, submitTooltip} from "./tooltips";

const mock = {};

export function PostAllButton(props){
    return (
        <OverlayTrigger placement="bottom"
                        overlay={submitTooltip()}
                        ref={(ov) => {
                            mock.saveOverlayTrigger = ov;
                        }}
                        onClick={() => {mock.saveOverlayTrigger.handleDelayedHide()} }
        >
            <Button bsStyle="success"
                    onClick={props.onPostAll}>
                Enregistrer&nbsp;<Glyphicon glyph="upload"/>
            </Button>
        </OverlayTrigger>
    );
}

export function ResetAllButton(props){
    return (
        <OverlayTrigger placement="bottom"
                        overlay={resetTooltip()}
                        ref={(ov) => {
                            mock.resetOverlayTrigger = ov;
                        }}
                        onClick={() => {mock.resetOverlayTrigger.handleDelayedHide()} }
        >
            <Button bsStyle="warning"
                    onClick={props.onResetAll}>
                Reinitialiser&nbsp;<Glyphicon glyph="remove"/>
            </Button>
        </OverlayTrigger>
    );
}