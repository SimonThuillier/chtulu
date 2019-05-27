import React from "react";
import dU from "../util/date";
import HDate from "../util/HDate";

import { LEFT, RIGHT } from "../util/geometry";

import { Button, Glyphicon } from "react-bootstrap";

export default (props) => {
    
    const {hInterval,setHInterval,invisibles,
        onTimeTravelBegin,onTimeTravelEnd,
        onTimeZoomingBegin,onTimeZoomingEnd,
        toggleContent,displayContent} = props;


    return (
        <div className="hg-menu">
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
                    onTimeTravelBegin(e, -1);
                }}
                onMouseUp={onTimeTravelEnd}
            >
              <Glyphicon glyph="arrow-left" />
            </Button>
          </span>
            <span>
            <Button
                onMouseDown={e => {
                    onTimeZoomingBegin(e, -1);
                }}
                onMouseUp={onTimeZoomingEnd}
            >
              <Glyphicon glyph="zoom-out" />
            </Button>
            <Button
                onMouseDown={e => {
                    onTimeZoomingBegin(e, 1);
                }}
                onMouseUp={onTimeZoomingEnd}
            >
              <Glyphicon glyph="zoom-in" />
            </Button>
          </span>
            <span>
            <Button
                onMouseDown={e => {
                    onTimeTravelBegin(e, 1);
                }}
                onMouseUp={onTimeTravelEnd}
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
                 onClick={toggleContent}
             >
              {displayContent ? (
                  <Glyphicon glyph="eye-close" />
              ) : (
                  <Glyphicon glyph="eye-open" />
              )}
            </Button>
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

        </div>
    );






};

