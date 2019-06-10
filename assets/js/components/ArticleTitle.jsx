import React from "react";

import {
    getOneByIdSelector
} from "../selectors";
import {connect} from "react-redux";

const ArticleTitle = (props) => {

    const {id,selector} = props;
    const article = selector(+id);

    if(typeof article === 'undefined' || !article)return (
        <p>Chargement ...</p>
    );


    let value = (article && article.title) || "Nouvel article";

    if(article.beginHDate && article.endHDate && article.beginHDate.equals(article.endHDate)){
        value = `${value} (${article.beginHDate.getLabel()})`;
    }
    else if(article.beginHDate){
        value = `${value} (${article.beginHDate.getLabel()} - ${article.endHDate?article.endHDate.getLabel():""})`;
    }

    return (
        <span>{value}</span>
    );
};

const mapStateToProps = state => {
    const selector = getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleTitle);

