import React from "react";

import {makeGetOneByIdSelector} from "../../shared/selectors";
import {connect} from "react-redux";

const style= {
    overflow: 'hidden',
    boxSizing: 'border-box',
    maxWidth: '100%',
    height: '1em',
    lineHeight: '1em',
    whiteSpace: 'nowrap',
};

const ArticleTitle = (props) => {

    const {id,getOneByIdSelector} = props;
    const article = getOneByIdSelector(+id);

    if(typeof article === 'undefined' || !article)return (
        <span>Chargement ...</span>
    );

    let paragraphs = [];

    paragraphs.push(<span>{(article && article.title) || "Nouvel article"}</span>);

    let dateLabel = null;
    if(article.beginHDate && article.endHDate && article.beginHDate.equals(article.endHDate)){
        dateLabel = ` (${article.beginHDate.getLabel()})`;
    }
    else if(article.beginHDate){
        dateLabel = ` (${article.beginHDate.getLabel()} - ${article.endHDate?article.endHDate.getLabel():""})`;
    }

    if(dateLabel !==null){paragraphs.push(<span style={{fontSize:'small',textOverflow: 'ellipsis'}}>{dateLabel}</span>);}

    return <span style={style}>{paragraphs}</span>
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        const dataSubState = state.get("article");
        return {
            getOneByIdSelector: getOneByIdSelector(dataSubState)
        }
    }
};

/*const mapStateToProps = state => {
    const selector = getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};*/

export default connect(makeMapStateToProps)(ArticleTitle);

