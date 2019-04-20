import React from "react";
import {getOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'

const ArticleType = function(props){
    const type = props.selector(props.id);
    return( type?type.get("label"):null);
};

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("articleType"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleType);