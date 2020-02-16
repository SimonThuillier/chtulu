import React from "react";
import {AVAILABLE_AREAS} from '../../util/explorerUtil';
import Article from "./Article.jsx";
import ArticleDetail from "./ArticleDetail.jsx";

const scrollElement = (targetElement,areaElement) => {
    if(!targetElement || !areaElement) return;

    const areaCoords = areaElement.getBoundingClientRect();
    const currentScroll = areaElement.scrollTop;
    const targetCoords = targetElement.getBoundingClientRect();
    console.log(areaCoords.top,currentScroll,targetCoords.top );
    areaElement.scrollTo(0,currentScroll + ((targetCoords.top-areaCoords.height/2)-areaCoords.top)-3);
    console.log(areaElement.scrollTop);
};

class HBExplorerArticleCard extends React.Component {
    constructor(props) {
        super(props);

        this.setMarker = this.setMarker.bind(this);

        this.state = {};
    }

    setMarker(event){
        if(event.hbOrigin ===AVAILABLE_AREAS.CONTENT) return;

        const {iconId} = event;
        //console.log('set read index=',iconId);

        const contentIcon = document.getElementById(iconId);
        if(!contentIcon) return;

        const scrollArea = document.getElementById('article-content-panel-body');

        contentIcon.classList.add("activated");
        setTimeout(()=>{
            contentIcon.classList.remove("activated");
        },520);

        scrollElement(contentIcon,scrollArea);
    }


    componentDidUpdate(prevProps){
        if(prevProps.displayParameters.activeComponent==='form' &&
            prevProps.displayParameters.activeComponent!==this.props.displayParameters.activeComponent
        ){
            const event = new CustomEvent('hb.article.leave.form');
            event.articleId = prevProps.id;
            window.dispatchEvent(event);
        }
    }

    componentDidMount(){
        window.addEventListener('hb.explorer.set.marker',this.setMarker);
    }

    componentWillUnmount(){
        window.removeEventListener('hb.explorer.set.marker',this.setMarker);
    }


    render() {
        const {dispatch,id,article,displayParameters,
            setActiveComponent} = this.props;

        const {activeComponent} = displayParameters;

        const alreadyCreatedArticle = +id > 0;
        const headerStyle = {backgroundColor:"#F3E3F6"};

        let allowedEdit = false;
        let allowedAdmin = false;

        if(!!article && !!article.authorizationBag && article.authorizationBag.EDIT.allowed){
            allowedEdit = true;
        }
        if(!!article && !!article.authorizationBag && article.authorizationBag.ADMIN.allowed){
            allowedAdmin = true;
        }

        return (
            <div className="panel panel-default hg-content-panel">
                <div
                    className="panel-body"
                    id={'article-content-panel-body'}
                >
                    <Article
                        dispatch={dispatch}
                        id={id}
                        onNothing={null}
                        groups={{
                            minimal:true,
                            date:true,
                            area:true,
                            detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true,urlDetailThumbnail:true}},
                            abstract:true,
                            owner:{minimal:true}
                        }}
                    >
                        {/*{activeComponent==='detail'?*/}
                            {/*(<Article.Detail/>):*/}
                            {/*activeComponent==='form'?*/}
                                {/*(<Article.Form/>):*/}
                                {/*activeComponent==='admin'?*/}
                                    {/*(<Article.Admin/>):null*/}
                        {/*}*/}
                        <div hidden={activeComponent!=='detail'}>
                        <Article.Detail>
                            <ArticleDetail.Abstract/>
                        </Article.Detail>
                        </div>
                        {allowedEdit?<div hidden={activeComponent!=='form'}>
                        <Article.Form/>
                        </div>:null}
                        {allowedAdmin?<div hidden={activeComponent!=='admin'}>
                        <Article.Admin/>
                        </div>:null}
                    </Article>
                    <div style={{minHeight:'30px'}}/>
                </div>
                <div className="panel-footer hg-content-panel-footer">

                </div>
            </div>

        );
    }
}

/*const makeMapStateToProps = () => {
    const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};*/

export default HBExplorerArticleCard;
