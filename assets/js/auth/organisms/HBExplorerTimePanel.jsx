import React from "react";
import HTimeRange from "../../util/HTimeRange";
import { scaleTime } from "d3-scale";
import { tween, easing } from "popmotion";
import styler from "stylefire";
import posed, { PoseGroup } from "react-pose";
import dU from "../../util/date";
import {articleIsOpen} from "../../util/explorerUtil";
import HBExplorerPanelArticle from './HBExplorerPanelArticle';
import HDate from "../../util/HDate";
import TimeArrowCursor from "../molecules/TimeArrowCursor";
import debounce from "debounce";
import {
    distance,
    vectorDiff,
    nodesCollide,
    LEFT,
    RIGHT,
    VERTICAL,
    PORTRAIT,
    LANDSCAPE
} from "../../util/geometry";
import cmn from "../../util/common";
import TimeArrow from "./TimeArrow";
import {connect} from "react-redux";
import {makeLocalGetByAttributeSelector} from "../../shared/selectors";

const styles = {
    width: "100%",
    height: "100%",
    position: "absolute"
};

const animationParams = {
    startingDuration: 1500, // real ms
    exitingDuration: 400 // real ms,
};


const HistoProxy = (function() {
    const yGenerator = cmn.getIdGenerator(10,5);
    function HistoProxy(article) {
        this.article = article;
        //this.y = yGenerator();
        this.y= 55;
        this.deltaY=0;
        console.log("genere articleproxy");
    }

    HistoProxy.prototype = {
        get id() {
            return this.article.id;
        },
        setArticle(article){
            this.article = article;
            return this;
        },
        get record(){
            return this.article;
        },
        get beginHDate() {
            return this.article.beginHDate;
        },
        get beginDate() {
            return (this.article.beginHDate)?this.article.beginHDate.beginDate:new Date();
        },
        get endHDate() {
            return this.article.endHDate;
        },
        get title() {
            return this.article.title || 'nouvel article';
        },
        get firstRankLinksCount() {
            return this.article.firstRankLinksCount;
        },
        get detailImageResource() {
            return this.article.detailImageResource;
        },
        get currentY() {
            return this.y + this.deltaY;
        },
        set currentY(y) {
            //this.article.y = y;
        }
    };
    return HistoProxy;
})();

// proxy for gradRef
const ArticleRef = (function() {
    function ArticleRef(article) {
        this.article = article;
        this.circleRef = null;
    }

    ArticleRef.prototype = {
        get id() {
            return this.article.id;
        }
    };
    return ArticleRef;
})();

class HBExplorerTimePanel extends React.Component {
    constructor(props) {
        super(props);

        this.getTimeScale = this.getTimeScale.bind(this);
        this.updateHInterval= this.updateHInterval.bind(this);
        this.runAnimationIfNeeded = this.runAnimationIfNeeded.bind(this);
        //this.animate = this.animate.bind(this);
        //this.collectGarbage = this.collectGarbage.bind(this);
        this.onPanelMoveBegin = this.onPanelMoveBegin.bind(this);
        this.onPanelMove = debounce(this.onPanelMove.bind(this),10);
        this.onPanelMoveEnd = this.onPanelMoveEnd.bind(this);

        this.trackMousePosition = this.trackMousePosition.bind(this);
        this.mouseX = null;

        this.onPanelZooming = this.onPanelZooming.bind(this);

        this.animate = this.animate.bind(this);

        this.addBox = this.addBox.bind(this);

        this.manageCollisions = debounce(this.manageCollisions.bind(this),15);

        this.onDblClick = this.onDblClick.bind(this);

        this.articleRefs = new Map();

        this.boxRefs = new Map();

        this.state = {
            timeScale: null,
            articles: new Map(),
            isAnimating: false,
            isMovingPanel: false,
            isZoomingPanel: false,
            originY: this.props.originY || 0
            // gradLegends: new Map()
            //...this.getTimeRangeAndScale()
        };

        this.lastDiscreteEventTime = new Date().getTime();
    }

    componentDidMount()
    {
        const { hInterval, bounds, articles } = this.props;

        const timeScale = this.getTimeScale(hInterval, bounds);

        this.animationData = {
            isAnimating: this.state.isAnimating,
            desactivateUpdate: false,
            lastCurrentTime: new Date().getTime(),
            lastAnimationTime: 0,
            nextTime: new Date().getTime(),
            timeScale: timeScale
        };

        let articleProxies = new Map();
        (articles || [])
            .filter(article => true)
            .sort( (a, b) =>{return a.beginHDate.beginDate >= b.beginHDate.beginDate;})
            .forEach(article => {
                articleProxies.set(+article.id, new HistoProxy(article, 40));
            });

        console.log(timeScale(new Date()));

        this.setState({
            timeScale: timeScale,
            articles: articleProxies
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

        return scaleTime()
            .domain([hInterval.beginDate, hInterval.endDate])
            .range([marginWidth, bounds.width - 2 * marginWidth]);
    }

    runAnimationIfNeeded(timeScale = null) {
        if (timeScale === null) timeScale = this.state.timeScale;
        const { animationPeriod, hInterval } = this.props;
        const { startingDuration, exitingDuration } = animationParams;
        const testDate = new Date();
        if (
            timeScale !== this.animationData.timeScale ||
            Math.floor(timeScale(testDate)) !==
            Math.floor(this.animationData.timeScale(testDate))
        ) {
            if (!this.state.isAnimating) this.setState({ isAnimating: true });
            setTimeout(this.runAnimationIfNeeded, animationPeriod);
            this.animate(timeScale);
            //console.log(`animating : true`);
        } else {
            this.animate();
            setTimeout(() => {
                if (this.props.hInterval === hInterval) {
                    this.setState({ isAnimating: false });
                    //console.log(`animating : false`);
                }
            }, exitingDuration);
        }
    }

    animate(timeScale = null) {
        if (timeScale === null) timeScale = this.state.timeScale;
        //console.log("animating");

        const { animationPeriod } = this.props;
        const { exitingDuration } = animationParams;

        let {
            lastCurrentTime,
            lastCreationTime,
            lastAnimationTime
        } = this.animationData;
        let articles = new Map(this.state.articles);

        const currentTime = new Date().getTime();
        const nextTime = currentTime + animationPeriod;

        // delete articles that don't exist anymore


        // move articles
        articles.forEach((article, id) => {
            if (typeof this.articleRefs.get(id) !== "undefined") {
                const currentCircleX = this.articleRefs.get(id).circleStyler.get("cx");
                const newCircleX = timeScale(article.beginHDate.beginDate);

                //console.log("tweening");

                tween({
                    from: +currentCircleX,
                    to: +newCircleX,
                    duration: animationPeriod,
                    ease: easing.linear
                }).start(this.articleRefs.get(id).circleStyler.set("cx"));
            }
        });
        this.animationData.timeScale = timeScale;
        this.animationData.nextTime = nextTime;

        //console.log(`animate ${grads.size} elements`);
    }

    componentDidUpdate(prevProps, prevState) {
        const oldBounds = prevProps.bounds;
        const oldHInterval = prevProps.hInterval;
        const { hInterval, bounds, articles,theme } = this.props;

        // liste des articles
        let articleProxies = null;
        if (articles !== prevProps.articles) {
            console.log("diff article dans le panel");
            console.log(articles);
            // 1 remove unnecessary references to allow deleted box suppression
            for(let [id,ref] of this.boxRefs){
                /*console.log(id);
                console.log(ref);*/
                console.log(typeof articles.find((a)=>{return +a.id===+id;}) === 'undefined');
                if(typeof articles.find((a)=>{return +a.id===+id;}) === 'undefined'){
                    /*const thisArticleRef = this.boxRefs.get(+id).boxRef;
                    console.log(thisArticleRef);
                    if(!!thisArticleRef){
                        console.log(thisArticleRef);

                    }*/
                    this.boxRefs.delete(+id);
                }
            }

            articleProxies = new Map();
            (articles || [])
                .filter(article => {return !!article.beginHDate;})
                .sort( (a, b) =>{return a.beginHDate.beginDate.getTime() - b.beginHDate.beginDate.getTime();})
                .forEach(article => {
                    articleProxies.set(+article.id, this.state.articles.has(+article.id)?
                        this.state.articles.get(+article.id).setArticle(article):new HistoProxy(article));
                });
            this.setState({ articles: articleProxies });
            this.manageCollisions();

        } else {
            articleProxies = this.state.articles;
        }

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

            this.animationData.timeScale = timeScale;
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
        const { hInterval, bounds } = this.props;

        const currentTime = new Date().getTime();
        const timeScale = this.getTimeScale(hInterval, bounds);
        /*console.log("update timeScale");
        console.log(timeScale(new Date()));*/

        this.setState({ timeScale: timeScale });
        this.runAnimationIfNeeded(timeScale);
        this.manageCollisions();
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

    addBox(boxRef,article)
    {
        const sameBoxAsBefore = (this.boxRefs.has(+article.id) && this.boxRefs.get(+article.id).boxRef===boxRef);
        if(sameBoxAsBefore) return;
        //console.log(`addBox form article ${article.title},same as before : ${sameBoxAsBefore}`);
        //console.log(boxRef);

        this.boxRefs.set(+article.id,
            {
                boxRef:boxRef,
                y:article.y,
                title:article.title,
                beginDate:article.beginDate,
                firstRankLinksCount:article.firstRankLinksCount,
                isTested:false,
                deltaY:0,
                collisions:{},
            }
        );
    }

    manageCollisions(){
        if(!this.boxRefs || this.boxRefs.size < 2) return;

        const {max,min,abs} = Math;

        //console.clear();
        //console.log(`check collisions among ${this.boxRefs.size} elements`);
        //console.log(this.boxRefs);

        // first let's compute an index array of id/y, and set isTested of each value to 0
        let checkIndex = [];
        this.boxRefs.forEach((v,k) =>{
                v.isTested = false;
                v.collisions = {};
                //v.deltaY = this.state.articles.get(+k).deltaY;
                checkIndex.push([k,v.firstRankLinksCount,v.beginDate]);
            }
        );
        // then sort it from upper to lower y
        checkIndex.sort((a,b)=>{return a[1]>b[1]?-1:(a[1]===b[1]?(a[2]>=b[2]?1:-1):1)});
        //console.log(checkIndex);
        // let's then use this index to iterate on boxRefs
        let actionCount=0;
        for (let i=0;i<checkIndex.length;i++){
            let mainId = checkIndex[i][0];
            let mainBoxRef = this.boxRefs.get(mainId);
            // first we aggregate all data to compute deltaY for the mainBoxRef
            let maxDelta =-10000;
            //if(mainId===149) console.log(mainBoxRef.collisions);
            Object.entries(mainBoxRef.collisions).forEach((v,k) =>{
                        maxDelta = max(maxDelta,+v[1]);
                }
            );
            if(mainId===149) console.log(`1 -maxDelta ${maxDelta} vs oldDeltaY ${mainBoxRef.deltaY}`);
            if(maxDelta === -10000) {maxDelta = 0;}
            else if(maxDelta>-4 && maxDelta<2){maxDelta=mainBoxRef.deltaY;}
            else {
                maxDelta +=mainBoxRef.deltaY;
            }
            //if(mainId===149) console.log(`2 -maxDelta ${maxDelta} vs oldDeltaY ${mainBoxRef.deltaY}`);

            if(maxDelta > mainBoxRef.deltaY){
                mainBoxRef.deltaY = max(0,maxDelta);
                actionCount+=1;
            }
            else if(mainBoxRef.deltaY>0 && maxDelta<mainBoxRef.deltaY){
                mainBoxRef.deltaY = max(0,maxDelta);
                actionCount+=1;
            }

            //if(mainId===149) console.log(`3 -maxDelta ${maxDelta} vs oldDeltaY ${mainBoxRef.deltaY}`);
            //console.log(`${mainBoxRef.title} maxDelta ${maxDelta} vs deltaY ${mainBoxRef.deltaY}`);
            mainBoxRef.isTested = true;

            // then we test if lower elements collide our main box
            for (let j=i+1;j<checkIndex.length;j++){
                let lowerId = checkIndex[j][0];
                let lowerBoxRef = this.boxRefs.get(lowerId);
                let collision = nodesCollide(mainBoxRef.boxRef,lowerBoxRef.boxRef,2);
                //if(mainId===140) console.log(collision);
                if(collision !== null){
                    //console.log(`${mainBoxRef.title} on ${lowerBoxRef.title}, collision ${collision}`);
                }

                if(!lowerBoxRef.isTested && collision!==null){
                    //console.log(`${mainBoxRef.title} on ${lowerBoxRef.title}, collision ${collision}`);
                    lowerBoxRef.collisions[mainId] = collision;
                }
            }
        }

        if(actionCount>0){
            let articleProxies = new Map(this.state.articles);
            articleProxies.forEach((v,k) =>{
                    v.deltaY = this.boxRefs.get(k).deltaY;
                }
            );
            //console.log(articleProxies);
            this.setState({articles:articleProxies});
            setTimeout(this.manageCollisions,30);
        }
    }

    onDblClick(e){
        const {addArticle,bounds} = this.props;
        //console.log(bounds);
        const position = { x: e.clientX, y: e.clientY };
        const addDate = this.state.timeScale.invert(
            position.x-bounds.x
        );
        addArticle(addDate);
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const {bounds,displayedArticles,mainArticleId,hoveredArticleId, setHoveredArticle,selectArticle,hInterval,setHInterval,
            cursorDate,cursorRate,isCursorActive,setCursorRate,toggleCursor,getLinks} = this.props;
        const realArticles = this.props.articles;
        const marginWidth = this.props.marginWidth || 0;
        const strokeSize = 1;
        const { timeScale, articles,originY } = this.state;

        const width = bounds.width;
        const height = bounds.height;

        //console.log(articles);


        const arrayOfArticlesToDisplay = Array.from(articles).filter(
            ([id, a]) => {
                return true;
            }
        );
        /*console.log("arrayOfArticlesToDisplay");
        console.log(arrayOfArticlesToDisplay);
        console.log("this.boxRefs");
        console.log(this.boxRefs);*/

        const panelSvgArticles = arrayOfArticlesToDisplay.map(([id, a]) => {

            let isLinked = null;
            const isArticleMain = (+a.id === mainArticleId);
            if(mainArticleId !== null && !isArticleMain){
                const links = getLinks('childId',+a.id);
                const currentLink = links.find((link)=>{return +link.get('parentId') === +mainArticleId && link.get('toDelete')===false});
                if(typeof currentLink !== 'undefined') isLinked=true;
                else isLinked=false;
            }

            const realArticle = realArticles.find((realArticle)=>{return +realArticle.id === +a.id});

            return (
                <HBExplorerPanelArticle
                    key={`histo-article-${a.id}`}
                    selected={articleIsOpen(displayedArticles,+a.id)}
                    onPanelMoveEnd={this.onPanelMoveEnd} // to prevent some panel events when action on an article is performed
                    hovered={+hoveredArticleId===+a.id}
                    setHoveredArticle={setHoveredArticle}
                    selectArticle={selectArticle}
                    cursorDate = {cursorDate}
                    article={a}
                    mainArticleId={mainArticleId}
                    minLinksCount={this.props.minLinksCount}
                    maxLinksCount={this.props.maxLinksCount}
                    linksCount={typeof realArticle !=='undefined'?realArticle.firstRankLinksCount:0}
                    linked={isLinked}
                    timeScale={timeScale}
                    originY={originY}
                    addBox={this.addBox}
                    width={width}
                />
            );
        });

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
                    {panelSvgArticles}
                </g>
                <TimeArrow
                    key={"hg-time-arrow"}
                    bounds={bounds}
                    hInterval={hInterval}
                    setHInterval={setHInterval}
                />
                <TimeArrowCursor
                    key={'time-arrow-cursor'}
                    articles={realArticles}
                    selectArticle={selectArticle}
                    cursorDate = {cursorDate}
                    cursorRate = {cursorRate}
                    isCursorActive={isCursorActive}
                    setCursorRate={setCursorRate}
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
    const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};
export default connect(makeMapStateToProps)(HBExplorerTimePanel);

