import React from "react";
import {getOneByIdSelector} from "../reducers";
import ArticleDetailMinimal from './ArticleDetailMinimal';
import ArticleDetailAbstract from './ArticleDetailAbstract';
import ArticleDetailImage from './ArticleDetailImage';
import GroupUtil from '../util/GroupUtil';
import {ButtonToolbar,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';

const ArticleDetail = function(props){
    const data = props.data;
    if (!data) return null;


    const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups||{});

    return (
        <div>
            <div className="row">
                {availableGroups.hasOwnProperty("minimal") &&
                <ArticleDetailMinimal type={data.type} beginHDate={data.beginHDate} endHDate={data.endHDate}/>
                }
                {availableGroups.hasOwnProperty("detailImage") &&
                <ArticleDetailImage detailImageResource={data.detailImageResource}/>
                }
            </div>
            <div className="row">
                <hr/>
            </div>
            <div className="row">
                {availableGroups.hasOwnProperty("abstract") &&
                <ArticleDetailAbstract abstract={data.abstract}/>
                }
            </div>
            <ButtonToolbar>
                <ToggleButtonGroup
                    type={'radio'}
                    name="options"
                    defaultValue={'detail'}
                >
                    <ToggleButton onClick={e=>{}} value={"detail"}>
                        Previsualiser
                    </ToggleButton>
                    <ToggleButton onClick={props.handleSwitch} value={"form"}>
                        Editer
                    </ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
        </div>
    );
};


export default ArticleDetail;