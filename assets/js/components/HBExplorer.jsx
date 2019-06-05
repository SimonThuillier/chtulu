import React from "react";
import ReactDOM from "react-dom";
import { distance, vectorDiff, LEFT, RIGHT, VERTICAL } from "../util/geometry";

import debounce from "debounce";
import { Button, Glyphicon } from "react-bootstrap";
import HBExplorerDateInput from "./HBExplorerDateInput";

import MeasureAndRender from "./MeasureAndRender";
import CSSVariableApplicator from "./CSSVariableApplicator";
import TimeArrow from "./TimeArrow.jsx";
import HBExplorerPanel from "./HBExplorerPanel.jsx";
import HBExplorerContentHistory from "./HBExplorerContentHistory.jsx";
import MapContainer from "./MapContainer.jsx";
import MapHandlerIcon from "./MapHandlerIcon.jsx";

import ArticleTitle from "./ArticleTitle";
import ArticleType from "./ArticleType";
import Article from "./Article.jsx";
import HBExplorerMenu from "./HBExplorerMenu";

import HDate from "../util/HDate";
import dU from "../util/date";

import cmn from "../util/common";

const explorerUid = require("uuid/v4")();

let _idGenerator = cmn.getIdGenerator();

/** @doc HBExplorer is bounded to [1/1/-9999;now] and it's minimum size is 3 days
 * this function hence check a wanted hInterval and returns it or a properly constrained
 * hInterval to avoid HBexplorer errors
 */
const getConstrainedHInterval = hInterval => {
    // minimum length constraint
    if (hInterval.getIntervalSize() < 3) {
        hInterval = new HDate(
            "2",
            dU.addDay(dU.clone(hInterval.endDate), -3),
            hInterval.endDate
        );
    }
    // max limit to now
    const maxDate = dU.stripHours(new Date());
    if (hInterval.endDate > maxDate) {
        hInterval = new HDate(
            "2",
            dU.addDay(dU.clone(maxDate), -hInterval.getIntervalSize()),
            dU.clone(maxDate)
        );
    }
    // min limit
    const minDate = dU.stripHours(new Date(-9999, 0, 1, 0, 0, 0, 0));
    if (hInterval.beginDate < minDate) {
        hInterval = new HDate(
            "2",
            dU.clone(minDate),
            dU.addDay(dU.clone(minDate), +hInterval.getIntervalSize())
        );
    }
    //console.log(hInterval.endDate);
    return hInterval;
};

// for both ongoing translating and zooming speed increase with time speed = acceleration^elapsedTime
// this function returns the resulting integration
const getIntegratedSpeed = (acceleration, time) => {
    const { exp, log, floor } = Math;
    return (1 / log(acceleration)) * (exp(time * log(acceleration)) - 1);
};

const getInvisibles = (articles, hInterval) => {
    // articles non visibles
    let leftInvisibles = 0;
    let rightInvisibles = 0;
    let verticalInvisibles = 0;
    let minDate = hInterval.getMiddleDate();
    let maxDate = hInterval.getMiddleDate();
    (articles || []).forEach(article => {
        if (article.beginHDate.beginDate < hInterval.beginDate)
            leftInvisibles = leftInvisibles + 1;
        if (article.beginHDate.endDate > hInterval.endDate)
            rightInvisibles = rightInvisibles + 1;

        minDate =
            minDate !== null
                ? new Date(
                Math.min(minDate.getTime(), article.beginHDate.beginDate.getTime())
                )
                : dU.clone(article.beginHDate.beginDate);

        maxDate =
            maxDate !== null
                ? new Date(
                Math.max(maxDate.getTime(), article.beginHDate.endDate.getTime())
                )
                : dU.clone(article.beginHDate.endDate);
    });

    let invisibles = {};
    invisibles[LEFT] = { number: leftInvisibles, minDate: minDate };
    invisibles[RIGHT] = { number: rightInvisibles, maxDate: maxDate };

    return invisibles;
};

class HBExplorer extends React.Component {
    constructor(props) {
        super(props);
        // global component resizing parameters
        this.resizingDelay = 5;
        // in ms
        this.timeTravellingPeriod = 20;
        /* proportion of hInterval travelled by second */
        this.timeTravellingPace = 0.1;
        /* proportion of initial hInterval zoomed by second */
        this.timeZoomingPace = 1.075;
        this.timeZoomingTurbo = 1.5;
        this.timeTravellingAcceleration = 1.4; // by second
        this.timeFirstTravelDuration = 250;
        this.timeFirstTravelDuration = 250;

        // function to add an article
        //this.addArticle = this.addArticle.bind(this);
        // hInterval setter to provide for children that need it (timeArrow)
        this.setHInterval = this.setHInterval.bind(this);

        // shared vars for resizing functions
        this.beginMousePosition = { x: 0, y: 0 };

        // global component resizing functions
        /*this.onResizingBegin = this.onResizingBegin.bind(this);
        this.onWindowResize = debounce(
            this.onWindowResize.bind(this),
            this.resizingDelay
        );
        this.onResizingEnd = this.onResizingEnd.bind(this);*/

        // global width resizing function
        this.onWidthResize = this.onWidthResize.bind(this);

        // content area resizing functions
        this.onContentAreaResizingBegin = this.onContentAreaResizingBegin.bind(this);
        this.onContentAreaResize = debounce(
            this.onContentAreaResize.bind(this),
            this.resizingDelay
        );
        this.onContentAreaResizingEnd = this.onContentAreaResizingEnd.bind(this);

        // panel area resizing functions
        this.onPanelAreaResizingBegin = this.onPanelAreaResizingBegin.bind(this);
        this.onPanelAreaResize = debounce(
            this.onPanelAreaResize.bind(this),
            this.resizingDelay
        );
        this.onPanelAreaResizingEnd = this.onPanelAreaResizingEnd.bind(this);

        // map display and resizing functions
        this.onMapDragBegin = this.onMapDragBegin.bind(this);
        this.onMapDrag = debounce(this.onMapDrag.bind(this), this.resizingDelay);
        this.onMapDragEnd = this.onMapDragEnd.bind(this);

        // ### time travel functions
        this.onTimeTravelBegin = this.onTimeTravelBegin.bind(this);
        this.onTimeTravel = debounce(
            this.onTimeTravel.bind(this),
            Math.floor(0.9 * this.timeTravellingPeriod)
        );
        this.onTimeTravelEnd = this.onTimeTravelEnd.bind(this);

        // ### time zooming functions
        this.onTimeZoomingBegin = this.onTimeZoomingBegin.bind(this);
        this.onTimeZooming = debounce(
            this.onTimeZooming.bind(this),
            Math.floor(0.9 * this.timeTravellingPeriod)
        );
        this.onTimeZoomingEnd = this.onTimeZoomingEnd.bind(this);

        this.setCursorRate = this.setCursorRate.bind(this);
        this.toggleCursor = this.toggleCursor.bind(this);

        this.selectArticle = this.selectArticle.bind(this);
        this.closeArticle = this.closeArticle.bind(this);
        this.toggleActiveComponent = this.toggleActiveComponent.bind(this);

        this.toggleContent = this.toggleContent.bind(this);

        this.state = {
            /* current time interval of the explorer :
            must Always be not null and valid
            */
            hInterval: getConstrainedHInterval(props.hInterval),
            hasSelfUpdatedHInterval:false, // if true blocks the update by props (TODO : think it again later)
            // ### global component resizing
            frameSizes: new Map().set("contentArea.height", 500).set("panelArea.height", 250).set("explorer.width", 500),
            timeArrowToResize: null,
            panelToResize: null,
            isResizing: false,
            // ### map display and resizing
            mapFullMode: false,
            mapSide: 100,
            isDraggingMap: false,
            initialDragMapPosition: null,
            initialMapSide: null,
            // ### time travel parameters
            /* 0 means time travel is inactive
               -1 that it's going backward
               1 that it's going forward
            */
            isTimeTravelling: 0,
            /* 0 means time zoom is inactive
               -1 that it's expanding the area (un-zoom)
               1 that it's narrowing the area (zoom, magnification)
            */
            isTimeZooming: 0,
            /* in ms : must be reinitialized to 0 on each travel end */
            timeTravelBeginTime: 0,
            initialTimeTravelHInterval: null,
            /* offset of time Travel as fraction of day,
            usefull when travelling on small hInterval (a week for instance)
            */
            timeTravelOffset: 0,
            /**
             * articles
             */
            invisibles: {
                LEFT: { number: 0, minDate: null },
                RIGHT: { number: 0, minDate: null }
            },
            // array of id of selected articles
            selected:[],
            // time cursor
            cursorRate:0.25,
            isCursorActive:false,
            // article display parameter
            mainArticleId:props.mainArticleId||null,
            displayContent: !!(props.mainArticleId),
            displayedArticles:new Map(),
            displayContentHistory: true,
        };

        if(props.mainArticleId !==null){
            this.state.displayedArticles.set(+props.mainArticleId,{selectionDate:new Date(),isOpen:true,activeComponent:'form'})
        }
    }

    toggleCursor(){
        this.setState({isCursorActive:!this.state.isCursorActive});
    }

    setCursorRate(rate){
        this.setState({cursorRate:rate});
    }

    toggleContent(){
        this.setState({
            displayContent: !this.state.displayContent
        });
    }

    setHInterval(hInterval) {
        const invisibles = getInvisibles(this.state.articles, hInterval);
        this.setState({ hInterval: hInterval, invisibles: invisibles,hasSelfUpdatedHInterval:true });
    }

    selectArticle(ids) {
        if(ids===null) ids=[];
        const {displayedArticles} = this.state;

        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            article.isOpen= false;
        });


        ids.forEach((id)=>{newDisplayedArticles.set(+id,{selectionDate:new Date(),isOpen:true,activeComponent:'detail'})});

        this.setState({selected:ids,displayedArticles:newDisplayedArticles,displayContent:true});
    }

    closeArticle(ids) {
        if(ids===null) return;
        const {displayedArticles,selected} = this.state;

        let newSelectedIds = Array.from(selected);
        newSelectedIds = newSelectedIds.filter(id => !ids.includes(+id));

        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            if(ids.includes(+id)){
                article.isOpen= false;
            }
        });

        this.setState({selected:newSelectedIds,displayedArticles:newDisplayedArticles});
    }

    toggleActiveComponent(ids){
        const {displayedArticles} = this.state;

        let newDisplayedArticles = new Map(displayedArticles);

        newDisplayedArticles.forEach((article,id)=>{
            if(ids.includes(+id)){
                article.activeComponent= article.activeComponent==='detail'?'form':'detail';
            }
        });
        this.setState({displayedArticles:newDisplayedArticles});
    }

    onTimeZoomingBegin(e, sense = -1) {
        if (this.state.isTimeZooming === 0) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onTimeZoomingEnd);
            console.log("beginning of the time zooming ...");
            this.setState({
                isTimeZooming: sense,
                timeTravelBeginTime: new Date().getTime(),
                initialTimeTravelInterval: this.state.hInterval.clone()
            });
            this.onTimeZooming();
        }
    }
    /* 0 means time zoom is inactive
           -1 that it's expanding the area (un-zoom)
           1 that it's narrowing the area (zoom, magnification)
        */
    onTimeZooming() {
        const {
            isTimeZooming,
            timeTravelBeginTime,
            initialTimeTravelInterval
        } = this.state;
        if (isTimeZooming !== 0) {
            const currentTime = new Date().getTime();

            const rawFactor =
                1 +
                this.timeZoomingPace *
                getIntegratedSpeed(
                    this.timeTravellingAcceleration,
                    (currentTime - timeTravelBeginTime) / 1000
                );

            let zoomFactor = +isTimeZooming > 0 ? 1 / rawFactor : rawFactor;
            zoomFactor = Math.pow(zoomFactor, this.timeZoomingTurbo);
            //console.log(rawFactor);
            /*console.log(
              `initial Interval : ${initialTimeTravelInterval.getIntervalSize()}`
            );
            console.log(`time zooming factor ! : ${zoomFactor}`);*/
            let newHInterval = initialTimeTravelInterval
                .clone()
                .setType("2")
                .multiply(zoomFactor);
            /*console.log(
                `final Interval : ${
                    newHInterval.beginDate
                    } - ${newHInterval.getMiddleDate()} - ${newHInterval.endDate}`
            );*/
            const invisibles = getInvisibles(this.props.articles, newHInterval);
            this.setState({
                hInterval: newHInterval,
                invisibles: invisibles
            });
            setTimeout(this.onTimeZooming, this.timeTravellingPeriod);
        }
    }

    onTimeZoomingEnd(e) {
        if (this.isTimeZooming !== 0) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("mouseup", this.onTimeZoomingEnd);
            console.log("end of the time zooming.");
            this.setState({
                isTimeZooming: 0,
                timeTravelBeginTime: -1,
                initialTimeTravelInterval: null
            });
        }
    }

    componentDidMount() {
        const invisibles = getInvisibles(this.props.articles, this.state.hInterval);

        this.setState({
            panelToResize: ReactDOM.findDOMNode(this.panelRef),
            timeArrowToResize: ReactDOM.findDOMNode(this.timeArrowRef),
            invisibles: invisibles
        });
        /*const hgContainer = document.getElementById("hg-container");
        hgContainer.addEventListener("mousedown", this.onResizingBegin);
        window.addEventListener("mouseup", this.onResizingEnd);*/

        const hgContentArea = document.getElementById("hg-content-area");
        hgContentArea.addEventListener(
            "mousedown",
            this.onContentAreaResizingBegin
        );

        const hgPanelArea = document.getElementById("hg-panel-area");
        hgPanelArea.addEventListener(
            "mousedown",
            this.onPanelAreaResizingBegin
        );

        window.addEventListener('resize',this.onWidthResize);
    }

    onWidthResize(){
        const explorerRect = this.gridRef.getBoundingClientRect();
        console.log(`resized explorer width : ${explorerRect.width}`);

        let newFrameSizes = new Map(this.state.frameSizes);
        newFrameSizes.set(
            "explorer.width",
            Math.max(explorerRect.width,100)
        );

        this.setState({ frameSizes: newFrameSizes });
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.onWidthResize);
        // stop listening to window mouseup
        //window.removeEventListener("mouseup", this.onResizingEnd);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.hasSelfUpdatedHInterval && !prevProps.hInterval.equals(this.props.hInterval)) {
            const invisibles = getInvisibles(this.props.articles, this.props.hInterval);
            this.setState({
                hInterval: this.props.hInterval,
                invisibles: invisibles
            });
        }
        //console.log(this.timeAreaRef.current.getBoundingClientRect().top);
        //console.log(this.timeAreaRef.current.getBoundingClientRect().bottom);
    }

    onPanelAreaResizingBegin(e) {
        if (!this.state.isResizing) {
            const rect = this.panelAreaRef.getBoundingClientRect(); //e.target.getBoundingClientRect();
            const corner = { x: rect.right, y: rect.bottom };
            const mousePosition = { x: e.clientX, y: e.clientY };
            const dist = distance(corner, mousePosition);
            if (dist < 23) {
                //e.preventDefault();
                e.stopPropagation();
                this.setState({ isResizing: true });
                window.addEventListener("mousemove", this.onPanelAreaResize);
                window.addEventListener("mouseup", this.onPanelAreaResizingEnd);
                this.beginMousePosition = mousePosition;
                this.beginFrameSizes = new Map(this.state.frameSizes);
                console.log(
                    "resizing panel area activé !"
                );
            }
        }
    }

    onPanelAreaResize(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("onPanelAreaResize");
        console.log(this.panelAreaRef.getBoundingClientRect());
        const mousePosition = { x: e.clientX, y: e.clientY };
        const deltaY = mousePosition.y - this.beginMousePosition.y;
        console.log(
            `newY ${mousePosition.y} vs oldY ${
                this.beginMousePosition.y
                }, delta ${deltaY}`
        );

        let newFrameSizes = new Map(this.state.frameSizes);
        newFrameSizes.set(
            "panelArea.height",
            Math.max(this.beginFrameSizes.get("panelArea.height") + deltaY,35)
        );

        cmn.cancelSelection();
        this.setState({ frameSizes: newFrameSizes });
    }

    onPanelAreaResizingEnd(e) {
        if (this.state.isResizing) {
            window.removeEventListener("mousemove", this.onPanelAreaResize);
            window.removeEventListener("mouseup", this.onPanelAreaResizingEnd);
            this.setState({ isResizing: false });
            console.log("resizing panel area terminé !");
            setTimeout(()=>{this.onPanelAreaResize(e);}, 2 * this.resizingDelay);
        }
    }

    onWindowResize() {
        console.log("onWindowResize");

        const bounds = this.state.panelToResize.getBoundingClientRect();
        console.log(bounds.width);
        console.log(bounds.height);
        const newMapSide = Math.min(
            this.state.mapSide,
            bounds.width,
            bounds.height
        );
        //console.log("newMapSide");
        //console.log(newMapSide);
        if (newMapSide !== this.state.mapSide) {
            this.setState({ mapSide: newMapSide });
        }
    }

    onResizingEnd(e) {
        if (this.state.isResizing) {
            window.removeEventListener("mousemove", this.onWindowResize);
            this.setState({ isResizing: false });
            console.log("resizing terminé !");
            setTimeout(this.onWindowResize, 2 * this.resizingDelay);
        }
    }


    onContentAreaResizingBegin(e) {
        if (!this.state.isResizing) {
            //console.log(e.target);
            //console.log(this.gridRef.getBoundingClientRect());
            const rect = this.contentAreaRef.getBoundingClientRect(); //e.target.getBoundingClientRect();
            const corner = { x: rect.right, y: rect.bottom };
            const mousePosition = { x: e.clientX, y: e.clientY };
            const dist = distance(corner, mousePosition);
            if (dist < 23) {
                //e.preventDefault();
                e.stopPropagation();
                this.setState({ isResizing: true });
                window.addEventListener("mousemove", this.onContentAreaResize);
                window.addEventListener("mouseup", this.onContentAreaResizingEnd);
                this.beginMousePosition = mousePosition;
                this.beginFrameSizes = new Map(this.state.frameSizes);
                console.log(
                    "resizing content area activé !"
                );
            }
        }
    }

    onContentAreaResize(e) {
        console.log("onContentAreaResize");
        console.log(this.contentAreaRef.getBoundingClientRect());
        const mousePosition = { x: e.clientX, y: e.clientY };
        const deltaY = mousePosition.y - this.beginMousePosition.y;
        console.log(
            `newY ${mousePosition.y} vs oldY ${
                this.beginMousePosition.y
                }, delta ${deltaY}`
        );

        let newFrameSizes = new Map(this.state.frameSizes);
        newFrameSizes.set(
            "contentArea.height",
            Math.max(this.beginFrameSizes.get("contentArea.height") + deltaY,35)
        );

        cmn.cancelSelection();
        this.setState({ frameSizes: newFrameSizes });
    }

    onContentAreaResizingEnd(e) {
        if (this.state.isResizing) {
            window.removeEventListener("mousemove", this.onContentAreaResize);
            window.removeEventListener("mouseup", this.onContentAreaResizingEnd);
            this.setState({ isResizing: false });
            console.log("resizing content area terminé !");
            setTimeout(()=>{this.onContentAreaResize(e);}, 2 * this.resizingDelay);
        }
    }

    onMapDragBegin(e) {
        console.log("on map drag begin");
        if (!this.state.isDraggingMap) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onMapDragEnd);
            console.log("onMapDragBegin");
            const initialPosition = { x: e.clientX, y: e.clientY };
            this.setState({
                isDraggingMap: true,
                initialDragMapPosition: initialPosition,
                initialMapSide: this.state.mapSide
            });
            window.addEventListener("mousemove", this.onMapDrag);
        }
    }

    onMapDrag(e) {
        console.log("onMapDrag");
        e.preventDefault();
        e.stopPropagation();
        const position = { x: e.clientX, y: e.clientY };
        // positions are inverted due to our UX pattern
        const delta = vectorDiff(position, this.state.initialDragMapPosition);
        const maxDelta = Math.max(delta.x, delta.y);
        //console.log(maxDelta);
        let newSide = Math.max(this.state.initialMapSide + maxDelta, 1);

        const bounds = this.state.panelToResize.getBoundingClientRect();
        newSide = Math.min(newSide, bounds.width, bounds.height);
        this.setState({ mapSide: newSide });
    }

    onMapDragEnd(e) {
        console.log("on map drag end");
        if (this.state.isDraggingMap) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("mousemove", this.onMapDrag);
            console.log("onMapDragEnd");
            window.removeEventListener("mouseup", this.onMapDragEnd);
            this.setState({
                isDraggingMap: false,
                initialDragMapPosition: null,
                initialMapSide: null
            });
            setTimeout(e => this.onMapDrag, 2 * this.resizingDelay);
        }
    }

    onTimeTravelBegin(e, sense = -1) {
        if (this.state.isTimeTravelling === 0) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onTimeTravelEnd);
            console.log("beginning of the time travel ...");
            //const startDelay = 5;
            this.setState({
                isTimeTravelling: sense,
                timeTravelBeginTime: new Date().getTime(),
                initialTimeTravelInterval: this.state.hInterval.clone()
            });
            this.onTimeTravel();
            //setTimeout(, startDelay);
        }
    }

    onTimeTravel() {
        const {
            isTimeTravelling,
            timeTravelBeginTime,
            initialTimeTravelInterval
        } = this.state;
        if (isTimeTravelling !== 0) {
            const currentTime = new Date().getTime();

            const addedDays = Math.floor(
                +isTimeTravelling *
                initialTimeTravelInterval.getIntervalSize() *
                this.timeTravellingPace *
                getIntegratedSpeed(
                    this.timeTravellingAcceleration,
                    (currentTime - timeTravelBeginTime) / 1000
                )
            );
            /*console.log(
              `currentAnimationTime : ${(currentTime - timeTravelBeginTime) /
                1000}, addedDays : ${addedDays}`
            );*/
            //console.log(`time travelling ! : ${duration} ms`);
            //console.log(hInterval);
            let newHInterval = initialTimeTravelInterval
                .clone()
                .setType("2")
                .addDay(addedDays);
            //console.log(newHInterval);
            const invisibles = getInvisibles(this.props.articles, newHInterval);
            this.setState({
                hInterval: newHInterval,
                invisibles: invisibles
            });
            setTimeout(this.onTimeTravel, 0.9 * this.timeTravellingPeriod);
        }
    }

    onTimeTravelEnd(e) {
        if (this.isTimeTravelling !== 0) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("mouseup", this.onTimeTravelEnd);
            console.log("end of the time travel.");
            this.setState({
                isTimeTravelling: 0,
                timeTravelBeginTime: -1,
                initialTimeTravelInterval: null
            });
        }
    }

    render() {
        const { invisibles,hInterval,cursorRate,isCursorActive,mapSide,mapFullMode,isDraggingMap,
            frameSizes,displayContent,selected,displayedArticles,displayContentHistory } = this.state;
        const {dispatch,articles} = this.props;
        const cursorDate = (hInterval!==null && cursorRate!==null)?hInterval.getBarycenterDate(cursorRate):null;

        //console.log(Array.from(displayedArticles));

        console.log(displayedArticles);

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
            return (
                <div className="panel panel-default hg-content-panel"
                    key={`hg-container-article-panel-${id}`}
                     id={`hg-container-article-panel-${id}`}
                >

                    <div className="hg-content-panel-heading">
                        <span><h4><ArticleType articleId={id}/></h4></span>
                        <span><h4><ArticleTitle id={id}/></h4></span>
                        <span>
                            <Button bsStyle="primary"
                                    disabled={false}
                                    onClick={()=>{this.toggleActiveComponent([id])}}>
                               <Glyphicon glyph={value.activeComponent==='detail'?'edit':'eye-open'}/>
                            </Button>
                            <Button bsStyle="default"
                                    disabled={false}
                                    onClick={()=>{this.closeArticle([id])}}>
                               <Glyphicon glyph={'remove'}/>
                            </Button>
                        </span>
                    </div>

                    <div className="panel-body">
                        <Article
                            dispatch={dispatch}
                            id={id}
                            activeComponent={value.activeComponent}
                            detailGroups={{"minimal":true,"date":true,"abstract":true,"detailImage":true}}
                            formGroups={{"minimal":true,"date":true,"abstract":true,"detailImage":true}}
                            handleSwitch={null}
                            onNothing={null}
                        />
                    </div>
                    <div className="panel-footer hg-content-panel-footer">

                    </div>
                </div>

                );
        });

        return (
            <div
                className="hg-container"
                id="hg-container"
                ref={node => {
                    this.gridRef = node;
                }}
            >
                <CSSVariableApplicator
                    variables={{
                        "--content-area-height": `
                            ${displayContent
                            ? frameSizes.get("contentArea.height")
                            : 0
                            }px`,
                        "--panel-area-height": `
                            ${frameSizes.get("panelArea.height")}px`
                    }}
                />
                <div className="hg-header">header</div>
                <div className="hg-date-input">
                    <HBExplorerDateInput
                        setHInterval={this.setHInterval}
                        input={hInterval}
                    />
                </div>
                <div
                    className="hg-time-arrow"
                    ref={node => {
                        this.timeArrowRef = node;
                    }}
                >
                    <div style={{ position: "relative", height: "75px" }}>
                        {
                            <MeasureAndRender
                                stretch={true}
                                debounce={1}
                                updaterVar={frameSizes.get("explorer.width")}

                                //onWindowResize={this.onWindowResize}
                                ref={node => {
                                    this.timeArrowMeasureRef = node;
                                }}
                            >
                                {bounds => {
                                    return (
                                        <TimeArrow
                                            setHInterval={this.setHInterval}
                                            marginWidth={10}
                                            bounds={bounds}
                                            animationPeriod={Math.ceil(
                                                this.timeTravellingPeriod * 1.2
                                            )}
                                            hInterval={hInterval}
                                            cursorRate={cursorRate}
                                            cursorDate = {cursorDate}
                                            setCursorRate={this.setCursorRate}
                                            toggleCursor={this.toggleCursor}
                                        />
                                    );
                                }}
                            </MeasureAndRender>
                        }
                    </div>
                </div>
                <HBExplorerMenu
                    hInterval = {hInterval}
                    setHInterval = {this.setHInterval}
                    invisibles = {invisibles}
                    onTimeTravelBegin = {this.onTimeTravelBegin}
                    onTimeTravelEnd = {this.onTimeTravelEnd}
                    onTimeZoomingBegin={this.onTimeZoomingBegin}
                    onTimeZoomingEnd={this.onTimeZoomingEnd}
                    toggleContent = {this.toggleContent}
                    displayContent = {displayContent}
                />
                <div
                    hidden={!displayContent}
                    className="hg-content-area"
                    id="hg-content-area"
                    ref={node => {
                        this.contentAreaRef = node;
                    }}
                >
                    <div
                        hidden={!displayContent}
                        className="hg-content-container"
                    >
                        <div
                            hidden={!displayContentHistory}
                            className="hg-content-panel"
                            key={`hg-container-history`}
                            id={`hg-container-history`}
                        >
                            <HBExplorerContentHistory
                                selectArticle = {this.selectArticle}
                                displayedArticles = {displayedArticles}

                            />
                        </div>
                        {articlePanels}
                    </div>
                </div>
                <div
                    className="hg-time-area"
                    ref={node => {
                        this.panelRef = node;
                    }}
                >
                    <div
                        className="hg-panel-area"
                        id="hg-panel-area"
                        style={{
                            position: "relative",
                            resize: "vertical",
                            overflow: "none",
                            minHeight: `${frameSizes.get("panelArea.height")}px`,
                        }}
                        ref={node => {
                            this.panelAreaRef = node;
                        }}
                    >
                        <MeasureAndRender
                            stretch={true}
                            debounce={1}
                            onWindowResize={this.onPanelAreaResize}
                            updaterVar={frameSizes.get("contentArea.height")+
                            frameSizes.get("panelArea.height")+frameSizes.get("explorer.width")}
                            /*ref={node => {
                                this.panelMeasureRef = node;
                            }}*/
                        >
                            {bounds => {
                                //console.log("test2");
                                const stroke = 1;
                                //{ stroke, className, bounds} = props;
                                const path = `M${stroke},${stroke}
      L${bounds.width - stroke},${stroke}
      L${bounds.width - stroke},${bounds.height - 10 - stroke}
      L${stroke},${bounds.height - 10 - stroke}
      Z`;
                                //console.log(path);

                                return [
                                    <HBExplorerPanel
                                        key={"hg-time-panel"}
                                        bounds={bounds}
                                        path={path}
                                        articles={articles}
                                        selectArticle={this.selectArticle}
                                        selected={selected}
                                        //addArticle={this.addArticle}
                                        setInvisibles={this.setInvisibles}
                                        hInterval={hInterval}
                                        setHInterval={this.setHInterval}
                                        animationPeriod={this.timeTravellingPeriod}
                                        marginWidth={10}
                                        cursorRate={cursorRate}
                                        cursorDate = {cursorDate}
                                        isCursorActive={isCursorActive}
                                    />,
                                    <MapContainer
                                        key={"hg-map-container"}
                                        id={"hg-map-container"}
                                        bounds={bounds}
                                        isResizing={isDraggingMap}
                                        side={mapSide}
                                        fullMode={mapFullMode}
                                    />,
                                    <MapHandlerIcon
                                        key={"hg-map-handler-icon"}
                                        bounds={bounds}
                                        side={mapSide}
                                        fullMode={mapFullMode}
                                        onDragBegin={this.onMapDragBegin}
                                        onDragEnd={this.onMapDragEnd}
                                    />
                                ];
                            }}
                        </MeasureAndRender>
                    </div>
                </div>
                <div className="hg-footer" id="hg-footer">
                    <Button>
                        <Glyphicon glyph="object-align-bottom" />
                        <Glyphicon glyph="arrow-down" />
                    </Button>
                </div>
            </div>
        );
    }
}

export default HBExplorer;
