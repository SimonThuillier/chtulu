import React from "react";
import {domRectEquals} from "../util/geometry";

/**
 * HoC that Measures the element's bounding box and then renders children within
 */
class MeasureAndRender extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      measurement: null,
      hasMeasured: false
    };
  }

  componentDidMount() {
    this.setState({
      measurement: this.el.getBoundingClientRect(),
      hasMeasured: true
    });
    //window.addEventListener("resize", this.props.onWindowResize);
  }

  componentDidUpdate(prevProps){
      /*const {measurement=null} = this.props;
      const {prevMeasurement=null} = prevProps;


      if(measurement !== null && (prevMeasurement ===null || !domRectEquals(measurement,prevMeasurement))){
          this.setState({measurement:measurement});
      }*/

      const {updaterVar=null} = this.props;
      const {updaterVar:oldUpdaterVar=null} = prevProps;

        console.log(`measureAndRender ${updaterVar} vs ${oldUpdaterVar}`);
      if(this.state.hasMeasured && oldUpdaterVar !==null && updaterVar !== oldUpdaterVar){
          this.setState({measurement:this.el.getBoundingClientRect()});
      }
  }

  componentWillUnmount() {
    // stop listening to window resize
    //window.removeEventListener("resize", this.props.onWindowResize);
  }

  render() {
    let style = {};
    if (this.props.stretch) {
      style.position = "absolute";
      style.height = "100%";
      style.width = "100%";
      style.top = 0;
      style.right = 0;
      style.bottom = 0;
      style.left = 0;
    }

    return (
      <div
        style={style}
        ref={node => {
          this.el = node;
        }}
      >
        {this.state.hasMeasured && this.props.children(this.state.measurement)}
      </div>
    );
  }
}

export default MeasureAndRender;
