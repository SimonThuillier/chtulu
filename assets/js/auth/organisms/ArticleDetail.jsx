import React from "react";
import GroupUtil from '../../util/GroupUtil';
import RImageDetail from '../../shared/atoms/RImageDetail';
import UserIconLink from '../../shared/molecules/UserIconLink';
import {getDecoratedAbstractForDetail,AVAILABLE_AREAS} from '../../util/explorerUtil';

class SubAbstract extends React.Component
{
    constructor(props)
    {
        super(props);
        this._addEventListeners=this._addEventListeners.bind(this);
        this.ref = React.createRef();
    }

    componentDidMount()
    {
        const {abstract,linksData,children} = this.props;
        this.ref.current.innerHTML = getDecoratedAbstractForDetail(abstract);
        this._addEventListeners();
    }

    _addEventListeners(){

        const markers = document.querySelectorAll(".hb-richtext-marker");
        //console.log("article abstract markers addingEventListeners",markers);
        markers.forEach((element)=>{
            element.addEventListener('click',(event)=>{
                //console.log("article abstract markers=",element,event,element.id);
                const markerEvent = new CustomEvent('hb.explorer.set.marker');
                markerEvent.iconId = element.id;
                markerEvent.hbOrigin = AVAILABLE_AREAS.CONTENT;
                window.dispatchEvent(markerEvent);
            });
        });
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.abstract !== this.props.abstract){
            this.ref.current.innerHTML = this.props.abstract;
            this._addEventListeners();
        }
    }

    render()
    {
        return (
            <div
                ref={this.ref}
                className="col-md-12 hb-content"
                onDoubleClick={()=>{
                    console.log('hbexplorer dbl click');
                    const event = new CustomEvent('hb.explorer.magnify');
                    event.hbOrigin = AVAILABLE_AREAS.CONTENT;
                    window.dispatchEvent(event);
                }
                }
            >
            </div>
        );
    }
}



//
// const SubAbstract = ({abstract,linksData,children})=>{
//     let key=0;
//     console.log('subAbstract');
//     console.log(linksData);
//
//     let linksDescription = [];
//
//     if(typeof(linksData) !== 'undefined' && linksData !== null && linksData.length>0){
//         linksDescription = linksData
//             .filter((link) =>{
//                 return (typeof(link.abstract) !== 'undefined' && link.abstract !== null && link.abstract!=='');
//             })
//             .map((link) =>{
//             return(
//                 <Well bsSize="small" style={{padding:'4px'}}>
//                     <p key={`which-context`}>Par rapport à <strong>{link.parentTitle}</strong> : </p>
//                     {Paragraphs(link.abstract)}
//                 </Well>
//             );
//         });
//     }
//
//     console.log(abstract);
//
//     return (
//         <div className="col-md-12">
//             {abstract}
//         </div>
//     );
//
//     /*const paragraphs =  Paragraphs(abstract,linksDescription);
//     return(
//         <div className="col-md-12">
//             {children}
//             {paragraphs}
//         </div>
//     )*/
// };

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
            <div className="hb-flex-center">
                <UserIconLink id={data.ownerUser}/>
            </div>
        </div>
    );
};


export default ArticleDetail;