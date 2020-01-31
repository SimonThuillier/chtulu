import React from "react";
import GroupUtil from '../../util/GroupUtil';
import RImageDetail from '../../shared/atoms/RImageDetail';
import UserIconLink from '../../shared/molecules/UserIconLink';
import {getDecoratedAbstractForDetail,AVAILABLE_AREAS} from '../../util/explorerUtil';
import DateUtil from "../../util/date";
const dateFormatter = DateUtil.getFormatterFromPattern('d/m/Y H:i');

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
        const {data} = this.props;
        this.ref.current.innerHTML = getDecoratedAbstractForDetail(data.abstract);
        this._addEventListeners();
    }

    _addEventListeners(){

        const markers = document.querySelectorAll("#article-detail-div .hb-richtext-marker");
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

        const jQmarkers=$("#article-detail-div .hb-richtext-marker");
        jQmarkers.tooltip();
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.data !== this.props.data){
            this.ref.current.innerHTML = getDecoratedAbstractForDetail(this.props.data.abstract);
            this._addEventListeners();
        }
    }

    render()
    {
        return (
                <div
                    id={"article-detail-div"}
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


const SubUser = ({data}) =>{
    return(<div>
            <UserIconLink id={data.ownerUser}/>
        </div>
    );
};

const SubFullSummary = ({data}) =>{

    const style = {
        float:'left',
        clear:'left',
        marginBottom:'3px'
    };

    return(
        <div >
            <div style={{display:'flex',flexDirection:'column',alignContent:'space-between'}}>
                <div style={{display:'inline-flex',justifyContent:'space-between'}}>
                    <div style={style}>{data.summary}</div>
                    <SubDetailImage data={data}/>
                </div>
                <div>
                    <i>Derniere edition le {dateFormatter(data.editionDate)} par <SubUser data={data}/></i>
                </div>
            </div>
        </div>
    );
};


const SubDetailImage = ({data}) =>{
    if(!data.detailImageResource) return null;
    const style = {
        float:'right',
        clear:'right',
        marginLeft:'5px',
        marginBottom:'3px',
    };

    return (
        <div style={style}>
            <RImageDetail id={data.detailImageResource}/>
        </div>
    );
};

/**
 * in React if no children undefined, if one children this children object, if several an array of them
 * this helper returns always an array to ensure compatibility with further operations
 */
const getChildrenAsArray = (children)=>{
    if(!children) return [];
    else if(!Array.isArray(children)) return [children];
    else return children;
};



export default class ArticleDetail extends React.Component{
    static User = SubUser;
    static DetailImage = SubDetailImage;
    static Abstract = SubAbstract;
    static FullSummary = SubFullSummary;

    constructor(props) {
        super(props);
        //this.context = React.createContext({});
    }

    render(){
        const {data,id,linksData,children} = this.props;
        if (!data) return null;

        const childrenWithData = getChildrenAsArray(children).map((c)=>{
            return React.cloneElement(c,{data:data});
        });


        console.log('children',children);


        return (
            <div>
                {childrenWithData}
                {/*{this.props.children}*/}
                {/*{(!!abstract || !!detailImage) &&*/}
                {/*<div className="row">*/}
                {/*<SubAbstract abstract={data.abstract} linksData={linksData}>*/}
                {/*{!!detailImage &&*/}
                {/*<SubDetailImage detailImageResource={data.detailImageResource}/>*/}
                {/*}*/}
                {/*</SubAbstract>*/}
                {/*</div>*/}
                {/*}*/}
            </div>
        );
    }
}