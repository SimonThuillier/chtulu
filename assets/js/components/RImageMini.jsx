import React from "react";
import {getOneByIdSelector } from "../reducers";
import { connect } from 'react-redux'
import RVImageMini from "./RVImageMini"

const RImageMini = function(props){
    const resource = props.selector(props.id);

    const value = resource && resource.activeVersion;
    return (value?<RVImageMini id={value}/>:null);
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resource"))
    }
};

export default connect(mapStateToProps)(RImageMini);