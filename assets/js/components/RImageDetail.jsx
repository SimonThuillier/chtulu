import React from "react";
import {getOneByIdSelector } from "../reducers";
import { connect } from 'react-redux'
import RVImageDetail from "./RVImageDetail"

const RImageDetail = function(props){
    const resource = props.selector(props.id);

    const value = resource && resource.activeVersion;
    return (value?<RVImageDetail id={value}/>:null);
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resource"))
    }
};

export default connect(mapStateToProps)(RImageDetail);