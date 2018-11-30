import React from "react";
import ArticleType from './ArticleType';

export default function ArticleDetailMinimal(props){
    return(
        <div className="col-md-6">
            <div className="container-fluid">
                <div className="row">
                    <h5>Type : {props.type ? <ArticleType id={props.type}/> : ''}</h5>
                    <h5>Date de début : {props.beginHDate ? props.beginHDate.getLabel() : ''}</h5>
                    <h5>Date de fin : {props.endHDate ? props.endHDate.getLabel() : ''}</h5>
                    {/*<h5>A une fin ? : {props.hasEndDate ? 'Oui' : 'Non'}</h5>*/}
                </div>
            </div>
        </div>
    )
}