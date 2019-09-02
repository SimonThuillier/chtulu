import React from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux';
import {URL_DEFAULT_IMAGE_MINI} from '../../util/server';

const RVImageMini = function(props){
    const version = props.id?props.getOneVersionById(props.id):null;

    const mode= props.mode||'regular'; // can be regular, svg,url ...
    // if true will use the default url if version is null
    const useDefault = props.useDefault || false;

    const value = version && version.urlMini;

    switch(mode){
        case 'svg':
            return value?(<image x={props.deltaX || 0} y='0' href={value}/>):
                (<image x={props.deltaX || 0} y="0" href={URL_DEFAULT_IMAGE_MINI}></image>);
            break;
        case 'url':
            return value?`${value}`:URL_DEFAULT_IMAGE_MINI;
            break ;
        default:
            return value?(<img src={value} className="img-circle"/>):
                (useDefault?(<img src={URL_DEFAULT_IMAGE_MINI} className="img-circle"/>):null);
            break;
    }
};

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getOneVersionById: getOneByIdSelector(state.get("resourceVersion"))
        }
    }
};

export default connect(makeMapStateToProps)(RVImageMini);