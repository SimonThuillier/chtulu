import React,{ Component } from "react";
import {getOneByIdSelectors,getOneByIdSelector2 } from "../reducers";
import { connect } from 'react-redux'

const ArticleType = function(props){
    const type = props.selector(props.id);
    console.log(`retrieved type for ${props.id}`);
    console.log(type);

    return( type?type.get("label"):null);
};

const mapStateToProps = (state) => {
    console.log("ArticleType map state to props");
    console.log(state);
    console.log(state.articleType.items.get(1).get("label"));
    return {
        //selector: getOneByIdSelectors["articleType"](state)
        selector: getOneByIdSelector2(state.articleType)
    }
};

export default connect(mapStateToProps)(ArticleType);