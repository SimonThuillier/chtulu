import React from "react";
import {getOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'

const ArticleType = function(props){
    let {id=null,articleId=null,articleSelector,articleTypeSelector} = props;

    if(id ===null){
        const article = articleSelector(articleId);
        if(typeof article ==='undefined' || !article) return null;
        id = article.type;
    }

    const type = articleTypeSelector(id);
    if(typeof type ==='undefined' || !type) return null;

    return( <span>{type?type.get("label"):null}</span>);
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