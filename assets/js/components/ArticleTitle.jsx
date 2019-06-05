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

    if(article.beginHDate){
        value = `${value} (${article.beginHDate.getLabel()} - ${article.endHDate?article.endHDate.getLabel():""})`;
    }

    return (
        <p>{value}</p>
    );
};

const mapStateToProps = state => {
    const selector = getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleTitle);

