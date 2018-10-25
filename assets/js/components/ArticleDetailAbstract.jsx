import React from "react";

export default function ArticleDetailAbstract(props){
    const abstract = props.abstract || "";
    let key=0;
    const paragraphs =  abstract.split("\r\n").map((line) =>{
        if (line.length === 0) return null;
        key = key+1;
        return(
            <p key={key}>
                &nbsp;&nbsp;&nbsp;{line}
            </p>
        );
    });
    return(
        <div className="col-md-12">
            <div className="container-fluid">
                {paragraphs}
            </div>
        </div>
    )
}