import React from "react";
import RImageDetail from './RImageDetail';

export default function ArticleDetailImage(props){
    return(
        <div className="col-md-6">
            <div className="container-fluid">
                <RImageDetail id={props.detailImageResource}/>
            </div>
        </div>
    )
}
