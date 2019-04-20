import React from "react";
import {getOneByIdSelector } from "../selectors";
import { connect } from 'react-redux'

const RVImageMini = function(props){
    const version = props.selector(props.id);

    const value = version && version.urlMini;
    return (value?<img src={value} className="img-circle"/>:null);
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resourceVersion"))
    }
};

export default connect(mapStateToProps)(RVImageMini);