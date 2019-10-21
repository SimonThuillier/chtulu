import React from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'
import RVImageMini from "./RVImageMini"

const RImageMini = function(props){
    const resource = props.id?props.getOneResourceById(props.id):null;

    const mode= props.mode||'regular'; // can be regular, svg,url ...

    const value = resource && resource.activeVersion;
    return <RVImageMini
        id={value}
        className={props.className||null}
        deltaX={props.deltaX}
        mode={mode}
        useDefault={props.useDefault||false}
    />;
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getOneResourceById: getOneByIdSelector(state.get("resource"))
        }
    }
};

export default connect(makeMapStateToProps)(RImageMini);