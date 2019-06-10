import React from "react";
import GroupUtil from '../util/GroupUtil';
import RImageDetail from './RImageDetail';

const SubAbstract = ({abstract,children})=>{
    let key=0;
    const paragraphs =  (abstract || "").
    replace("\r\n","\n").
    replace("\r","\n").
    replace("\n\n","\n").
    replace("\n\n","\n").
    split("\n").
    map((line) =>{
        if (line.trim().length === 0 || line.trim()==="\n") return null;
        key = key+1;
        return(
            <p key={key}>
                &nbsp;&nbsp;&nbsp;{line}
            </p>
        );
    });
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
    const {data,id} = props;
    if (!data) return null;

    //console.log(`articleDetail render ${id}`);

    const availableGroups = GroupUtil.intersect('article',props.groups,data.loadedGroups||{});
    const {minimal,detailImage,abstract} = availableGroups;
    const context = props.context || 'main';

    return (
        <div>
            {(!!abstract || !!detailImage) &&
            <div className="row">
                <SubAbstract abstract={data.abstract}>
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