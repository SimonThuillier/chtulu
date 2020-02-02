import React from "react";
import {makeGetOneByIdSelector} from "../../shared/selectors";
import { connect } from 'react-redux'

const ArticleStatus = function(props){
    let {id=null,articleId=null,getOneArticleById,getOneArticleStatusById} = props;

    if(id ===null){
        const article = getOneArticleById(articleId);
        if(typeof article ==='undefined' || !article) return null;
        id = article.status;
    }

    const status = getOneArticleStatusById(id);
    if(typeof status ==='undefined' || !status) return null;

    return( <span>{status?status.get("label"):null}</span>);
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneArticleById: getOneByIdSelector(state.get("article")),
            getOneArticleStatusById: getOneByIdSelector(state.get("articleStatus"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleStatus);