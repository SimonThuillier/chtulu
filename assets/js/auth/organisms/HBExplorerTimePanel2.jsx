import React from "react";
import { scaleTime } from "d3-scale";
import { tween, easing } from "popmotion";
import dU from "../../util/date";
import HBExplorerPanelMarker from './HBExplorerPanelMarker';
import TimeArrowCursor from "../molecules/TimeArrowCursor";
import debounce from "debounce";
import {
    nodesCollide,
} from "../../util/geometry";
import TimeArrow from "./TimeArrow";
import {connect} from "react-redux";
import {makeGetOneByIdSelector} from "../../shared/selectors";

import {analyzeAbstract} from '../../util/explorerUtil';

const styles = {
    width: "100%",
    height: "100%",
    position: "absolute"
};

const markerStartY=50;
const markerDeltaY=35;



class HBExplorerTimePanel2 extends React.Component {
    constructor(props) {
        super(props);

        this.getTimeScale = this.getTimeScale.bind(this);
        this.updateHInterval= this.updateHInterval.bind(this);

        this.onPanelMoveBegin = this.onPanelMoveBegin.bind(this);
        this.onPanelMove = debounce(this.onPanelMove.bind(this),10);
        this.onPanelMoveEnd = this.onPanelMoveEnd.bind(this);

        this.trackMousePosition = this.trackMousePosition.bind(this);
        this.mouseX = null;

        this.onPanelZooming = this.onPanelZooming.bind(this);

        this.onDblClick = this.onDblClick.bind(this);

        this.state = {
            timeScale: null,
            articles: new Map(),
            isAnimating: false,
            isMovingPanel: false,
            isZoomingPanel: false,
            originY: this.props.originY || 0
        };
    }

    componentDidMount()
    {
        const { hInterval, bounds} = this.props;

        const timeScale = this.getTimeScale(hInterval, bounds);

        this.setState({
            timeScale: timeScale
        });

        console.log("new component, maybe because of theme changes");
        window.addEventListener("mousemove", this.trackMousePosition);
        setTimeout(this.updateHInterval,20);
    }

    componentWillUnmount()
    {
        window.removeEventListener("mousemove", this.trackMousePosition);
    }

    getTimeScale(hInterval, bounds) {
        const marginWidth = 0;//this.props.marginWidth ;

        console.log('this.getTimeScale',hInterval, bounds);

        return scaleTime()
            .domain([hInterval.beginDate, hInterval.endDate])
            .range([marginWidth, bounds.width - 2 * marginWidth]);
    }

    componentDidUpdate(prevProps, prevState) {
        const oldBounds = prevProps.bounds;
        const oldHInterval = prevProps.hInterval;
        const { hInterval, bounds, articles,theme } = this.props;

        // le time scale
        let timeScale = null;
        if (oldHInterval && !hInterval.equals(oldHInterval)) {
            //console.log(1);
            this.updateHInterval();
        } else if (
            bounds.height !== oldBounds.height ||
            bounds.width !== oldBounds.width
        ) {
            //console.log(2);
            timeScale = this.getTimeScale(hInterval, bounds);
            this.setState({ timeScale: timeScale });
        } else {
            timeScale = this.state.timeScale;
        }

        // si le theme change on appelle manageCollisions
        if(prevProps.theme !== theme){
            console.log("theme changes");
            this.updateHInterval();
            //setTimeout(this.updateHInterval,30);
        }
    }

    updateHInterval() {
        const { hInterval, bounds,mainArticleId,getArticles } = this.props;

        const mainArticle = getArticles(mainArticleId);
        const timeScale = this.getTimeScale(hInterval, bounds);
        const stateToUpdate = {timeScale: timeScale};

        console.log(`new originY : ${!this.state.isMovingPanel && !!mainArticle}`);
        // if the timeUpdate is due to exterior command we autoUpdate the Y according to the time markers
        if(!this.state.isMovingPanel && !!mainArticle){
            /*const rawMarkers = analyzeAbstract(mainArticle);
            let markerY = markerStartY-markerDeltaY;
            let originY = -1;

            for (const {hDate} of rawMarkers) {
                if(hInterval.intersects(hDate)){
                    originY = markerY;
                    break;
                }
                markerY = markerY + markerDeltaY;
            }
            if(originY<0){
                originY = markerY;
            }
            stateToUpdate.originY = originY-5;*/
            //console.log(`new originY : ${originY}`);

            stateToUpdate.originY = markerStartY-markerDeltaY-15;
        }

        this.setState(stateToUpdate);
    }

    onPanelMoveBegin(e) {
        //console.log("on panel move begin");
        if (!this.state.isMovingPanel) {
            e.preventDefault();
            e.stopPropagation();

            this.lastDiscreteEventTime = new Date().getTime();

            const initialPosition = { x: e.clientX, y: e.clientY };
            const initialMovePanelDate = this.state.timeScale.invert(
                initialPosition.x
            );

            window.addEventListener("mouseup", this.onPanelMoveEnd);
            //console.log("onPanelMoveBegin");

            this.setState({
                isMovingPanel: true,
                initialMovePanelPosition: initialPosition,
                initialMovePanelDate: initialMovePanelDate,
                initialHInterval: this.props.hInterval.clone(),
                initialTimeScale: this.state.timeScale,
                initialOriginY: this.state.originY
            });
            //console.log(`initialDate : ${initialMovePanelDate}`);
            window.addEventListener("mousemove", this.onPanelMove);
        }
    }

    onPanelMove(e) {
        //console.log("onPanelMove");
        e.preventDefault();
        e.stopPropagation();
        const position = { x: e.clientX, y: e.clientY };
        // positions are inverted due to our UX pattern

        const { setHInterval } = this.props;
        const {
            initialMovePanelDate,
            initialHInterval
        } = this.state;

        const dateDelta = this.state.initialTimeScale.invert(position.x);
        const dayDelta = dU.dayDiff(initialMovePanelDate, dateDelta);

        const yDelta = this.state.initialMovePanelPosition.y - position.y;

        const newHInterval = initialHInterval.clone().addDay(dayDelta);
        this.setState({ originY: this.state.initialOriginY + yDelta });
        setHInterval(newHInterval);
    }

    onPanelMoveEnd(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.state.isMovingPanel) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("mousemove", this.onPanelMove);
            //console.log("onPanelMoveEnd");
            window.removeEventListener("mouseup", this.onPanelMoveEnd);
            this.setState({
                isMovingPanel: false,
                initialMovePanelPosition: null,
                initialHInterval: null
            });
        }
    }

    onPanelZoomingBegin(e, sense = -1) {
        if (!this.state.isZoomingPanel) {
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

    trackMousePosition(e)
    {
        this.mouseX = e.clientX;
    }

    onPanelZooming(e)
    {
        const { setHInterval,hInterval,bounds} = this.props;
        const mouseDate = this.state.timeScale.invert(this.mouseX-bounds.x);

        const baseDeltaY = 53;
        const baseTimeDelta = 0.075;

        const {max,min} = Math;
        let factor = 1;
        if(+e.deltaY>0) factor = 1 + min((e.deltaY/baseDeltaY * baseTimeDelta),baseTimeDelta*2);
            else if (+e.deltaY<0) factor = 1 + max((e.deltaY/baseDeltaY * baseTimeDelta),-baseTimeDelta*2);

        const middleDate = hInterval.getMiddleDate();
        const dayDiff = dU.dayDiff(mouseDate,middleDate);

        const newHInterval = hInterval.clone().multiply(factor);
        const newDayDiff = dU.dayDiff(mouseDate,newHInterval.getMiddleDate());
        const deltaDay = newDayDiff - dayDiff*factor;
        newHInterval.addDay(deltaDay);
        setHInterval(newHInterval);
    }

    onDblClick(e){
        /*const {addArticle,bounds} = this.props;
        //console.log(bounds);
        const position = { x: e.clientX, y: e.clientY };
        const addDate = this.state.timeScale.invert(
            position.x-bounds.x
        );
        addArticle(addDate);*/
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const {bounds,getArticles,mainArticleId,hInterval,setHInterval,
            cursorDate,cursorRate,isCursorActive,setCursorRate,timeRecordMode,toggleTimeRecordMode,toggleCursor} = this.props;

        const realArticles = this.props.articles;
        const marginWidth = this.props.marginWidth || 0;
        const strokeSize = 1;
        const { timeScale, articles,originY } = this.state;

        //console.log('hInterval,timeScale',hInterval,timeScale);

        const width = bounds.width;
        const height = bounds.height;

        const mainArticle = getArticles(mainArticleId);

        let markers = [];
        let markerY = markerStartY;

        if(!!mainArticle && !!timeScale){
            const rawMarkers = analyzeAbstract(mainArticle);

            rawMarkers.forEach((v)=>{

                //console.log(v);

                //console.log(`hInterval ${hInterval.getLabel()} intersects ${v.hDate.getLabel()} : ${hInterval.intersects(v.hDate)}`);

                if(hInterval.intersects(v.hDate)){
                    markers.push(
                        <HBExplorerPanelMarker
                            key={`histo-marker-${v.id}`}
                            selected={false}
                            onPanelMoveEnd={this.onPanelMoveEnd} // to prevent some panel events when action on an article is performed
                            hovered={false}
                            setHoveredArticle={()=>{}}
                            selectArticle={()=>{}}
                            cursorDate = {cursorDate}
                            marker={v}
                            timeScale={timeScale}
                            originY={markerY-originY}
                            addBox={()=>{}}
                            width={width}
                        />);
                    markerY = markerY + markerDeltaY;
                }
            });
        }








        return (
            <svg
                id={"main-histo-panel"}
                key={"main-histo-panel"}
                viewBox={`0 0 ${bounds.width} ${bounds.height}`}
                preserveAspectRatio="none"
                onMouseDown={this.onPanelMoveBegin}
                onWheel={this.onPanelZooming}
                onDoubleClick={this.onDblClick}
                ref={node => {
                    this.panelRef = node;
                }}
            >
                <g fill="bisque" strokeWidth={strokeSize}>
                    <path
                        vectorEffect="non-scaling-stroke"
                        d={this.props.path}
                        stroke="black"
                    />
                    <svg>
                        <text id={`time-panel-svg-article-mock`} style={{visibility:'hidden'}}/></svg>
                        {markers}
                </g>
                <TimeArrow
                    key={"hg-time-arrow"}
                    bounds={bounds}
                    hInterval={hInterval}
                    setHInterval={setHInterval}
                />
                <TimeArrowCursor
                    key={'time-arrow-cursor'}
                    cursorDate = {cursorDate}
                    cursorRate = {cursorRate}
                    isCursorActive={isCursorActive}
                    setCursorRate={setCursorRate}
                    toggleTimeRecordMode = {toggleTimeRecordMode}
                    timeRecordMode = {timeRecordMode}
                    toggleCursor={toggleCursor}
                    width = {width}
                    height = {55}
                    marginWidth = {marginWidth}
                />
            </svg>
        );
    }
}

const makeMapStateToProps = () => {
    const getArticlesSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getArticles : getArticlesSelector(state.get("article"))
        }
    }
};
export default connect(makeMapStateToProps)(HBExplorerTimePanel2);

