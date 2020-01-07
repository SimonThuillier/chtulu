import React from "react";

import HBExplorerContentHistory from "./HBExplorerContentHistory.jsx";
import HBExplorerArticleCard from "./HBExplorerArticleCard";


import {AVAILABLE_THEMES} from "../../util/explorerUtil";
import {getInlinedCss} from "../../util/cssUtil";
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
        const {dispatch,mainArticleId,articles,displayedArticles,setHoveredArticle,
            toggleActiveComponent,closeArticle,selectArticle,expandArticle,linkArticle,
            theme} = this.props;


        const articlesToDisplay = Array.from(displayedArticles).
        filter(([id,value])=>{
            return value.isOpen;
        }).
        sort((a,b)=>{
            const aSelectionDate = a[1].selectionDate;
            const bSelectionDate = b[1].selectionDate;
            return (aSelectionDate.getTime() - bSelectionDate.getTime());
        });

        //console.log("render content");

        const articleCards = articlesToDisplay.map(([id,value])=>{
            return (
               <HBExplorerArticleCard
                   key={`hg-container-article-card-${id}`}
                   dispatch={dispatch}
                   id={+id}
                   mainArticleId={mainArticleId}
                   articles={articles}
                   displayParameters={value}
                   activeComponent = {value.activeComponent}
                   setHoveredArticle={setHoveredArticle}
                   toggleActiveComponent={toggleActiveComponent}
                   closeArticle={closeArticle}
                   selectArticle={selectArticle}
                   expandArticle={expandArticle}
                   linkArticle={linkArticle}
               />
            );
        });

        return (
            <Container>
                {/*<div*/}
                    {/*hidden={theme===AVAILABLE_THEMES.SIDEVIEW}*/}
                    {/*className="hg-content-panel"*/}
                    {/*key={`hg-container-history`}*/}
                    {/*id={`hg-container-history`}*/}
                    {/*style={{height:'100%',width:'180px'}}*/}
                {/*>*/}
                    {/*<HBExplorerContentHistory*/}
                        {/*selectArticle = {selectArticle}*/}
                        {/*displayedArticles = {displayedArticles}*/}

                    {/*/>*/}
                {/*</div>*/}

                {articleCards}

            </Container>
        );


    }

}

export default HBExplorerContent;
