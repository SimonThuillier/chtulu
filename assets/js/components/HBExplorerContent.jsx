import React from "react";

import { Button, Glyphicon } from "react-bootstrap";


import HBExplorerContentHistory from "./HBExplorerContentHistory.jsx";

import ArticleTitle from "./ArticleTitle";
import ArticleType from "./ArticleType";
import Article from "./Article.jsx";
import { Link } from "react-router-dom";



import {AVAILABLE_THEMES} from "../util/explorerUtil";
import {getInlinedCss} from "../util/cssUtil";
import styled from "styled-components";


const Container = styled.div`
  ${getInlinedCss({
    overflow:"hidden",
    padding: "0px",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row"
})}
`;


class HBExplorerContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {dispatch,displayedArticles,toggleActiveComponent,closeArticle,selectArticle,theme} = this.props;


        const articlesToDisplay = Array.from(displayedArticles).
        filter(([id,value])=>{
            return value.isOpen;
        }).
        sort((a,b)=>{
            const aSelectionDate = a[1].selectionDate;
            const bSelectionDate = b[1].selectionDate;
            return (aSelectionDate.getTime() - bSelectionDate.getTime());
        });

        // console.log(articlesToDisplay);

        const articlePanels = articlesToDisplay.map(([id,value])=>{
            //console.log(value.activeComponent);
            const alreadyCreatedArticle = +id > 0;
            return (
                <div className="panel panel-default hg-content-panel"
                     key={`hg-container-article-panel-${id}`}
                     id={`hg-container-article-panel-${id}`}
                >

                    <div className="hg-content-panel-heading">
                        <span><h4><ArticleType articleId={id}/></h4></span>
                        {alreadyCreatedArticle?
                            <Link
                                to={`/article/${id}/${value.activeComponent==='form'?'edit':''}`}
                                className={'btn btn-link'}
                                title={"Page principale de l'article"}
                                style={{paddingBottom:0}}
                            >
                                <h4><ArticleTitle id={id}/></h4>
                            </Link>
                            :
                            <span><h4><ArticleTitle id={id}/></h4></span>}
                        <span>
                            <Button bsStyle="primary"
                                    disabled={false}
                                    onClick={()=>{toggleActiveComponent([id])}}>
                               <Glyphicon glyph={value.activeComponent==='detail'?'edit':'eye-open'}/>
                            </Button>
                            <Button bsStyle="default"
                                    disabled={false}
                                    onClick={()=>{closeArticle([id])}}>
                               <Glyphicon glyph={'remove'}/>
                            </Button>
                        </span>
                    </div>

                    <div className="panel-body" style={{overflow:'auto'}}>
                        <Article
                            dispatch={dispatch}
                            id={id}
                            handleSwitch={()=>{toggleActiveComponent([id]);}}
                            onNothing={null}
                            groups={{"minimal":true,"date":true,"detailImage":true,"abstract":true}}
                        >
                            <div hidden={value.activeComponent!=='detail'}>
                                <Article.Detail/>
                            </div>
                            <div hidden={value.activeComponent!=='form'}>
                                <Article.Form/>
                            </div>
                        </Article>
                        <div style={{minHeight:'30px'}}/>
                    </div>
                    <div className="panel-footer hg-content-panel-footer">

                    </div>
                </div>

            );
        });

        return (
            <Container>
                <div
                    hidden={theme===AVAILABLE_THEMES.SIDEVIEW}
                    className="hg-content-panel"
                    key={`hg-container-history`}
                    id={`hg-container-history`}
                    style={{height:'100%',width:'180px'}}
                >
                    <HBExplorerContentHistory
                        selectArticle = {selectArticle}
                        displayedArticles = {displayedArticles}

                    />
                </div>

                {articlePanels}

            </Container>
        );


    }

}

export default HBExplorerContent;
