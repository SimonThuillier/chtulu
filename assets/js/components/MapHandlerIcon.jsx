import React from "react";
import { Button, Glyphicon } from "react-bootstrap";

const styles = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 20,
  width: 16,
  height: 16,
  backgroundColor: "rgba(225, 225, 225, .75)"
};

export default class MapHandlerIcon extends React.Component {
  shouldComponentUpdate(prevProps) {
    const oldBounds = prevProps.bounds;
    const bounds = this.props.bounds;
    const side = this.props.side;
    const fullMode = this.props.fullMode;

    const shouldUpdate =
      bounds !== oldBounds ||
      prevProps.path !== this.props.path ||
      bounds.height !== oldBounds.height ||
      side !== prevProps.side ||
      fullMode !== prevProps.fullMode;

    //console.log(shouldUpdate);

    return shouldUpdate;
  }

  render() {
    const bounds = this.props.bounds;
    const side = this.props.side;
    const fullMode = this.props.fullMode;

    let currentStyle = { ...styles };

    if (fullMode) {
      currentStyle.left = 0;
      currentStyle.top = 0;
    } else {
      currentStyle.left = bounds.width - side - currentStyle.width / 2 + 1;
      currentStyle.top = bounds.height - side - currentStyle.height / 2;
    }

    return (
      <div style={currentStyle}>
        <Glyphicon
          glyph="fullscreen"
          onMouseDown={this.props.onDragBegin}
          onClick={this.props.onDragEnd}
        />
      </div>
    );
  }
}
