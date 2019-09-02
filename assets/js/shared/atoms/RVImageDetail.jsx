import React from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux'
import {Image} from 'react-bootstrap';
import {URL_DEFAULT_IMAGE_DETAIL} from "../../util/server";

const RVImageDetail = function(props){
    const version = props.id?props.getOneVersionById(props.id):null;

    // if true will use the default url if version is null
    const useDefault = props.useDefault || false;

    const value = version && version.urlDetailThumbnail;
    return (value?<Image src={value} rounded />:
        (useDefault?(<Image src={URL_DEFAULT_IMAGE_DETAIL} rounded />):null));
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getOneVersionById: getOneByIdSelector(state.get("resourceVersion"))
        }
    }
};

export default connect(makeMapStateToProps)(RVImageDetail);