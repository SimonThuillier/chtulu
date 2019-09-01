import React from "react";
import HBMap from "../auth/organisms/HBMap.jsx";

const styles = {
  position: "absolute",
  zIndex: 10,
  border: "1px dotted black"
};

export default class MapContainer extends React.Component {
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
      currentStyle.width = bounds.width;
      currentStyle.height = bounds.height;
    } else {
      currentStyle.left = bounds.width - side;
      currentStyle.top = bounds.height - 10- side;
      currentStyle.width = side;
      currentStyle.height = side -10 ;
    }

    return (
      <div style={currentStyle}>
        <HBMap
          width={currentStyle.width}
          height={currentStyle.height}
          isResizing={this.props.isResizing}
        />
      </div>
    );
  }
}
