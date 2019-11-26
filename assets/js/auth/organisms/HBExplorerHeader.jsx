import React from "react";
import ArticleFilter from './ArticleFilter';
import HBExplorerHelp from './HBExplorerHelp';

import HorizontalDropdown from '../../shared/molecules/HorizontalDropdown';

import { AVAILABLE_THEMES,AVAILABLE_AREAS } from "../../util/explorerUtil";
import styled from "styled-components";

const Header = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
  height:100%;
  overflow:hidden;
`;



const ThemeSelector = ({style,ulStyle,current,toggleKey}) => {

    const keys = [AVAILABLE_THEMES.EDITOR,AVAILABLE_THEMES.SIDEVIEW,AVAILABLE_THEMES.VERTICAL];
    const getLabel = (value)=>{
        let label="";
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
        return label;
    };

    return (<HorizontalDropdown
        style={style}
        ulStyle={ulStyle}
        keys={keys}
        current={current}
        toggleKey={toggleKey}
        getLabel={getLabel}
        getTitle={getLabel}
        />
    );
};


const AreasSelector = ({style,ulStyle,current,toggleKey}) => {

    const keys = [AVAILABLE_AREAS.MAP,AVAILABLE_AREAS.TIME,AVAILABLE_AREAS.CONTENT];
    const getLabel = (value)=>{
        let label="";
        switch (value) {
            case AVAILABLE_AREAS.MAP:
                label = "Carte";
                break;
            case AVAILABLE_AREAS.TIME:
                label = "Frise";
                break;
            case AVAILABLE_AREAS.CONTENT:
                label = "Texte";
                break;
            default:
                label = "Default";
                break;
        }
        return label;
    };

    const getTitle = (value)=>{
        if (!Array.isArray(value)) value = [value];

        let title = `
        ${value.includes(AVAILABLE_AREAS.MAP)?'C':''}
        ${value.includes(AVAILABLE_AREAS.TIME)?'F':''}
        ${value.includes(AVAILABLE_AREAS.CONTENT)?'T':''}
        `;

        if(!title) title='-';
        return title;
    };

    return (<HorizontalDropdown
            style={style}
            ulStyle={ulStyle}
            keys={keys}
            current={current}
            toggleKey={toggleKey}
            getLabel={getLabel}
            getTitle={getTitle}
        />
    );
};




export default props => {
    const { onChange,toggleArea, theme,enabledAreas, onFilter,searchBag,setLimit } = props;

    return (
        <Header>
            <div
                style={{ padding: `0px` }}
                className="btn-group btn-toggle"
                data-toggle="buttons"
            >
                <ThemeSelector
                    style={{marginLeft:'-10px',marginRight:'10px'}}
                    ulStyle={{margin:"-37px 0 0 -10px",minWidth:"250px",maxHeight:"40px"}}
                    current={theme}
                    toggleKey={onChange}
                />
                <span>&nbsp;&nbsp;</span>
                <AreasSelector
                    style={{marginLeft:'-10px',marginRight:'10px'}}
                    ulStyle={{margin:"-37px 0 0 -10px",minWidth:"250px",maxHeight:"40px"}}
                    current={enabledAreas}
                    toggleKey={toggleArea}
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
