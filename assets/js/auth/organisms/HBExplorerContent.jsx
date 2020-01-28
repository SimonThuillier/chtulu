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
        const {dispatch,mainArticleId,article,displayParameters,setHoveredArticle,
            setActiveComponent,theme} = this.props;

        return (
            <Container>
                <HBExplorerArticleCard
                    key={`hg-container-article-card-${mainArticleId}`}
                    dispatch={dispatch}
                    id={mainArticleId}
                    article={article}
                    displayParameters={displayParameters}
                    setHoveredArticle={setHoveredArticle}
                    setActiveComponent={setActiveComponent}
                />
            </Container>
        );

    }
}

export default HBExplorerContent;
