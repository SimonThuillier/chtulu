import React from "react";
import {getOneByIdSelector} from "../reducers";
import { connect } from 'react-redux'

const ArticleType = function(props){
    const type = props.selector(props.id);
    console.log(`retrieved type for ${props.id}`);
    console.log(type);

    const value = type & type.get("label");
    return( value?value:null);
};

const mapStateToProps = (state) => {
    console.log("ArticleType map state to props");
    console.log(state);
    console.log(state.articleType.items.get(1).get("label"));
    return {
        selector: getOneByIdSelector(state.articleType)
    }
};

export default connect(mapStateToProps)(ArticleType);