import React from "react";

import MeasureAndRender from "./MeasureAndRender";
import HBExplorerTimePanel from "./HBExplorerTimePanel.jsx";
import HBExplorerTimeMenu from "./HBExplorerTimeMenu.jsx";
import HBExplorerContent from "./HBExplorerContent.jsx";
import HBMap from "./HBMap.jsx";

import cmn from "../util/common";
import styled, { ThemeProvider } from "styled-components";
import ResizeBar from "./ResizeBar";
import HBExplorerHeader from "./HBExplorerHeader";
import {
    splitCssLength,
    getInlinedCss,
    cssizePropertyName
} from "../util/cssUtil";
import {
    AVAILABLE_THEMES
} from "../util/explorerUtil";



const { EDITOR, SIDEVIEW, VERTICAL } = AVAILABLE_THEMES;

const explorerUid = require("uuid/v4")();

let _idGenerator = cmn.getIdGenerator();

const Container = styled.div`
  ${({ theme: { container } }) => getInlinedCss(container)}
`;
const Header = styled.div`
  ${({ theme: { header } }) => getInlinedCss(header)}
`;
const Middle = styled.div`
  ${({ theme: { middle } }) => getInlinedCss(middle)}
`;
const Left = styled.div`
  ${({ theme: { left } }) => getInlinedCss(left)}
`;
const Right = styled.div`
  ${({ theme: { right } }) => getInlinedCss(right)}
`;
const Bottom = styled.div`
  ${({ theme: { bottom } }) => getInlinedCss(bottom)}
`;

const TimeArea = styled.div`
  ${({ theme: { timeArea } }) => getInlinedCss(timeArea)}
`;
const TimePanel = styled.div`
  ${({ theme: { timePanel } }) => getInlinedCss(timePanel)}
`;
const TimeFooter = styled.div`
  ${({ theme: { timeFooter } }) => getInlinedCss(timeFooter)}
`;
const MapArea = styled.div`
  ${({ theme: { mapArea } }) => getInlinedCss(mapArea)}
`;
const ContentArea = styled.div`
  ${({ theme: { contentArea } }) => getInlinedCss(contentArea)}
`;

const DEFAULT_LAYOUT = {
    container: {
        display: `flex`,
        flexDirection: "column",
        overflow: `hidden`,
        border: `0px solid black`,
        borderRadius: "3px",
        padding: "2px"
    },
    header: {
        order: 1,
        overflow: `auto`,
        height: `40px`,
        border: `2px solid rgb(23, 88, 190)`,
        padding: `0px`,
        display: `flex`,
        flexDirection: `column`
    },
    middle: {
        order: 3,
        overflow: `hidden`,
        display: "flex",
        flexDirection: "row"
    },
    left: {
        order: 1,
    },
    right: {
        order: 2,
    },
    bottom: {
        order: 5,
        overflow: `hidden`,
        height: `20%`,
        border: `2px solid rgb(23, 88, 190)`
    },
    timeArea: {
        className:"time-area",
        overflow:"hidden",
        padding: "0px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    timePanel: {
        className:"time-panel",
        order: 1,
        flexBasis: `95%`,
        maxHeight:`98%`
    },
    timeFooter: {
        className:"time-footer",
        order: 2,
        flexBasis: `40px`,
        minHeight:`40px`,
        maxHeight:`40px`
},
mapArea: {
    padding: "0px",
    height: "100%",
    width: "100%",
    display: "flex",
    background: "green",
    flexDirection: "column"
},
contentArea: {
    padding: "0px",
    height: "100%",
    width: "100%",
    background: `#AAB`
}
};

let VERTICAL_LAYOUT = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
VERTICAL_LAYOUT.middle.flexDirection = "column";
VERTICAL_LAYOUT.left.order = 3;

const THEMES = {
EDITOR: DEFAULT_LAYOUT,
SIDEVIEW: DEFAULT_LAYOUT,
VERTICAL: VERTICAL_LAYOUT
};

let { context, provider } = React.createContext();

class HBExplorer extends React.Component {
constructor(props) {
    super(props);

    this.containerRef = React.createRef();
    this.headerRef = React.createRef();
    this.middleRef = React.createRef();
    this.bottomRef = React.createRef();
    this.rightRef = React.createRef();

    this.timeAreaRef = React.createRef();
    this.mapAreaRef = React.createRef();

    this.setTheme = this.setTheme.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onBottomResize = this.onBottomResize.bind(this);
    this.onRightResize = this.onRightResize.bind(this);

    this.prependChild = this.prependChild.bind(this);

    this.resizeCounter=0;

    this.state = {
        guiInitialized: 0,
        isResizing : false,
        frameSizes: new Map()
            .set("container.width", `400px`)
            .set("container.height", `400px`)
            .set("middle.height", `60%`)
            .set("bottom.height", `40%`)
            .set("left.width", `60%`)
            .set("right.width", `40%`),
        currentTheme: VERTICAL
    };
    console.log("build");
}

componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
    this.setState({ guiInitialized: 1 });
    setTimeout(() => {
        console.log("gui2");
        this.setState({ guiInitialized: 2 });
    }, 100);
}

setTheme(theme) {
    console.log(theme);
    this.setState({ currentTheme: theme, guiInitialized: 1 });
    setTimeout(() => {
        this.setState({ guiInitialized: 2 });
    }, 20);
}

onWindowResize() {
    const {
        containerRef: { current }
    } = this;
    const { frameSizes,guiInitialized } = this.state;
    if (!current || current === null) return;

    const containerRect = this.containerRef.current.getBoundingClientRect();
    console.log(
        `resized window : ${window.innerWidth} / ${window.innerHeight}`
    );
    console.log(
        `explorer origin : ${containerRect.top} / ${containerRect.left}`
    );
    console.log(
        `resized explorer : ${containerRect.width} / ${containerRect.height}`
    );

    const newContainerWidth = window.innerWidth - containerRect.left;
    const newContainerHeight = window.innerHeight - containerRect.top;

    if (
        `${newContainerWidth}px` !== frameSizes.get("container.width") ||
        `${newContainerHeight}px` !== frameSizes.get("container.height")
    ) {
        let newFrameSizes = new Map(frameSizes);
        newFrameSizes
            .set("container.width", `${newContainerWidth}px`)
            .set("container.height", `${newContainerHeight}px`);

        this.setState({ frameSizes: newFrameSizes,isResizing:true});
        const counter = this.resizeCounter;
        const component = this;

        setTimeout(()=>{
            if(component.state.isResizing && counter === component.resizeCounter){
                component.setState({isResizing:false});
            }
        },100);
    }
}

// begin flag :set the scale and origin values for resize
onBottomResize(delta, flag = "onGoing") {
    const { frameSizes } = this.state;
    if (flag === "begin") {
        this.onBottomResizeParam = {
            beginMousePosition: delta,
            rangeAbsoluteSize:
            this.containerRef.current.getBoundingClientRect().height -
            this.headerRef.current.getBoundingClientRect().height,
            beginRelativeSize: frameSizes.get("bottom.height")
        };
        return;
    }
    // onGoing
    const { min, max } = Math;
    const { rangeAbsoluteSize, beginRelativeSize } = this.onBottomResizeParam;
    //console.log(`bottom resize ${delta}px vs ${rangeAbsoluteSize}px`);
    let { length, unit } = splitCssLength(beginRelativeSize);

    let newPercentage = +length - (100 * delta) / rangeAbsoluteSize;
    newPercentage = max(min(newPercentage, 100), 0);

    let newFrameSizes = new Map(this.state.frameSizes);
    newFrameSizes
        .set("bottom.height", `${newPercentage}%`)
        .set("middle.height", `${100 - newPercentage}%`);
    this.setState({ frameSizes: newFrameSizes });

    //console.log(newPercentage);
}

// begin flag :set the scale and origin values for resize
onRightResize(delta, flag = "onGoing") {
    const { frameSizes, currentTheme } = this.state;
    if (flag === "begin") {
        this.onRightResizeParam = {
            beginMousePosition: delta,
            rangeAbsoluteSize:
                currentTheme === "VERTICAL"
                    ? this.middleRef.current.getBoundingClientRect().height
                    : this.middleRef.current.getBoundingClientRect().width,
            beginRelativeSize: frameSizes.get("right.width")
        };
        return;
    }
    // onGoing
    const { min, max } = Math;
    const { rangeAbsoluteSize, beginRelativeSize } = this.onRightResizeParam;

    //console.log(`right resize ${delta}px vs ${rangeAbsoluteSize}px`);

    let { length, unit } = splitCssLength(beginRelativeSize);

    let newPercentage =
        +length +
        ((currentTheme === "VERTICAL" ? 1 : -1) * (100 * delta)) /
        rangeAbsoluteSize;
    newPercentage = max(min(newPercentage, 100), 0);

    let newFrameSizes = new Map(this.state.frameSizes);
    newFrameSizes
        .set("right.width", `${newPercentage}%`)
        .set("left.width", `${100 - newPercentage}%`);
    this.setState({ frameSizes: newFrameSizes });

    //console.log(newPercentage);
}

prependChild(node){
    console.log("prepend");
    if(!!this.containerRef && !!this.containerRef.current){
        this.containerRef.current.prepend(node);
    }
}

componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
}

render() {
    const { currentTheme, frameSizes, guiInitialized,isResizing } = this.state;
    const { searchBag,setLimit,hInterval,setHInterval,cursorRate,cursorDate,isCursorActive,setCursorRate,toggleCursor,
        articles,displayedArticles,invisibles,
        hoveredArticleId, setHoveredArticle,selectArticle,closeArticle,toggleActiveComponent,addArticle,
        dispatch,onFilter} = this.props;
    const theme = THEMES[currentTheme];
    //console.log(currentTheme);

    if(this.timeAreaRef.current){
        //console.log(this.timeAreaRef.current);
        //console.log(this.timeAreaRef.current.getBoundingClientRect());
    }

    const timeArea = (
        <TimeArea id={"time-area"} ref={this.timeAreaRef}>
            <TimeFooter id={"time-footer"}>
                <HBExplorerTimeMenu
                    hInterval={hInterval}
                    setHInterval={setHInterval}
                    invisibles={invisibles}
                />
            </TimeFooter>
            <TimePanel id={"time-panel"}
                       style={{height:`${(!!this.timeAreaRef.current)?this.timeAreaRef.current.getBoundingClientRect().height-40:100}px`}}
            >
                <MeasureAndRender
                    stretch={true}
                    debounce={1}
                    onWindowResize={this.onPanelAreaResize}
                    updaterVar={frameSizes}
                    /*ref={node => {
                        this.panelMeasureRef = node;
                    }}*/
                    >
                        {bounds => {
                            //{ stroke, className, bounds} = props;
                            const path = `M0,0
      L${bounds.width},0
      L${bounds.width},${bounds.height}
      L0,${bounds.height}
      Z`;
                            //console.log(path);
                            //return <p>{path}</p>

                            return [
                                <HBExplorerTimePanel
                                    key={"hg-time-panel"}
                                    theme={theme}
                                    bounds={bounds}
                                    marginWidth={0}
                                    path={path}
                                    hInterval={hInterval}
                                    setHInterval={setHInterval}
                                    articles={articles}
                                    displayedArticles={displayedArticles}
                                    hoveredArticleId={hoveredArticleId}
                                    setHoveredArticle={setHoveredArticle}
                                    selectArticle={selectArticle}
                                    addArticle={addArticle}
                                    cursorRate={cursorRate}
                                    cursorDate = {cursorDate}
                                    isCursorActive={isCursorActive}
                                    setCursorRate = {setCursorRate}
                                    toggleCursor = {toggleCursor}
                                />
                            ];
                        }}
                    </MeasureAndRender>
                </TimePanel>
            </TimeArea>
        );

        const mapArea = (
            <MapArea ref={this.mapAreaRef}>
                <HBMap
                    dispatch={dispatch}
                    width={this.mapAreaRef.current?this.mapAreaRef.current.getBoundingClientRect().width:100}
                    height={this.mapAreaRef.current?this.mapAreaRef.current.getBoundingClientRect().height:100}
                    articles={articles}
                    hoveredArticleId={hoveredArticleId}
                    setHoveredArticle={setHoveredArticle}
                    selectArticle={selectArticle}
                    displayedArticles={displayedArticles}
                    isResizing={false}
                />
            </MapArea>);

        const contentArea = (
            <ContentArea>
                <HBExplorerContent
                    dispatch={dispatch}
                    displayedArticles={displayedArticles}
                    selectArticle={selectArticle}
                    toggleActiveComponent={toggleActiveComponent}
                    closeArticle={closeArticle}
                    theme={theme}
                />
            </ContentArea>);

        return (
            <ThemeProvider theme={theme}>
                <div ref={this.containerRef} style={{ padding: "0px" }}>
                    <ul role={"menu"} className={"dropdown-menu"}>
                        <li role={"presentation"} className={""}><a role={"menuitem"} tabIndex={"-1"} href="#">10</a></li>
                        <li role={"presentation"} className={""}><a role={"menuitem"} tabIndex={"-1"} href="#">20</a></li>
                    </ul>
                    {guiInitialized > 0 && (
                        <Container
                            key={`container`}
                            style={{
                                width: frameSizes.get("container.width"),
                                height: frameSizes.get("container.height")
                            }}
                            ref={this.containerRef}
                        >
                            <Header ref={this.headerRef}>
                                <HBExplorerHeader
                                    theme={this.state.currentTheme}
                                    onChange={this.setTheme}
                                    onFilter={onFilter}
                                    searchBag={searchBag}
                                    setLimit={setLimit}
                                />
                            </Header>
                            <Middle
                                ref={this.middleRef}
                                style={{
                                    height: frameSizes.get("middle.height")
                                }}
                            >
                                <Left
                                    style={{
                                        height: [VERTICAL].includes(currentTheme)
                                            ? frameSizes.get("left.width")
                                            : null,
                                        width: [EDITOR, SIDEVIEW].includes(currentTheme)
                                            ? frameSizes.get("left.width")
                                            : null
                                    }}
                                >
                                    {[EDITOR, VERTICAL].includes(currentTheme)
                                        ? timeArea
                                        : contentArea}
                                </Left>
                                {!isResizing && guiInitialized > 1 && !!this.rightRef.current && (
                                    <ResizeBar
                                        key={`right-resize-bar-${currentTheme}`}
                                        placementType={
                                            [EDITOR, SIDEVIEW].includes(currentTheme)
                                                ? "right"
                                                : "bottom"
                                        }
                                        style={
                                            [EDITOR, SIDEVIEW].includes(currentTheme)
                                                ? {
                                                    height: this.rightRef.current.getBoundingClientRect()
                                                        .height,
                                                    top: this.rightRef.current.getBoundingClientRect()
                                                        .top,
                                                    right:
                                                    window.innerWidth -
                                                    this.rightRef.current.getBoundingClientRect().left
                                                }
                                                : {
                                                    bottom:
                                                    window.innerHeight -
                                                    this.rightRef.current.getBoundingClientRect()
                                                        .top -
                                                    this.rightRef.current.getBoundingClientRect()
                                                        .height,
                                                    width: this.rightRef.current.getBoundingClientRect()
                                                        .width,
                                                    left: this.rightRef.current.getBoundingClientRect()
                                                        .left
                                                }
                                        }
                                        onMove={this.onRightResize}
                                    />
                                )}
                                <Right
                                    ref={this.rightRef}
                                    style={{
                                        height: [VERTICAL].includes(currentTheme)
                                            ? frameSizes.get("right.width")
                                            : null,
                                        width: [EDITOR, SIDEVIEW].includes(currentTheme)
                                            ? frameSizes.get("right.width")
                                            : null
                                    }}
                                >
                                    {mapArea}
                                </Right>
                            </Middle>
                            {!isResizing && guiInitialized > 1 && !!this.bottomRef.current && (
                                <ResizeBar
                                    key={"bottom-resize-bar"}
                                    placementType={"bottom"}
                                    style={{
                                        bottom:
                                        window.innerHeight -
                                        this.bottomRef.current.getBoundingClientRect().top,
                                        width: this.bottomRef.current.getBoundingClientRect().width,
                                        left: this.bottomRef.current.getBoundingClientRect().left
                                    }}
                                    onMove={this.onBottomResize}
                                />
                            )}
                            <Bottom
                                ref={this.bottomRef}
                                key={`bottom`}
                                style={{
                                    height: frameSizes.get("bottom.height")
                                }}
                            >
                                {[EDITOR, VERTICAL].includes(currentTheme)
                                    ? contentArea
                                    : timeArea}
                            </Bottom>
                        </Container>
                    )}
                </div>
            </ThemeProvider>
        );
    }
}

export default HBExplorer;
