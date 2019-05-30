import React from "react";
import {getOneByIdSelector} from "../selectors";
import ArticleDetailMinimal from './ArticleDetailMinimal';
import ArticleDetailAbstract from './ArticleDetailAbstract';
import ArticleDetailImage from './ArticleDetailImage';
import GroupUtil from '../util/GroupUtil';
import {Button,Glyphicon} from 'react-bootstrap';

const ArticleDetail = function(props){
    const data = props.data;
    if (!data) return null;


    const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups||{});

    const context = props.context || 'main';

    return (
        <div>
            <div className="row">
                {availableGroups.hasOwnProperty("minimal") &&
                <ArticleDetailMinimal
                    type={data.type}
                    beginHDate={data.beginHDate}
                    endHDate={data.endHDate}
                    hasEndDate={data.hasEndDate}/>
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
            <br/>
            {/*<Button bsStyle="primary"*/}
                    {/*disabled={false}*/}
                    {/*onClick={()=>{props.handleSwitch('form')}}>*/}
                {/*Editer&nbsp;<Glyphicon glyph={context==='modal'?'pencil':'edit'}/>*/}
            {/*</Button>*/}
        </div>
    );
};


export default ArticleDetail;