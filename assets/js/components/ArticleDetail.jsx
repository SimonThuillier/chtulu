import React from "react";
import {getOneByIdSelector} from "../reducers";
import { connect } from 'react-redux'
import ArticleDetailMinimal from './ArticleDetailMinimal';
import ArticleDetailAbstract from './ArticleDetailAbstract';
import ArticleDetailImage from './ArticleDetailImage';
import GroupUtil from '../util/GroupUtil';

const ArticleDetail = function(props){
    const data = props.selector(props.id);
    if (!data) return null;


    const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups);

    return (
        <div>
            <div className="row">
                {availableGroups.hasOwnProperty("minimal") &&
                <ArticleDetailMinimal type={data.type} beginHDate={data.beginHDate} endHDate={data.endHDate}/>
                }
                {availableGroups.hasOwnProperty("detailImageResource") &&
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
        </div>
    );
}

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.article);
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleDetail);