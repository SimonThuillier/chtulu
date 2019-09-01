import React from "react";
import {makeGetOneByIdSelector} from "../../shared/selectors";
import { connect } from 'react-redux'
import { Button, Glyphicon } from "react-bootstrap";

const ArticleExpander = function(props){
    let {id=null,getOneArticleById,expanded=false,onClick} = props;
    if(id===null) return null;
    const article = getOneArticleById(id);
    if(article===null) return null;
    if(+article.get('firstRankLinksCount') === 0) return null; // no children => nothing to expand !

    return (
        <Button
            bsStyle="default"
            disabled={false}
            onClick={onClick}
        >
            <Glyphicon glyph={expanded?'folder-close':'folder-open'}/>
            &nbsp;({+article.get('firstRankLinksCount')})
        </Button>);
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneArticleById: getOneByIdSelector(state.get("article")),
        }
    }
};

export default connect(makeMapStateToProps)(ArticleExpander);