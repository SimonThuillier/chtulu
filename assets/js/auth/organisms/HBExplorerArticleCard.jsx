import React from "react";

import { Button,
    Glyphicon,
    OverlayTrigger,
    Tooltip, } from "react-bootstrap";
import ArticleExpander from '../atoms/ArticleExpander';
import TimeBreadcrumb from '../atoms/TimeBreadcrumb';
import {getNeighbourArticleChronogically} from '../../util/explorerUtil';

import ArticleTitle from "../atoms/ArticleTitle";
import ArticleType from "../atoms/ArticleType";
import Article from "./Article.jsx";
import { Link } from "react-router-dom";
import {makeLocalGetByAttributeSelector} from "../../shared/selectors";
import {connect} from "react-redux";

class HBExplorerArticleCard extends React.Component {
    constructor(props) {
        super(props);

        this.setMarker = this.setMarker.bind(this);

        this.state = {
            askedNewLink:false
        };
    }

    setMarker(event){

        const {iconId} = event;

        //console.log('set read index=',iconId);

        const icon = document.getElementById(iconId);
        if(!icon) return;



        const scrollArea = document.getElementById('hb-test-scroll');

        const scrollAreaCoords = scrollArea.getBoundingClientRect();
        const currentScroll = scrollArea.scrollTop;
        const iconCoords = icon.getBoundingClientRect();
        console.log(scrollAreaCoords.top,currentScroll,iconCoords.top );
        scrollArea.scrollTo(0,currentScroll + (iconCoords.top-scrollAreaCoords.top)-3);
        console.log(scrollArea.scrollTop);
    }

    componentDidMount(){
        window.addEventListener('hb.reader.set.marker',this.setMarker);
    }

    componentWillUnmount(){
        window.removeEventListener('hb.reader.set.marker',this.setMarker);
    }


    render() {
        const {dispatch,id,mainArticleId,articles,displayParameters,
            setHoveredArticle,toggleActiveComponent,closeArticle,
            selectArticle,expandArticle,linkArticle,
            getLinks} = this.props;

        const {askedNewLink} = this.state;

        const alreadyCreatedArticle = +id > 0;
        const nextArticle = getNeighbourArticleChronogically(articles,id,1);
        const previousArticle = getNeighbourArticleChronogically(articles,id,-1);
        const isArticleMain = (+id === mainArticleId);
        const headerStyle = isArticleMain?{backgroundColor:"#F3E3F6"}:{};

        let isLinked = null;
        if(mainArticleId !== null && !isArticleMain){
            const links = getLinks('childId',id);
            const currentLink = links.find((link)=>{return +link.get('parentId') === +mainArticleId  && link.get('toDelete')===false});
            if(typeof currentLink !== 'undefined'){
                isLinked=true;
                if(askedNewLink){this.setState({askedNewLink:false});}
            }
            else{
                isLinked=false;
            }
        }

        console.log('render card');
        return (
            <div className="panel panel-default hg-content-panel"
                 onMouseOver={()=>{setHoveredArticle(+id);}}
            >

                <div className="hg-content-panel-heading" style={headerStyle}>
                    <span><h4><ArticleType articleId={id}/></h4></span>
                    {alreadyCreatedArticle?
                        <Link
                            to={`/article/${id}/${displayParameters.activeComponent==='form'?'edit':''}`}
                            className={'btn btn-link'}
                            title={"Page principale de l'article"}
                            style={{paddingBottom:0}}
                        >
                            <h4><ArticleTitle id={id}/></h4>
                        </Link>
                        :
                        <span><h4><ArticleTitle id={id}/></h4></span>}
                    <span>
                            <ArticleExpander id={id} expanded={displayParameters.isExpanded} onClick={()=>{expandArticle(id)}}/>
                            <TimeBreadcrumb sense={-1} target={previousArticle} switcher={(id)=>{return selectArticle([id]);}}/>
                            <TimeBreadcrumb sense={1} target={nextArticle} switcher={(id)=>{return selectArticle([id]);}}/>
                        <Button bsStyle="primary"
                                disabled={false}
                                onClick={()=>{toggleActiveComponent([id])}}>
                               <Glyphicon glyph={displayParameters.activeComponent==='detail'?'edit':'eye-open'}/>
                            </Button>

                        {isLinked !==null && <span>
                            <OverlayTrigger
                                placement={'bottom'}
                                overlay={
                                    <Tooltip id={`${isLinked?'unlink':'link'}-${id}-to-${mainArticleId}-message`}>
                                        {isLinked?'delier cet article':'lier cet article'}
                                    </Tooltip>
                                }>
                                <Button
                                    id={`unlink-${id}-to-${mainArticleId}`}
                                    bsStyle={isLinked?'warning':'info'}
                                    disabled={askedNewLink}
                                    onClick={()=>{
                                        linkArticle(+id,!isLinked);
                                        if(!isLinked) this.setState({askedNewLink:true});
                                    }}
                                >
                                <Glyphicon glyph={isLinked?'resize-full':'resize-small'}/>
                            </Button>
                                </OverlayTrigger>
                            &nbsp;&nbsp;
                            </span>}
                            <Button bsStyle="default"
                                    disabled={false}
                                    onClick={()=>{closeArticle([id])}}>
                               <Glyphicon glyph={'remove'}/>
                            </Button>
                        </span>
                </div>

                <div id='hb-test-scroll' className="panel-body" style={{overflow:'auto'}}>
                    <Article
                        dispatch={dispatch}
                        id={id}
                        handleSwitch={()=>{toggleActiveComponent([id]);}}
                        onNothing={null}
                        groups={{"minimal":true,"date":true,"detailImage":{activeVersion:{urlMini:true}},"abstract":true}}
                    >
                        <div hidden={displayParameters.activeComponent!=='detail'}>
                            <Article.Detail/>
                        </div>
                        <div hidden={displayParameters.activeComponent!=='form'}>
                            <Article.Form/>
                        </div>
                    </Article>
                    <div style={{minHeight:'30px'}}/>
                </div>
                <div className="panel-footer hg-content-panel-footer">

                </div>
            </div>

        );
    }
}

const makeMapStateToProps = () => {
    const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};

export default connect(makeMapStateToProps)(HBExplorerArticleCard);
