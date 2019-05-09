import React from "react";
import ReactDOM from "react-dom";
import { distance, vectorDiff, LEFT, RIGHT, VERTICAL } from "../util/geometry";

import debounce from "debounce";
import { Button, Glyphicon } from "react-bootstrap";
import HBExplorerDateInput from "./HBExplorerDateInput";

import MeasureAndRender from "./MeasureAndRender";
import TimeArrow from "./TimeArrow.jsx";
import HBExplorerPanel from "./HBExplorerPanel.jsx";
import MapContainer from "./MapContainer.jsx";
import MapHandlerIcon from "./MapHandlerIcon.jsx";

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
    this.addArticle = this.addArticle.bind(this);
    // hInterval setter to provide for children that need it (timeArrow)
    this.setHInterval = this.setHInterval.bind(this);

    // global component resizing functions
    this.onResizingBegin = this.onResizingBegin.bind(this);
    this.onWindowResize = debounce(
      this.onWindowResize.bind(this),
      this.resizingDelay
    );
    this.onResizingEnd = this.onResizingEnd.bind(this);

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

    this.state = {
      /* current time interval of the explorer : 
      must Always be not null and valid 
      */
      hInterval: getConstrainedHInterval(props.hInterval),
      // ### global component resizing
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
      }
    };

  }

  setHInterval(hInterval) {
    const invisibles = getInvisibles(this.state.articles, hInterval);
    this.setState({ hInterval: hInterval, invisibles: invisibles });
  }

  addArticle(date, y) {
    /*let articles = this.state.articles.slice();
    //console.log(Array.isArray(articles));
    const id = _idGenerator();
    const newArticle = { id: id, beginHDate: new HDate("1", date), y: y };

    //console.log(articles);

    articles.push(newArticle);

    this.setState({ articles: articles });*/
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
      console.log(
        `final Interval : ${
          newHInterval.beginDate
        } - ${newHInterval.getMiddleDate()} - ${newHInterval.endDate}`
      );
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
    const hgContainer = document.getElementById("hg-container");
    hgContainer.addEventListener("mousedown", this.onResizingBegin);
    window.addEventListener("mouseup", this.onResizingEnd);
  }

  componentWillUnmount() {
    // stop listening to window mouseup
    window.removeEventListener("mouseup", this.onResizingEnd);
  }

  componentDidUpdate(prevProps) {
      if (!prevProps.hInterval.equals(this.props.hInterval)) {
          const invisibles = getInvisibles(this.props.articles, this.props.hInterval);
          this.setState({
              hInterval: this.props.hInterval,
              invisibles: invisibles
          });
      }
    //console.log(this.timeAreaRef.current.getBoundingClientRect().top);
    //console.log(this.timeAreaRef.current.getBoundingClientRect().bottom);
  }

  onResizingBegin(e) {
    if (!this.state.isResizing) {
      //console.log(e.target);
      //console.log(this.gridRef.getBoundingClientRect());
      const rect = this.gridRef.getBoundingClientRect(); //e.target.getBoundingClientRect();
      const corner = { x: rect.right, y: rect.bottom };
      const mousePosition = { x: e.clientX, y: e.clientY };
      const dist = distance(corner, mousePosition);
      if (dist < 23) {
        //e.preventDefault();
        e.stopPropagation();
        this.setState({ isResizing: true });
        window.addEventListener("mousemove", this.onWindowResize);
        console.log("resizing activé !");
      }
    }
  }

  onWindowResize() {
    this.timeArrowMeasureRef.setState({
      measurement: this.state.timeArrowToResize.getBoundingClientRect()
    });
    console.log("onWindowResize");
    const panelMeasurement = this.state.panelToResize.getBoundingClientRect();
    //console.log(node);
    this.panelMeasureRef.setState({
      measurement: panelMeasurement
    });

    const bounds = panelMeasurement;
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
    const { invisibles } = this.state;

    return (
      <div
        className="hg-container"
        id="hg-container"
        ref={node => {
          this.gridRef = node;
        }}
      >
        <div className="hg-header">header</div>
        <div className="hg-date-input">
          <HBExplorerDateInput
            setHInterval={this.setHInterval}
            input={this.state.hInterval}
          />
        </div>
        <div
          className="hg-time-arrow"
          ref={node => {
            this.timeArrowRef = node;
          }}
        >
          <div style={{ position: "relative", height: "65px" }}>
            {
              <MeasureAndRender
                stretch={true}
                debounce={1}
                onWindowResize={this.onWindowResize}
                ref={node => {
                  this.timeArrowMeasureRef = node;
                }}
              >
                {bounds => {
                  //console.log("test");

                  return (
                    <TimeArrow
                      setHInterval={this.setHInterval}
                      marginWidth={10}
                      bounds={bounds}
                      animationPeriod={Math.ceil(
                        this.timeTravellingPeriod * 1.2
                      )}
                      hInterval={this.state.hInterval}
                    />
                  );
                }}
              </MeasureAndRender>
            }
          </div>
        </div>
        <div className="hg-time-arrow-menu">
          <Button
            onClick={e => {
              let newHInterval = this.state.hInterval.clone();
              const leftMargin = Math.max(
                Math.ceil(
                  dU.dayDiff(
                    invisibles[RIGHT].maxDate,
                    invisibles[LEFT].minDate
                  ) * 0.05
                ),
                3
              );

              newHInterval = new HDate(
                "2",
                dU.addDay(dU.clone(invisibles[LEFT].minDate), -leftMargin),
                dU.clone(this.state.hInterval.endDate)
              );
              this.setHInterval(newHInterval);
            }}
          >
            {invisibles[LEFT].number > 0 ? (
              <span>
                <Glyphicon glyph="arrow-left" />
                <Glyphicon glyph="object-align-left" />
              </span>
            ) : (
              <span>
                <Glyphicon glyph="object-align-left" />
                <Glyphicon glyph="arrow-right" />
              </span>
            )}
            {invisibles[LEFT].number > 0 ? `(${invisibles[LEFT].number})` : ""}
          </Button>
          <span>
            <Button
              onClick={e => {
                let newHInterval = this.state.hInterval.clone();
                newHInterval = newHInterval
                  .setType("2")
                  .addDay(-Math.floor(newHInterval.getIntervalSize() / 2));
                this.setHInterval(newHInterval);
              }}
            >
              <Glyphicon glyph="backward" />
            </Button>
            <Button
              onMouseDown={e => {
                this.onTimeTravelBegin(e, -1);
              }}
              onMouseUp={this.onTimeTravelEnd}
            >
              <Glyphicon glyph="arrow-left" />
            </Button>
          </span>
          <span>
            <Button
              onMouseDown={e => {
                this.onTimeZoomingBegin(e, -1);
              }}
              onMouseUp={this.onTimeZoomingEnd}
            >
              <Glyphicon glyph="zoom-out" />
            </Button>
            <Button
              onMouseDown={e => {
                this.onTimeZoomingBegin(e, 1);
              }}
              onMouseUp={this.onTimeZoomingEnd}
            >
              <Glyphicon glyph="zoom-in" />
            </Button>
          </span>
          <span>
            <Button
              onMouseDown={e => {
                this.onTimeTravelBegin(e, 1);
              }}
              onMouseUp={this.onTimeTravelEnd}
            >
              <Glyphicon glyph="arrow-right" />
            </Button>
            <Button
              onClick={e => {
                let newHInterval = this.state.hInterval.clone();
                newHInterval = newHInterval
                  .setType("2")
                  .addDay(Math.floor(newHInterval.getIntervalSize() / 2));
                this.setState({ hInterval: newHInterval });
              }}
            >
              <Glyphicon glyph="forward" />
            </Button>
          </span>
          <Button
            onClick={e => {
              let newHInterval = this.state.hInterval.clone();
              const rightMargin = Math.max(
                Math.ceil(
                  dU.dayDiff(
                    invisibles[RIGHT].maxDate,
                    invisibles[LEFT].minDate
                  ) * 0.05
                ),
                3
              );

              newHInterval = new HDate(
                "2",
                dU.clone(this.state.hInterval.beginDate),
                dU.addDay(dU.clone(invisibles[RIGHT].maxDate), rightMargin)
              );
              this.setHInterval(newHInterval);
            }}
          >
            {invisibles[RIGHT].number > 0 ? (
              <span>
                <Glyphicon glyph="object-align-right" />
                <Glyphicon glyph="arrow-right" />
              </span>
            ) : (
              <span>
                <Glyphicon glyph="arrow-left" />
                <Glyphicon glyph="object-align-right" />
              </span>
            )}
            {invisibles[RIGHT].number > 0
              ? `(${invisibles[RIGHT].number})`
              : ""}
          </Button>
        </div>
        <div
          className="hg-time-area"
          ref={node => {
            this.panelRef = node;
          }}
        >
          <div
            style={{
              position: "relative",
              resize: "vertical",
              overflow: "none",
              minHeight: "200px"
            }}
          >
            <MeasureAndRender
              stretch={true}
              debounce={1}
              onWindowResize={this.onWindowResize}
              ref={node => {
                this.panelMeasureRef = node;
              }}
            >
              {bounds => {
                //console.log("test2");
                const stroke = 1;
                //{ stroke, className, bounds} = props;
                const path = `M${stroke},${stroke} 
      L${bounds.width - stroke},${stroke}
      L${bounds.width - stroke},${bounds.height - stroke}
      L${stroke},${bounds.height - stroke} 
      Z`;
                //console.log(path);

                return [
                  <HBExplorerPanel
                    key={"hg-time-panel"}
                    bounds={bounds}
                    path={path}
                    articles={this.props.articles}
                    addArticle={this.addArticle}
                    setInvisibles={this.setInvisibles}
                    hInterval={this.state.hInterval}
                    setHInterval={this.setHInterval}
                    animationPeriod={this.timeTravellingPeriod}
                    marginWidth={10}
                  />,
                  <MapContainer
                    key={"hg-map-container"}
                    id={"hg-map-container"}
                    bounds={bounds}
                    isResizing={this.state.isDraggingMap}
                    side={this.state.mapSide}
                    fullMode={this.state.mapFullMode}
                  />,
                  <MapHandlerIcon
                    key={"hg-map-handler-icon"}
                    bounds={bounds}
                    side={this.state.mapSide}
                    fullMode={this.state.mapFullMode}
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
