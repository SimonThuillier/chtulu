import React from "react";
import ArticleFilter from './ArticleFilter';
import HBExplorerHelp from './HBExplorerHelp';

import {
    DropdownButton,
    MenuItem
} from 'react-bootstrap';

import { AVAILABLE_THEMES } from "../../util/explorerUtil";
import styled from "styled-components";

const Header = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
  height:100%;
  overflow:hidden;
`;

/*const dropdownUl = document.querySelector(`[aria-labelledby="dropdown-basic-${this.id}"]`);
if(!!dropdownUl && typeof dropdownUl !== 'undefined'){
    dropdownUl.classList.add("list-inline");
    dropdownUl.style.margin = "-37px 0 0 -10px";
    dropdownUl.style['min-width'] = '180px';
    dropdownUl.style['max-height'] = '40px';
}*/

const ThemeSelector = ({style,id,current,setValue}) => {

    const limits = [AVAILABLE_THEMES.EDITOR,AVAILABLE_THEMES.SIDEVIEW,AVAILABLE_THEMES.VERTICAL
    ];

    const menuItems= limits.map((limit)=>(
        <MenuItem
            key={limit}
            className={'hb-number-selector'} eventKey={limit}
            active={+limit === +current}>
            {`${limit}`}
        </MenuItem>));

    return (<DropdownButton
            bsStyle={'default'}
            title={current}
            key={1}
            id={`dropdown-basic-${id}`}
            defaultOpen={false}
            rootCloseEvent={'click'}
            className={'list-inline'}
            style={{...style}}
            onSelect={(eventKey,event)=>{
                console.log(event);
                console.log(+eventKey);
                setValue(+eventKey);
            }}
        >
            {menuItems}
        </DropdownButton>
    );
};

const Option = ({ onChange, value, currentValue }) => {
    let label = "";

    switch (value) {
        case AVAILABLE_THEMES.EDITOR:
            label = "lay. edition";
            break;
        case AVAILABLE_THEMES.SIDEVIEW:
            label = "lay. coté";
            break;
        case AVAILABLE_THEMES.VERTICAL:
            label = "lay. vertical";
            break;
        default:
            label = "Default";
            break;
    }

    const isActive = value === currentValue;
    const className = isActive ? `btn btn-primary active` : `btn btn-default`;

    return (
        <label
            className={className}
            onClick={() => {
                if (!isActive) {
                    onChange(value);
                }
            }}
        >
            <input
                type="radio"
                name="options"
                value={value}
            />
            {label}
        </label>
    );
};

export default props => {
    const { onChange, theme,onFilter,searchBag,setLimit } = props;

    return (
        <Header>
            <div
                style={{ padding: `0px` }}
                className="btn-group btn-toggle"
                data-toggle="buttons"
            >
                <ThemeSelector
                    style={{marginLeft:'-10px',marginRight:'10px'}}
                    id = {require('uuid/v4')()}
                    current={AVAILABLE_THEMES.EDITOR}
                    setValue={()=>{}}
                />
                <Option
                    onChange={onChange}
                    currentValue={theme}
                    value={AVAILABLE_THEMES.EDITOR}
                />
                <Option
                    onChange={onChange}
                    currentValue={theme}
                    value={AVAILABLE_THEMES.SIDEVIEW}
                />
                <Option
                    onChange={onChange}
                    currentValue={theme}
                    value={AVAILABLE_THEMES.VERTICAL}
                />
            </div>
            <div>
                <ArticleFilter
                    fields={['keyword']}
                    onSubmit={onFilter}
                    mini={true}
                    searchBag={searchBag}
                    setLimit={setLimit}
                    />
            </div>
            <div style={{marginLeft: 'auto'}}>
                <HBExplorerHelp/>
            </div>
        </Header>
    );
};
