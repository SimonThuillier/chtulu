import React from "react";
import GroupUtil from '../../util/GroupUtil';
import RImageDetail from '../../shared/atoms/RImageDetail';
import {
    Well
} from 'react-bootstrap';
import Paragraphs from '../../shared/hoc/Paragraphs';

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
                    {Paragraphs(link.abstract)}
                </Well>
            );
        });
    }

    const paragraphs =  Paragraphs(abstract,linksDescription);
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