import React from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'

const ArticleType = function(props){
    let {id=null,articleId=null,getOneArticleById,getOneArticleTypeById} = props;

    if(id ===null){
        const article = getOneArticleById(articleId);
        if(typeof article ==='undefined' || !article) return null;
        id = article.type;
    }

    const type = getOneArticleTypeById(id);
    if(typeof type ==='undefined' || !type) return null;

    return( <span>{type?type.get("label"):null}</span>);
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneArticleById: getOneByIdSelector(state.get("article")),
            getOneArticleTypeById: getOneByIdSelector(state.get("articleType"))
        }
    }
};

/*const mapStateToProps = (state) => {
    const articleSelector = getOneByIdSelector(state.get("article"));
    const articleTypeSelector = getOneByIdSelector(state.get("articleType"));
    return {
        articleSelector:articleSelector,
        articleTypeSelector: articleTypeSelector
    }
};*/

export default connect(makeMapStateToProps)(ArticleType);