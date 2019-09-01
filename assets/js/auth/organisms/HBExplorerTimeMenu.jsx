import React from "react";
import dU from "../../util/date";
import HDate from "../../util/HDate";
import HBExplorerDateInput from "../molecules/HBExplorerDateInput";
import { LEFT, RIGHT } from "../../util/geometry";

import { Button, Glyphicon } from "react-bootstrap";
import debounce from "debounce";
import {getIntegratedSpeed} from "../../util/explorerUtil";

const timeTravellingPeriod = 20;
/* proportion of hInterval travelled by second */
const timeTravellingPace = 0.1;
/* proportion of initial hInterval zoomed by second */
const timeZoomingPace = 1.075;
const timeZoomingTurbo = 1.5;
const timeTravellingAcceleration = 1.4; // by second
const timeFirstTravelDuration = 250;

export default class HBExplorerTimeMenu extends React.Component {
    constructor(props) {
        super(props);

        // ### time travel functions
        this.onTimeTravelBegin = this.onTimeTravelBegin.bind(this);
        this.onTimeTravel = debounce(
            this.onTimeTravel.bind(this),
            Math.floor(0.9 * timeTravellingPeriod)
        );
        this.onTimeTravelEnd = this.onTimeTravelEnd.bind(this);

        // ### time zooming functions
        this.onTimeZoomingBegin = this.onTimeZoomingBegin.bind(this);
        this.onTimeZooming = debounce(
            this.onTimeZooming.bind(this),
            Math.floor(0.9 * timeTravellingPeriod)
        );
        this.onTimeZoomingEnd = this.onTimeZoomingEnd.bind(this);

        this.state={
            initialTimeTravelInterval:null,
            timeTravelBeginTime:null,
            isTimeTravelling:0,
            isTimeZooming:0,
        };

    }


    onTimeTravelBegin(e, sense = -1) {
        const {hInterval,setHInterval} = this.props;

        if (this.state.isTimeTravelling === 0) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onTimeTravelEnd);
            console.log("beginning of the time travel ...");
            //const startDelay = 5;
            this.setState({
                isTimeTravelling: sense,
                timeTravelBeginTime: new Date().getTime(),
                initialTimeTravelInterval: hInterval.clone()
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
        const {hInterval,setHInterval} = this.props;

        if (isTimeTravelling !== 0) {
            const currentTime = new Date().getTime();

            const addedDays = Math.floor(
                +isTimeTravelling *
                initialTimeTravelInterval.getIntervalSize() *
                timeTravellingPace *
                getIntegratedSpeed(
                    timeTravellingAcceleration,
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

            setHInterval(newHInterval);
            setTimeout(this.onTimeTravel, 0.9 * timeTravellingPeriod);
        }
    }

    onTimeTravelEnd(e) {
        const {hInterval,setHInterval} = this.props;

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


    onTimeZoomingBegin(e, sense = -1) {
        const {hInterval,setHInterval} = this.props;

        if (this.state.isTimeZooming === 0) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onTimeZoomingEnd);
            console.log("beginning of the time zooming ...");
            this.setState({
                isTimeZooming: sense,
                timeTravelBeginTime: new Date().getTime(),
                initialTimeTravelInterval: hInterval.clone()
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
        const {hInterval,setHInterval} = this.props;

        if (isTimeZooming !== 0) {
            const currentTime = new Date().getTime();

            const rawFactor =
                1 +
                timeZoomingPace *
                getIntegratedSpeed(
                    timeTravellingAcceleration,
                    (currentTime - timeTravelBeginTime) / 1000
                );

            let zoomFactor = +isTimeZooming > 0 ? 1 / rawFactor : rawFactor;
            zoomFactor = Math.pow(zoomFactor, timeZoomingTurbo);
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
            setHInterval(newHInterval);

            setTimeout(this.onTimeZooming, timeTravellingPeriod);
        }
    }

    onTimeZoomingEnd(e) {
        const {hInterval,setHInterval,invisibles} = this.props;

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

    render(){

        const {hInterval,setHInterval,invisibles} = this.props;

        return(<div className="hg-menu">
            <Button
                onClick={e => {
                    const leftMargin = Math.max(
                        Math.ceil(
                            dU.dayDiff(
                                invisibles[RIGHT].maxDate,
                                invisibles[LEFT].minDate
                            ) * 0.05
                        ),
                        3
                    );

                    const newHInterval = new HDate(
                        "2",
                        dU.addDay(dU.clone(invisibles[LEFT].minDate), -leftMargin),
                        dU.clone(hInterval.endDate)
                    );
                    setHInterval(newHInterval);
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
                    let newHInterval = hInterval.clone();
                    newHInterval = newHInterval
                        .setType("2")
                        .addDay(-Math.floor(newHInterval.getIntervalSize() / 2));
                    setHInterval(newHInterval);
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
                <HBExplorerDateInput
                    setHInterval={setHInterval}
                    input={hInterval}
                />
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
                    let newHInterval = hInterval.clone();
                    newHInterval = newHInterval
                        .setType("2")
                        .addDay(Math.floor(newHInterval.getIntervalSize() / 2));
                    setHInterval(newHInterval);
                }}
            >
              <Glyphicon glyph="forward" />
            </Button>
          </span>
            <span>
            <Button
                onClick={e => {
                    const rightMargin = Math.max(
                        Math.ceil(
                            dU.dayDiff(
                                invisibles[RIGHT].maxDate,
                                invisibles[LEFT].minDate
                            ) * 0.05
                        ),
                        3
                    );

                    const newHInterval = new HDate(
                        "2",
                        dU.clone(hInterval.beginDate),
                        dU.addDay(dU.clone(invisibles[RIGHT].maxDate), rightMargin)
                    );
                    setHInterval(newHInterval);
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
          </span>

        </div>);


    }
};

