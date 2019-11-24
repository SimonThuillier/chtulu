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

    const keys = [AVAILABLE_AREAS.GEOGRAPHY,AVAILABLE_AREAS.HISTORY,AVAILABLE_AREAS.TEXT];
    const getLabel = (value)=>{
        let label="";
        switch (value) {
            case AVAILABLE_AREAS.GEOGRAPHY:
                label = "Carte";
                break;
            case AVAILABLE_AREAS.HISTORY:
                label = "Frise";
                break;
            case AVAILABLE_AREAS.TEXT:
                label = "Texte";
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
                    ulStyle={{margin:"-37px 0 0 -10px",minWidth:"250px",maxHeight:"40px"}}
                    current={theme}
                    toggleKey={onChange}
                />
                <span>&nbsp;&nbsp;</span>
                <AreasSelector
                    style={{marginLeft:'-10px',marginRight:'10px'}}
                    ulStyle={{margin:"-37px 0 0 -10px",minWidth:"250px",maxHeight:"40px"}}
                    current={AVAILABLE_AREAS.GEOGRAPHY}
                    toggleKey={()=>{}}
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
