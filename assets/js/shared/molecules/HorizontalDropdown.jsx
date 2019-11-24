import React from "react";
import {
    DropdownButton,
    MenuItem
} from 'react-bootstrap';

const uidGenerator = require('uuid/v4');


export default class HorizontalDropdown extends React.Component
{
    constructor(props)
    {
        super(props);

        this.id = uidGenerator();


    }

    componentDidMount()
    {
        const {ulStyle} = this.props;


        const dropdownUl = document.querySelector(`[aria-labelledby="hb-horizontal-dropdown-${this.id}"]`);
        if(!!dropdownUl && typeof dropdownUl !== 'undefined'){
            dropdownUl.classList.add("list-inline");

            Object.assign(dropdownUl.style,ulStyle);
        }
    }

    render()
    {
        const {style,keys,current,toggleKey,getLabel,getTitle} = this.props;
        const id = this.id;


        const menuItems= keys.map((key)=>(
            <MenuItem
                key={key}
                className={'hb-number-selector'} eventKey={key}
                active={(Array.isArray(current))?current.includes(key):key === current}>
                {`${getLabel(key)}`}
            </MenuItem>));

        return (<DropdownButton
                bsStyle={'default'}
                title={getTitle(current)}
                key={1}
                id={`hb-horizontal-dropdown-${id}`}
                defaultOpen={false}
                rootCloseEvent={'click'}
                className={'list-inline'}
                style={{...style}}
                onSelect={(eventKey,event)=>{
                    console.log(event);
                    console.log(eventKey);
                    toggleKey(eventKey);
                }}
            >
                {menuItems}
            </DropdownButton>
        );
    }
};