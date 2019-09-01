import React from "react";
import {getOneByIdSelector } from "../../shared/selectors";
import { connect } from 'react-redux'

const RVImageMini = function(props){
    const version = props.selector(props.id);

    const mode= props.mode||'regular'; // can be regular, svg,url ...

    const value = version && version.urlMini;

    switch(mode){
        case 'svg':
            return value?(<image x={props.deltaX || 0} y='0' href={value}/>):
                (<image x={props.deltaX || 0} y="0" href='http://localhost:8000/media/personnage.jpeg'></image>);
            break;
        case 'url':
            return value?`${value}`:'http://localhost:8000/media/personnage.jpeg';
            break ;
        default:
            return value?(<img src={value} className="img-circle"/>):null;
            break;
    }
};

const mapStateToProps = (state) => {
    return {
        selector: getOneByIdSelector(state.get("resourceVersion"))
    }
};

export default connect(mapStateToProps)(RVImageMini);