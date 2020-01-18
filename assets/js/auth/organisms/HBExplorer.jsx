import React from "react";

import MeasureAndRender from "../hoc/MeasureAndRender";
import HBExplorerTimePanel from "./HBExplorerTimePanel.jsx";
import HBExplorerTimePanel2 from "./HBExplorerTimePanel2.jsx";
import HBExplorerTimeMenu from "./HBExplorerTimeMenu.jsx";
import HBExplorerContent from "./HBExplorerContent.jsx";
import HBMap from "./HBMap.jsx";
import HBMap2 from "./HBMap2.jsx";

import cmn from "../../util/common";
import styled, { ThemeProvider } from "styled-components";
import ResizeBar from "../atoms/ResizeBar";
import HBExplorerHeader from "./HBExplorerHeader";
import {
    splitCssLength,
    getInlinedCss,
    cssizePropertyName
} from "../../util/cssUtil";
import {
    AVAILABLE_THEMES,
    AVAILABLE_AREAS
} from "../../util/explorerUtil";



const { EDITOR, SIDEVIEW, VERTICAL } = AVAILABLE_THEMES;
const { CONTENT, MAP, TIME } = AVAILABLE_AREAS;

import debounce from "debounce";

const explorerUid = require("uuid/v4")();

let _idGenerator = cmn.getIdGenerator();

const Container = styled.div`
  ${({ theme: { container } }) => getInlinedCss(container)}
`;
const Header = styled.div`
  ${({ theme: { header } }) => getInlinedCss(header)}
`;
const TwoPieces = styled.div`
  ${({ theme: { twoPieces } }) => getInlinedCss(twoPieces)}
`;
const Left = styled.div`
  ${({ theme: { left } }) => getInlinedCss(left)}
`;
const Right = styled.div`
  ${({ theme: { right } }) => getInlinedCss(right)}
`;
const OnePiece = styled.div`
  ${({ theme: { onePiece } }) => getInlinedCss(onePiece)}
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
    twoPieces: {
        order: 5,
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
    onePiece: {
        order: 3,
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
VERTICAL_LAYOUT.twoPieces.flexDirection = "column";
VERTICAL_LAYOUT.left.order = 3;

const THEMES = {
    EDITOR: DEFAULT_LAYOUT,
    SIDEVIEW: DEFAULT_LAYOUT,
    VERTICAL: VERTICAL_LAYOUT
};

let { context, provider } = React.createContext();

const resizeMedias = debounce(()=>{
    setTimeout(()=>{
        const scrollArea = document.getElementById('hb-test-scroll');
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        //console.log('resize medias',$('.hb-content .hb-media-iframe>iframe'),scrollAreaRect);

        let factor = 0.4;
        if(scrollAreaRect.width<1000) factor=0.65;
        if(scrollAreaRect.width<600) factor=0.9;

        const mediaWidth = Math.floor(scrollAreaRect.width*factor);
        const mediaHeight = Math.floor(scrollAreaRect.width*factor*9/16);

        const containers = $('.hb-content .hb-media-iframe');

        //containers.attr({height:`${mediaHeight}px`});
        containers.children().attr({width:`${mediaWidth}px`,height:`${mediaHeight}px`});
    },50);

},30);

class HBExplorer extends React.Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
        this.headerRef = React.createRef();
        this.twoPiecesRef = React.createRef();
        this.onePieceRef = React.createRef();
        this.rightRef = React.createRef();

        this.timeAreaRef = React.createRef();
        this.mapAreaRef = React.createRef();

        this.getRealFrameSize = this.getRealFrameSize.bind(this);

        this.setTheme = this.setTheme.bind(this);
        this._setEnabledAreas = this._setEnabledAreas.bind(this);
        this.toggleArea = this.toggleArea.bind(this);

        this.onWindowResize = this.onWindowResize.bind(this);
        this.onOnePieceResize = this.onOnePieceResize.bind(this);
        this.onRightResize = this.onRightResize.bind(this);

        this.prependChild = this.prependChild.bind(this);

        this.onSetMarker = this.onSetMarker.bind(this);
        this.onMagnifyArea = this.onMagnifyArea.bind(this);

        this.resizeCounter=0;

        this.state = {
            guiInitialized: 0,
            isResizing : false,
            frameSizes: new Map()
                .set("container.width", `400px`)
                .set("container.height", `400px`)
                .set("twoPieces.height", `30%`)
                .set("onePiece.height", `70%`)
                .set("left.width", `60%`)
                .set("right.width", `40%`),
            currentTheme: EDITOR, // SIDEVIEW
            enabledAreas: [CONTENT,TIME] // MAP,
        };
        console.log("build");
    }

    /**
     * if click on a marker enable the wanted area if it's not the case
     * @param event
     */
    onSetMarker(event){
        const {iconId,hbOrigin} = event;
        const {enabledAreas} = this.state;
        console.log('hbexplorer onsetmarker',iconId,hbOrigin);

        if(!this.state.enabledAreas.includes(hbOrigin)){
            this.toggleArea(hbOrigin);
        }

        if(iconId.includes('GEO_MARKER') && !enabledAreas.includes(AVAILABLE_AREAS.MAP)){
            this.toggleArea(AVAILABLE_AREAS.MAP);
        }
        if(iconId.includes('TIME_MARKER') && !enabledAreas.includes(AVAILABLE_AREAS.TIME)){
            this.toggleArea(AVAILABLE_AREAS.TIME);
        }
        if((hbOrigin===AVAILABLE_AREAS.TIME || hbOrigin===AVAILABLE_AREAS.MAP) &&
            !enabledAreas.includes(AVAILABLE_AREAS.CONTENT)){
            this.toggleArea(AVAILABLE_AREAS.CONTENT);
        }
    }

    onMagnifyArea(event){
        const {hbOrigin} = event;
        const {enabledAreas} = this.state;
        console.log('hbexplorer magnify',hbOrigin);

        if(hbOrigin ===AVAILABLE_AREAS.CONTENT){
            if(
                !enabledAreas.includes(AVAILABLE_AREAS.CONTENT) ||
                enabledAreas.includes(AVAILABLE_AREAS.TIME) ||
                enabledAreas.includes(AVAILABLE_AREAS.MAP)
            ) this._setEnabledAreas([AVAILABLE_AREAS.CONTENT]);
        }
        if(hbOrigin ===AVAILABLE_AREAS.TIME){
            if(
                !enabledAreas.includes(AVAILABLE_AREAS.TIME) ||
                enabledAreas.includes(AVAILABLE_AREAS.MAP) ||
                enabledAreas.includes(AVAILABLE_AREAS.CONTENT)
            ) this._setEnabledAreas([AVAILABLE_AREAS.TIME]);
        }
        if(hbOrigin ===AVAILABLE_AREAS.MAP){
            if(
                !enabledAreas.includes(AVAILABLE_AREAS.MAP) ||
                enabledAreas.includes(AVAILABLE_AREAS.TIME) ||
                enabledAreas.includes(AVAILABLE_AREAS.CONTENT)
            ) this._setEnabledAreas([AVAILABLE_AREAS.MAP]);
        }
    }

    /** returns the real frameSize from the frameSizes map, theme and enabled areas */
    getRealFrameSize(key){
        const {currentTheme,frameSizes,enabledAreas} = this.state;
        if(enabledAreas.length===3) return frameSizes.get(key);

        const realFrameSizes = new Map()
            .set("twoPieces.height", frameSizes.get("twoPieces.height"))
            .set("onePiece.height", frameSizes.get("onePiece.height"))
            .set("left.width", frameSizes.get("left.width"))
            .set("right.width", frameSizes.get("right.width"));

        switch(currentTheme){
            case EDITOR:
                if(!enabledAreas.includes(CONTENT)){
                    realFrameSizes.set("onePiece.height",'0%').set("twoPieces.height",'100%');
                }
                if(!enabledAreas.includes(TIME)){
                    realFrameSizes.set("left.width",'0%').set("right.width",'100%');
                }
                if(!enabledAreas.includes(MAP)){
                    realFrameSizes.set("left.width",'100%').set("right.width",'0%');
                }
                if(!enabledAreas.includes(TIME) && !enabledAreas.includes(MAP)){
                    realFrameSizes.set("onePiece.height",'100%').set("twoPieces.height",'0%');
                }
                break;
            case SIDEVIEW :
                if(!enabledAreas.includes(CONTENT)){
                    realFrameSizes.set("left.width",'0%').set("right.width",'100%');
                }
                if(!enabledAreas.includes(TIME)){
                    realFrameSizes.set("twoPieces.height",'0%').set("onePiece.height",'100%');
                }
                if(!enabledAreas.includes(MAP)){
                    realFrameSizes.set("left.width",'100%').set("right.width",'0%');
                }
                if(enabledAreas.includes(TIME) && !enabledAreas.includes(CONTENT) && !enabledAreas.includes(MAP)){
                    realFrameSizes.set("onePiece.height",'0%').set("twoPieces.height",'100%')
                        .set("left.width",'100%').set("right.width",'0%');
                }
                break;
            case VERTICAL:
                if(!enabledAreas.includes(CONTENT)){
                    realFrameSizes.set("onePiece.height",'0%').set("twoPieces.height",'100%');
                }
                if(!enabledAreas.includes(TIME)){
                    realFrameSizes.set("left.width",'0%').set("right.width",'100%');
                }
                if(!enabledAreas.includes(MAP)){
                    realFrameSizes.set("left.width",'100%').set("right.width",'0%');
                }
                if(!enabledAreas.includes(TIME) && !enabledAreas.includes(MAP)){
                    realFrameSizes.set("onePiece.height",'100%').set("twoPieces.height",'0%');
                }
                break;
            default:
                break;
        }

        return realFrameSizes.get(key);
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize();
        this.setState({ guiInitialized: 1 });
        setTimeout(() => {
            console.log("gui2");
            this.setState({ guiInitialized: 2 });
            window.dispatchEvent(new Event('resize'));
        }, 100);
        setTimeout(resizeMedias,400);
        window.addEventListener('hb.explorer.set.marker', this.onSetMarker);
        window.addEventListener('hb.explorer.magnify', this.onMagnifyArea);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener('hb.explorer.set.marker', this.onSetMarker);
        window.removeEventListener('hb.explorer.magnify', this.onMagnifyArea);
    }

    setTheme(theme) {
        console.log(theme);
        this.setState({ currentTheme: theme, guiInitialized: 1 });
        setTimeout(() => {
            this.setState({ guiInitialized: 2 });
        }, 10);
        setTimeout(()=>{window.dispatchEvent(new Event('resize'))},20);
        setTimeout(()=>{this.onOnePieceResize(null);},25);
    }

    toggleArea(areaKey){
        const {enabledAreas} = this.state;
        let newEnabledAreas = [];
        let hasRemoved=false;

        console.log(areaKey);

        enabledAreas.forEach((key)=>{
            if(areaKey === key){
                if(! enabledAreas.includes(key)) newEnabledAreas.push(key);
                else hasRemoved = true;
            }
            else{
                newEnabledAreas.push(key);
            }
        });

        if(!hasRemoved) newEnabledAreas.push(areaKey);
        this._setEnabledAreas(newEnabledAreas);
    }

    _setEnabledAreas(newEnabledAreas){
        this.setState({enabledAreas:newEnabledAreas,guiInitialized: 1});
        setTimeout(() => {
            this.setState({ guiInitialized: 2 });
        }, 10);
        setTimeout(()=>{window.dispatchEvent(new Event('resize'))},20);
        setTimeout(()=>{this.onOnePieceResize(null);},25);
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
        resizeMedias();
    }

// begin flag :set the scale and origin values for resize
    onOnePieceResize(delta, flag = "onGoing") {
        const { frameSizes } = this.state;

        if(delta===null){
            let newFrameSizes = new Map(this.state.frameSizes);
            this.setState({ frameSizes: newFrameSizes });
            return
        }

        if (flag === "begin") {
            this.onOnePieceResizeParam = {
                beginMousePosition: delta,
                rangeAbsoluteSize:
                this.containerRef.current.getBoundingClientRect().height -
                this.headerRef.current.getBoundingClientRect().height,
                beginRelativeSize: frameSizes.get("onePiece.height")
            };
            return;
        }
        // onGoing

        const { min, max } = Math;
        const { rangeAbsoluteSize, beginRelativeSize } = this.onOnePieceResizeParam;
        //console.log(`onePiece resize ${delta}px vs ${rangeAbsoluteSize}px`);
        let { length, unit } = splitCssLength(beginRelativeSize);

        let newPercentage = +length + (100 * delta) / rangeAbsoluteSize;
        newPercentage = max(min(newPercentage, 100), 0);

        let newFrameSizes = new Map(this.state.frameSizes);
        newFrameSizes
            .set("onePiece.height", `${newPercentage}%`)
            .set("twoPieces.height", `${100 - newPercentage}%`);
        this.setState({ frameSizes: newFrameSizes });

        //console.log(newPercentage);
        resizeMedias();
    }

// begin flag :set the scale and origin values for resize
    onRightResize(delta, flag = "onGoing") {
        const { frameSizes, currentTheme } = this.state;
        if (flag === "begin") {
            this.onRightResizeParam = {
                beginMousePosition: delta,
                rangeAbsoluteSize:
                    currentTheme === "VERTICAL"
                        ? this.twoPiecesRef.current.getBoundingClientRect().height
                        : this.twoPiecesRef.current.getBoundingClientRect().width,
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
        resizeMedias();
    }

    prependChild(node){
        console.log("prepend");
        if(!!this.containerRef && !!this.containerRef.current){
            this.containerRef.current.prepend(node);
        }
    }

    render() {
        const { currentTheme,enabledAreas, frameSizes, guiInitialized,isResizing } = this.state;
        const { searchBag,setLimit,hInterval,setHInterval,cursorRate,timeRecordMode,toggleTimeRecordMode,
            cursorDate,isCursorActive,setCursorRate,toggleCursor,
            articles,mainArticleId,displayedArticles,invisibles,
            hoveredArticleId, setHoveredArticle,selectArticle,closeArticle,expandArticle,linkArticle,toggleActiveComponent,addArticle,
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
                            //console.log('bounds',bounds);
                            //return <p>{path}</p>

                            if(mainArticleId!==null){
                                return [
                                    <HBExplorerTimePanel2
                                        key={"hg-time-panel"}
                                        theme={theme}
                                        bounds={bounds}
                                        marginWidth={0}
                                        path={path}
                                        hInterval={hInterval}
                                        setHInterval={setHInterval}
                                        articles={articles}
                                        minLinksCount={this.props.minLinksCount}
                                        maxLinksCount={this.props.maxLinksCount}
                                        mainArticleId={mainArticleId}
                                        displayedArticles={displayedArticles}
                                        hoveredArticleId={hoveredArticleId}
                                        setHoveredArticle={setHoveredArticle}
                                        selectArticle={selectArticle}
                                        addArticle={addArticle}
                                        cursorRate={cursorRate}
                                        toggleTimeRecordMode = {toggleTimeRecordMode}
                                        timeRecordMode = {timeRecordMode}
                                        cursorDate = {cursorDate}
                                        isCursorActive={isCursorActive}
                                        setCursorRate = {setCursorRate}
                                        toggleCursor = {toggleCursor}
                                    />
                                ];
                            }

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
                                    minLinksCount={this.props.minLinksCount}
                                    maxLinksCount={this.props.maxLinksCount}
                                    mainArticleId={mainArticleId}
                                    displayedArticles={displayedArticles}
                                    hoveredArticleId={hoveredArticleId}
                                    setHoveredArticle={setHoveredArticle}
                                    selectArticle={selectArticle}
                                    addArticle={addArticle}
                                    cursorRate={cursorRate}
                                    toggleTimeRecordMode = {toggleTimeRecordMode}
                                    timeRecordMode = {timeRecordMode}
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

        let mapArea = null;
        if(mainArticleId!==null){
            mapArea = (
                <MapArea ref={this.mapAreaRef}>
                    <HBMap2
                        dispatch={dispatch}
                        width={this.mapAreaRef.current?this.mapAreaRef.current.getBoundingClientRect().width:100}
                        height={this.mapAreaRef.current?this.mapAreaRef.current.getBoundingClientRect().height:100}
                        mainArticleId={mainArticleId}
                        isResizing={false}
                    />
                </MapArea>);
        }
        else{
             mapArea = (
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
        }



        const contentArea = (
            <ContentArea>
                <HBExplorerContent
                    dispatch={dispatch}
                    mainArticleId={mainArticleId}
                    articles={articles}
                    displayedArticles={displayedArticles}
                    setHoveredArticle={setHoveredArticle}
                    selectArticle={selectArticle}
                    toggleActiveComponent={toggleActiveComponent}
                    closeArticle={closeArticle}
                    expandArticle={expandArticle}
                    linkArticle={linkArticle}
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
                                    enabledAreas={enabledAreas}
                                    toggleArea={this.toggleArea}
                                    onChange={this.setTheme}
                                    onFilter={onFilter}
                                    searchBag={searchBag}
                                    setLimit={setLimit}
                                />
                            </Header>
                            <OnePiece
                                ref={this.onePieceRef}
                                key={`onePiece`}
                                style={{
                                    height: [EDITOR, VERTICAL].includes(currentTheme)
                                        ? this.getRealFrameSize("onePiece.height")
                                        : this.getRealFrameSize("twoPieces.height"),
                                    order : [EDITOR, VERTICAL].includes(currentTheme)
                                        ? 3
                                        : 5
                                }}
                            >
                                {[EDITOR, VERTICAL].includes(currentTheme)
                                    ? contentArea
                                    : timeArea}
                            </OnePiece>
                            {!isResizing && guiInitialized > 1 && !!this.onePieceRef.current && (
                                <ResizeBar
                                    key={"onePiece-resize-bar"}
                                    placementType={"bottom"}
                                    style={{
                                        bottom:
                                        window.innerHeight -
                                        ([EDITOR, VERTICAL].includes(currentTheme)?this.onePieceRef:this.twoPiecesRef)
                                            .current.getBoundingClientRect().bottom,
                                        width: this.onePieceRef.current.getBoundingClientRect().width,
                                        left: this.onePieceRef.current.getBoundingClientRect().left
                                    }}
                                    onMove={this.onOnePieceResize}
                                />
                            )}
                            <TwoPieces
                                ref={this.twoPiecesRef}
                                style={{
                                    height: [EDITOR, VERTICAL].includes(currentTheme)
                                        ? this.getRealFrameSize("twoPieces.height")
                                        : this.getRealFrameSize("onePiece.height"),
                                    order : [EDITOR, VERTICAL].includes(currentTheme)
                                        ? 5
                                        : 3
                                }}
                            >
                                <Left
                                    style={{
                                        height: [VERTICAL].includes(currentTheme)
                                            ? this.getRealFrameSize("left.width")
                                            : null,
                                        width: [EDITOR, SIDEVIEW].includes(currentTheme)
                                            ? this.getRealFrameSize("left.width")
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
                                            ? this.getRealFrameSize("right.width")
                                            : null,
                                        width: [EDITOR, SIDEVIEW].includes(currentTheme)
                                            ? this.getRealFrameSize("right.width")
                                            : null
                                    }}
                                >
                                    {mapArea}
                                </Right>
                            </TwoPieces>
                        </Container>
                    )}
                </div>
            </ThemeProvider>
        );
    }
}

export default HBExplorer;
