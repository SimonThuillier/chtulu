import React,{ Component } from "react";
import {getOneByIdSelectors } from "../reducers";
import { connect } from 'react-redux'

const ArticleType = function(props){
    const type = props.selector(props.id);

    return(type.get("label"));
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelectors["articleType"](state)
    }
};

export default connect(mapStateToProps)(ArticleType);