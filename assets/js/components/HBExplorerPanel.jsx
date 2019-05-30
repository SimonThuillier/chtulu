import React from "react";
import HTimeRange from "../util/HTimeRange";
import { scaleTime } from "d3-scale";
import { tween, easing } from "popmotion";
import styler from "stylefire";
import posed, { PoseGroup } from "react-pose";
import dU from "../util/date";
import HBExplorerPanelArticle from './HBExplorerPanelArticle';
import HDate from "../util/HDate";
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
} from "../util/geometry";
import cmn from "../util/common";

const styles = {
  width: "100%",
  height: "100%",
  position: "absolute"
};

const animationParams = {
  startingDuration: 1500, // real ms
  exitingDuration: 400 // real ms,
};

const PosedPanelArticle = posed(HBExplorerPanelArticle)({
    enter: {
        x1: props => {
            props.x1;
        },
        x2: props => {
            props.x2;
        },
        fillOpacity: 1,
        delay: 0,
        duration: animationParams.startingDuration
    },
    exit: {
        x1: props => {
            props.x1;
        },
        x2: props => {
            props.x2;
        },
        fillOpacity: 0,
        delay: 0,
        duration: animationParams.exitingDuration
    }
});

const PosedCircle = posed.circle({
  enter: {
    x1: props => {
      props.x1;
    },
    x2: props => {
      props.x2;
    },
    fillOpacity: 1,
    delay: 0,
    duration: animationParams.startingDuration
  },
  exit: {
    x1: props => {
      props.x1;
    },
    x2: props => {
      props.x2;
    },
    fillOpacity: 0,
    delay: 0,
    duration: animationParams.exitingDuration
  }
});



const HistoProxy = (function() {
  const yGenerator = cmn.getIdGenerator(10,5);
  function HistoProxy(article) {
    this.article = article;
    //this.y = yGenerator();
      this.y= 10;
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
    get beginHDate() {
      return this.article.beginHDate;
    },
    get endHDate() {
          return this.article.endHDate;
    },
    get title() {
          return this.article.title;
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

export default class HBExplorerPanel extends React.Component {
  constructor(props) {
    super(props);

    this.getTimeScale = this.getTimeScale.bind(this);
    this.runAnimationIfNeeded = this.runAnimationIfNeeded.bind(this);
    //this.animate = this.animate.bind(this);
    //this.collectGarbage = this.collectGarbage.bind(this);
    this.onPanelMoveBegin = this.onPanelMoveBegin.bind(this);
    this.onPanelMove = debounce(this.onPanelMove.bind(this),10);
    this.onPanelMoveEnd = this.onPanelMoveEnd.bind(this);

    this.animate = this.animate.bind(this);

    this.addBox = this.addBox.bind(this);

      this.manageCollisions = debounce(this.manageCollisions.bind(this),15);

    this.articleRefs = new Map();

    this.boxRefs = new Map();

    this.state = {
      timeScale: null,
      articles: new Map(),
      isAnimating: false,
      isMovingPanel: false,
      originY: this.props.originY || 0
      // gradLegends: new Map()
      //...this.getTimeRangeAndScale()
    };

    this.lastDiscreteEventTime = new Date().getTime();
  }

  componentDidMount() {
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

    this.setState({
      timeScale: timeScale,
      articles: articleProxies
    });

    // test sur l'intersectionObserver
    this.observerOptions = {
      root: document.getElementById("#hg-map-container"),
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    };
    //console.clear();
  }

  getTimeScale(hInterval, bounds) {
    const { marginWidth } = this.props;

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
    const { hInterval, bounds, articles } = this.props;

    // liste des articles
    let articleProxies = null;
    if (articles !== prevProps.articles) {
      console.log("diff article dans le panel");
      console.log(articles);
      articleProxies = new Map();
        (articles || [])
        .filter(article => true)
        .sort( (a, b) =>{return a.beginHDate.beginDate.getTime() >= b.beginHDate.beginDate.getTime();})
        .forEach(article => {
          articleProxies.set(+article.id, this.state.articles.has(+article.id)?
              this.state.articles.get(+article.id).setArticle(article):new HistoProxy(article));
        });
      this.setState({ articles: articleProxies });
      //console.log(articleProxies);
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
  }

  updateHInterval() {
    const { hInterval, bounds } = this.props;

    const currentTime = new Date().getTime();
    const timeScale = this.getTimeScale(hInterval, bounds);

    if (new Date().getTime() >= this.animationData.nextTime) {
      this.setState({ timeScale: timeScale });
    }
    this.runAnimationIfNeeded(timeScale);
    this.manageCollisions();
  }

  /*shouldComponentUpdate(prevProps, prevState) {
    return true;
    const oldBounds = prevProps.bounds;
    const bounds = this.props.bounds;
    //console.log("should update ?");

    const shouldUpdate =
      bounds !== oldBounds ||
      prevProps.path !== this.props.path ||
      bounds.height !== oldBounds.height;

    //console.log(shouldUpdate);

    return shouldUpdate;
  }*/

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
      console.log("onPanelMoveBegin");

      this.setState({
        isMovingPanel: true,
        initialMovePanelPosition: initialPosition,
        initialMovePanelDate: initialMovePanelDate,
        initialHInterval: this.props.hInterval.clone(),
        initialTimeScale: this.state.timeScale,
        initialOriginY: this.state.originY
      });
      console.log(`initialDate : ${initialMovePanelDate}`);
      window.addEventListener("mousemove", this.onPanelMove);
    }
  }

  onPanelMove(e) {
    //console.log("onPanelMove");
    e.preventDefault();
    e.stopPropagation();
    const position = { x: e.clientX, y: e.clientY };
    // positions are inverted due to our UX pattern
    const delta = vectorDiff(position, this.state.initialMovePanelPosition);

    const { setHInterval } = this.props;
    const {
      initialMovePanelDate,
      initialHInterval,
      initialTimeScale
    } = this.state;

    const dateDelta = this.state.initialTimeScale.invert(position.x);
    const dayDelta = dU.dayDiff(initialMovePanelDate, dateDelta);

    const yDelta = this.state.initialMovePanelPosition.y - position.y;

    /*console.log(
      `position : ${
        position.x
      } , dateDelta : ${dateDelta}, dayDelta : ${dayDelta}`
    );*/

    const newHInterval = initialHInterval.clone().addDay(dayDelta);
    this.setState({ originY: this.state.initialOriginY + yDelta });
    setHInterval(newHInterval);
  }

  onPanelMoveEnd(e) {
    console.log("on panel move end");
    e.preventDefault();
    e.stopPropagation();

    const initialPosition = { x: e.clientX, y: e.clientY };
    const initialMovePanelDate = this.state.timeScale.invert(initialPosition.x);

    const currentTime = new Date().getTime();
    console.log(currentTime - this.lastDiscreteEventTime);
    /*if (currentTime < this.lastDiscreteEventTime + 200) {
      console.log(
        `panel top y : ${this.panelRef.getBoundingClientRect().bottom -
          this.panelRef.getBoundingClientRect().height}`
      );
      this.props.addArticle(
        initialMovePanelDate,
        -(
          this.panelRef.getBoundingClientRect().bottom -
          this.panelRef.getBoundingClientRect().height
        ) +
          initialPosition.y +
          this.state.originY
      );
      console.log("new articles !");
    }*/

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

  addBox(boxRef,article){
     const sameBoxAsBefore = (this.boxRefs.has(+article.id) && this.boxRefs.get(+article.id).boxRef===boxRef);
      if(sameBoxAsBefore) return;
      //console.log(`addBox form article ${article.title},same as before : ${sameBoxAsBefore}`);
     //console.log(boxRef);
     const nodeBox = boxRef.getBBox();
     //console.log(nodeBox);

     this.boxRefs.set(+article.id,
         {
         boxRef:boxRef,
         y:article.y,
             title:article.title,
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
            checkIndex.push([k,v.y]);
          }
      );
      // then sort it from upper to lower y
      checkIndex.sort((a,b)=>{return a[1]>=b[1]?1:-1});
      //console.log(checkIndex);
      // let's then use this index to iterate on boxRefs
      let actionCount=0;
      for (let i=0;i<checkIndex.length;i++){
          let mainId = checkIndex[i][0];
          let mainBoxRef = this.boxRefs.get(mainId);
          // first we aggregate all data to compute deltaY for the mainBoxRef
          let maxDelta =null;
          Object.entries(mainBoxRef.collisions).forEach((v,k) =>{
                  //console.log(v);
                  maxDelta = max(maxDelta,+v[1]);
              }
          );
          if(maxDelta === null) {maxDelta = 0;}
          else {
              maxDelta +=mainBoxRef.deltaY;
          }

          if(maxDelta > mainBoxRef.deltaY){
              mainBoxRef.deltaY = max(0,maxDelta);
              actionCount+=1;
          }
          else if(mainBoxRef.deltaY>0 && maxDelta<mainBoxRef.deltaY){
              mainBoxRef.deltaY = max(0,maxDelta);
              actionCount+=1;
          }
          //console.log(`${mainBoxRef.title} maxDelta ${maxDelta} vs deltaY ${mainBoxRef.deltaY}`);
          mainBoxRef.isTested = true;

          // then we test if lower elements collide our main box
          for (let j=i+1;j<checkIndex.length;j++){
              let lowerId = checkIndex[j][0];
              let lowerBoxRef = this.boxRefs.get(lowerId);
              let collision = nodesCollide(mainBoxRef.boxRef,lowerBoxRef.boxRef,2);
              if(collision !== null){
                  //console.log(`${mainBoxRef.title} on ${lowerBoxRef.title}, collision ${collision}`);
              }

              if(!lowerBoxRef.isTested && collision!==null){
                  //console.log(`${mainBoxRef.title} on ${lowerBoxRef.title}, collision ${collision}`);
                  lowerBoxRef.collisions[mainId] = collision;// + mainBoxRef.deltaY;
                  //lowerBoxRef.deltaY = max(lowerBoxRef.deltaY,collision + mainBoxRef.deltaY);

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

  render() {
    const bounds = this.props.bounds;
    const strokeSize = 1;
    const { timeScale, articles,originY } = this.state;

    const arrayOfArticlesToDisplay = Array.from(this.state.articles).filter(
      ([id, a]) => {
        return true;
      }
    );
    /*console.log("lol");
    console.log(articles);
    console.log(arrayOfArticlesToDisplay);*/

    /*<PosedCircle
          key={`histo-article-circle-${a.id}`}
          id={`histo-article-circle-${a.id}`}
          cx={x}
          cy={y - this.state.originY}
          r={9}
          style={{
            transform: "none",
            fill: "rgb(0,0,0)",
            strokeOpacity: 0,
            strokeWidth: 0
          }}*/

    const articleCircles = arrayOfArticlesToDisplay.map(([id, a]) => {
      /*const x = timeScale(a.beginHDate.beginDate);
      const y = a.currentY;*/
      return (
        <HBExplorerPanelArticle
          key={`histo-article-${a.id}`}
          selected={this.props.selected.includes(+a.id)}
          onPanelMoveEnd={this.onPanelMoveEnd} // to prevent some panel events when action on an article is performed
          selectArticle={this.props.selectArticle}
          cursorDate = {this.props.cursorDate}
          article={a}
          timeScale={timeScale}
          originY={originY}
          addBox={this.addBox}
          /*ref={node => {
            if (
              typeof this.articleRefs.get(a.id) === "undefined" ||
              !this.articleRefs.get(a.id).circleRef
            ) {
              let newRef = null;
              let hasMadeNewRef = false;
              if (typeof this.articleRefs.get(a.id) === "undefined") {
                newRef = new ArticleRef(a);
                hasMadeNewRef = true;
              } else newRef = this.articleRefs.get(a.id);
              newRef.circleRef = node;
              newRef.circleStyler = styler(node);
              if (hasMadeNewRef) this.articleRefs.set(a.id, newRef);
            }
          }}*/
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
          <PoseGroup>{articleCircles}</PoseGroup>
        </g>
          <path id="arc"
                d="M 30 100 A 70 70 0 1 1 30 100"
                style={{
                    stroke:"#13710c",
                    strokeWidth:"8px",
                    fill:"none"
                }}
          />
      </svg>
    );
  }
}

//<text x="0" y="15" fill="red">
//  I love SVG !
//          </text>
//  <circle cx="240" cy="80" r="25" fill="black" />
//  <circle cx="60" cy="60" r="25" fill="black" />
