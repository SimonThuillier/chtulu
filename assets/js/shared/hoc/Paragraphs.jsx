import React from 'react';

const Paragraphs = (text,initial=[],keyPrefix='default') =>{
    let index = 0;

    const newParagraphs =  (text || "").
    replace("\r\n","\n").
    replace("\r","\n").
    replace("\n\n","\n").
    replace("\n\n","\n").
    split("\n").
    map((line) =>{
        if (line.trim().length === 0 || line.trim()==="\n") return null;
        index = index+1;
        return(
            <p key={`keyPrefix-${index}`}>
                &nbsp;&nbsp;&nbsp;{line}
            </p>
        );
    });
    return initial.concat(newParagraphs);
};

export default Paragraphs;