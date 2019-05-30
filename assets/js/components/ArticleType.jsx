import React from "react";
import {getOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'

const ArticleType = function(props){
    let {id=null,articleId=null,articleSelector,articleTypeSelector} = props;

    if(id ===null){
        id = articleSelector(articleId).type;
    }

    const type = articleTypeSelector(id);
    return( <p>{type?type.get("label"):null}</p>);
};

const mapStateToProps = (state) => {
    const articleSelector = getOneByIdSelector(state.get("article"));
    const articleTypeSelector = getOneByIdSelector(state.get("articleType"));
    return {
        articleSelector:articleSelector,
        articleTypeSelector: articleTypeSelector
    }
};

export default connect(mapStateToProps)(ArticleType);