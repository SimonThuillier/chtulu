import React from "react";
import GroupUtil from '../util/GroupUtil';
import RImageDetail from './RImageDetail';
import {
    Well
} from 'react-bootstrap';

const makeParagraphs = (text,initial=[],keyPrefix='default') =>{
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

const SubAbstract = ({abstract,linksData,children})=>{
    let key=0;
    console.log('subAbstract');
    console.log(linksData);

    let linksDescription = [];

    if(typeof(linksData) !== 'undefined' && linksData !== null && linksData.length>0){
        linksDescription = linksData
            .filter((link) =>{
                return (typeof(link.abstract) !== 'undefined' && link.abstract !== null && link.abstract!=='');
            })
            .map((link) =>{
            return(
                <Well bsSize="small" style={{padding:'4px'}}>
                    <p key={`which-context`}>Par rapport à <strong>{link.parentTitle}</strong> : </p>
                    {makeParagraphs(link.abstract)}
                </Well>
            );
        });
    }

    const paragraphs =  makeParagraphs(abstract,linksDescription);
    return(
        <div className="col-md-12">
            {children}
            {paragraphs}
        </div>
    )
};



const SubDetailImage = ({detailImageResource}) =>{
    if(!detailImageResource) return null;
    const style = {
        float:'right',
        clear:'right',
        marginLeft:'5px',
        marginBottom:'3px'
    };

    return (
        <div style={style}>
            <RImageDetail id={detailImageResource}/>
        </div>
    );
};

const ArticleDetail = function(props){
    const {data,id,linksData} = props;
    if (!data) return null;

    //console.log(`articleDetail render ${id}`);

    const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups||{});
    const {minimal,detailImage,abstract} = availableGroups;
    const context = props.context || 'main';

    return (
        <div>
            {(!!abstract || !!detailImage) &&
            <div className="row">
                <SubAbstract abstract={data.abstract} linksData={linksData}>
                    {!!detailImage &&
                    <SubDetailImage detailImageResource={data.detailImageResource}/>
                    }
                </SubAbstract>
            </div>
            }
        </div>
    );
};


export default ArticleDetail;