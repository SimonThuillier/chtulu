import React from "react";
import {getOneByIdSelector } from "../../shared/selectors";
import { connect } from 'react-redux'
import RVImageMini from "./RVImageMini"

const RImageMini = function(props){
    const resource = props.selector(props.id);

    const mode= props.mode||'regular'; // can be regular, svg,url ...

    const value = resource && resource.activeVersion;
    return <RVImageMini id={value} deltaX={props.deltaX} mode={mode}/>;
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resource"))
    }
};

export default connect(mapStateToProps)(RImageMini);