import React from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'
import RVImageDetail from "./RVImageDetail"

const RImageDetail = function(props){
    const resource = props.id?props.getOneResourceById(props.id):null;

    const value = resource && resource.activeVersion;
    return <RVImageDetail id={value} useDefault={props.useDefault||false}/>;
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getOneResourceById: getOneByIdSelector(state.get("resource"))
        }
    }
};

export default connect(makeMapStateToProps)(RImageDetail);