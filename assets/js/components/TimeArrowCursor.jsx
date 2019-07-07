import React from "react";
import { scaleTime } from "d3-scale";
const Radium = require('radium').default; // CHANGED: Must add `.default`
const { Style } = require('radium');
import dateUtil from "../util/date";
import trans from "../util/translation";

const dateFormatter = dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["1"]);

const textStyle = {
    fontFamily: "Times new roman",
    fontSize  : 14,
    fontWeight:"lighter",
    stroke     : "#000000",
    fill       : "#000000"
};

const cursorStyle = {
    fill: "DarkSlateGray",
    strokeWidth: 3,
    zIndex: 20,
    stroke:"none",
    ':hover': {
        stroke:"yellow",
        cursor: 'grab'
    },
    '.active': {
        stroke:"yellow"
    },
};

class TimeArrowCursor extends React.Component {
    constructor(props) {
        super(props);

        this.onCursorDragBegin = this.onCursorDragBegin.bind(this);
        this.onCursorDrag = this.onCursorDrag.bind(this);
        this.onCursorDragEnd = this.onCursorDragEnd.bind(this);

        const {cursorRate,width,marginWidth} = this.props;

        this.state = {
            isDraggingCursor: false,
            initialDragCursorPosition:null,
            initialCursorRate:cursorRate,
            initialWidth:width-marginWidth
        };
    }

    componentDidMount() {
    }



    onCursorDragBegin(e) {
        if (!this.state.isDraggingCursor) {
            e.preventDefault();
            e.stopPropagation();
            window.addEventListener("mouseup", this.onCursorDragEnd);
            //console.log("onCursorDragBegin");
            const initialPosition = { x: e.clientX, y: e.clientY };
            const {cursorRate,width,marginWidth} = this.props;
            this.setState({
                isDraggingCursor: true,
                initialDragCursorPosition: initialPosition,
                initialCursorRate: cursorRate,
                initialWidth:width-marginWidth
            });
            window.addEventListener("mousemove", this.onCursorDrag);
        }
    }

    onCursorDrag(e) {
        //console.log("onCursorDrag");
        e.preventDefault();
        e.stopPropagation();

        const {setCursorRate,toggleCursor} = this.props;
        const {initialDragCursorPosition,initialCursorRate,initialWidth} = this.state;
        const {max,min} = Math;

        const position = { x: e.clientX, y: e.clientY };
        // positions are inverted due to our UX pattern
        const deltaX = position.x- initialDragCursorPosition.x;

        const relativeDelta = deltaX/initialWidth;

        const newCursorRate = min(max(initialCursorRate + relativeDelta,0),1);

        //console.log(`onCursorDrag : ${deltaX} , ${relativeDelta} , ${newCursorRate}`);
        setCursorRate(newCursorRate);
    }

    onCursorDragEnd(e) {
        if (this.state.isDraggingCursor) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("mousemove", this.onCursorDrag);
            //console.log("onCursorDragEnd");
            window.removeEventListener("mouseup", this.onCursorDragEnd);
            this.setState({
                isDraggingCursor: false,
                initialCursorRate: null
            });
        }
    }

    render() {
        const {isDraggingCursor} = this.state;
        const {cursorRate,cursorDate,width,height,marginWidth,onMouseDown,onMouseUp} = this.props;

        const cursorDateLabel = dateFormatter(cursorDate);
        //console.log(`cursorDate : ${cursorDateLabel}`);

        const cursorMaxWidth=3;
        const cursorMinWidth=20;
        const cursorHeight=18;

        const cursorPath = `M${(width - marginWidth)*cursorRate-cursorMaxWidth/2},${height} 
      L${(width - marginWidth)*cursorRate-cursorMinWidth/2},${height - cursorHeight}
      L${(width - marginWidth)*cursorRate+cursorMinWidth/2},${height - cursorHeight}
      L${(width - marginWidth)*cursorRate+cursorMaxWidth/2},${height} 
      Z`;

        /*console.log(width);
        console.log(cursorRate);*/

        /*let style ={};
        Object.assign(style,cursorStyle);
        if(isDraggingCursor) style.stroke="Yellow";*/

        const labelX = (cursorRate<0.5)?((width - marginWidth)*cursorRate+cursorMinWidth/2+3):
            ((width - marginWidth)*cursorRate-cursorMinWidth/2-3-cursorDateLabel.length*7);

        return (
            <g>
                <text
                    textAnchor="start"
                    x={labelX}
                    y={height-cursorHeight/2+3}
                    style={textStyle}
                >
                    {cursorDateLabel}
                </text>
                <path
                    className={isDraggingCursor?'active':null}
                    onMouseDown={this.onCursorDragBegin}
                    style={cursorStyle}
                    vectorEffect="non-scaling-stroke"
                    d={cursorPath}
                />
            </g>

        );
    }
}

export default Radium(TimeArrowCursor);
