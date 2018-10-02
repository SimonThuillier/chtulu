import React, {Component} from 'react';


export function Preview(props) {
    return (
        <a className="like" href="javascript:void(0)" title="Previsualiser">
            <i onClick={props.onClick} className="fa fa-info-circle"/>
        </a>
    );
}