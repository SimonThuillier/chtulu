import styled from "styled-components";
import React from "react";

import { vectorDiff } from "../util/geometry";
import AppContext from "../util/AppContext";

const getThickness = isResizing => {
    return isResizing ? 200 : 6;
};

const getOpacity = (isResizing, isHovered) => {
    return isResizing ? 0 : isHovered ? 0 : 0;
};

const getCursor = placementType => {
    return placementType === "bottom" || placementType === "top"
        ? `row-resize`
        : `col-resize`;
};

const Bar = styled.div`
  overflow: hidden;
  position: absolute;
  float: left;
  z-index: 10000;
  background: #777;
  opacity: ${({ isResizing }) => getOpacity(isResizing, false)};
  padding: 0px;
  border-radius: 3px;
  cursor: ${({ placementType }) => getCursor(placementType)};
  :hover {
    opacity: ${({ isResizing }) => getOpacity(isResizing, true)};
  }
`;

class ResizeBar extends React.Component {
    constructor(props) {
        super(props);

        this.barRef = React.createRef();
        this.toggleResize = this.toggleResize.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onDragBegin = this.onDragBegin.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.state = {
            isResizing: false
        };

        this.beginMousePosition = null;
    }

    toggleResize(){
        this.setState({isResizing:!this.state.isResizing});
        console.log("toggle resize");
    }

    onWindowResize(){
        this.toggleResize();
        setTimeout(this.toggleResize,800);
    }

    componentDidMount(){
        console.log("create resizebar");
        window.addEventListener('resize', this.onWindowResize);
        this.onWindowResize();
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.onWindowResize);
    }

    onDragBegin(e) {
        if (!this.state.isResizing) {
            const { placementType, onMove } = this.props;
            e.preventDefault();
            e.stopPropagation();
            this.beginMousePosition = { x: e.clientX, y: e.clientY };

            this.setState({ isResizing: true });

            const interestingMousePosition = ["bottom", "top"].includes(placementType)
                ? this.beginMousePosition.y
                : this.beginMousePosition.x;

            onMove(interestingMousePosition, "begin");

            window.addEventListener("mousemove", this.onDrag);
            window.addEventListener("mouseup", this.onDragEnd);

            //console.log("resize bar activée !");
        }
    }

    onDrag(e) {
        const { onMove, placementType } = this.props;
        const mousePosition = { x: e.clientX, y: e.clientY };
        const dist = vectorDiff(this.beginMousePosition, mousePosition);

        const delta = ["bottom", "top"].includes(placementType) ? dist.y : dist.x;
        onMove(delta);
    }

    onDragEnd(e) {
        if (this.state.isResizing) {
            this.onDrag(e);
            e.preventDefault();
            e.stopPropagation();

            window.removeEventListener("mousemove", this.onDrag);
            window.removeEventListener("mouseup", this.onDragEnd);
            this.setState({ isResizing: false });
            this.beginMousePosition = null;
            //console.log("resize bar terminée !");
        }
    }

    render() {
        const yOffset = (document.getElementById("main-header") && document.getElementById("main-header").getBoundingClientRect())?
            document.getElementById("main-header").getBoundingClientRect().height:0;
        const xOffset = (document.getElementById("main-sidebar") && document.getElementById("main-sidebar").getBoundingClientRect())?
            document.getElementById("main-sidebar").getBoundingClientRect().width:0;


        const { isResizing } = this.state;
        const { placementType} = this.props;

        // console.log(sidebarWidth);

        let style = {};
        Object.assign(style, this.props.style || {});
        style[placementType] = style[placementType] - getThickness(isResizing) / 2;

        if (placementType === "bottom") {
            style.height = `${getThickness(isResizing)}px`;
            //console.log(style);
            style.left = style.left -xOffset;


        } else if (placementType === "right") {
            style.width = `${getThickness(isResizing)}px`;
            style.top = style.top - yOffset;
            //console.log(style);
        }

        return (
            <Bar
                ref={this.barRef}
                onMouseDown={this.onDragBegin}
                placementType={placementType}
                style={style}
                isResizing={isResizing}
            />
        );
    }
}
ResizeBar.contextType= AppContext;

export default  (props) => {
    return (
        <AppContext.Consumer>
            {({sidebarWidth}) => (
                <ResizeBar {...props} sidebarWidth={sidebarWidth} />
            )}
        </AppContext.Consumer>
    );
};