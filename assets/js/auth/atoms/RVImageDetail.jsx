import React from "react";
import {getOneByIdSelector } from "../../shared/selectors";
import { connect } from 'react-redux'
import {Image} from 'react-bootstrap';

const RVImageDetail = function(props){
    const version = props.selector(props.id);

    const value = version && version.urlDetailThumbnail;
    return (value?<Image src={value} rounded />:null);
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resourceVersion"))
    }
};

export default connect(mapStateToProps)(RVImageDetail);