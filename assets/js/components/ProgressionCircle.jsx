import React from "react";


const style = {
  stroke: "#000000",
  strokeWidth: "4px",
  fill: "none"
};

class ProgressionCircle extends React.Component {
  constructor(props) {
    super(props);

    this.transitionRate = this.transitionRate.bind(this);

    this.state = {
      //rate: this.props.rate,
      ongoingAnimation: false
    };
  }

  transitionRate() {
    const { period } = this.props;
    const { rate } = this.state;
    const { ceil } = Math;

    if (typeof period !== "undefined" && period !== null && period > 0) {
      const animationStep = 0.02;
      const animationPeriod = ceil(period * animationStep);
      const newRate = (rate + animationStep) % 1;
      this.setState({ rate: newRate, ongoingAnimation: true });
      setTimeout(this.transitionRate, animationPeriod);
    } else {
      this.setState({ ongoingAnimation: false });
    }
  }

  componentDidUpdate(prevProps) {
    /*const { oldRate } = prevProps;
    const { period = 0, rate } = this.props;

    if (oldRate !== rate) {
      this.setState({ rate: this.props.rate });
    }
    if (period > 0 && !this.state.ongoingAnimation) {
      //this.transitionRate();
    }*/
  }

  componentDidMount() {
    const { period } = this.props;

    if (typeof period !== "undefined" && period !== null && period > 0) {
      //this.transitionRate();
    }
  }

  render() {
    const {
      cx,
      cy,
      r,
      startAngle = Math.PI / 2,
      sense = -1,
      staticRate = 0,
        key = 'vanilla',
    } = this.props;

    const { rate } = this.props;

    const { PI, cos, sin, round, abs, max, min } = Math;

    const finalRate = staticRate + (1 - staticRate) * rate;

    let quadCounter = finalRate;
    let quadNumber = 0;
    let thisQuadRate = 0;
    // let currentAngle = 0;
    let theta1 = 0;
    let theta2 = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let quadrans = [];
    let initialAngle = startAngle;
    let pathD = "";

    while (quadCounter > 0) {
      thisQuadRate = min(quadCounter, 0.25);
      if (sense === -1) {
        theta1 = initialAngle - 2 * PI * thisQuadRate;
        theta2 = initialAngle;
        initialAngle = theta1;
      } else {
        theta1 = initialAngle;
        theta2 = initialAngle + 2 * PI * thisQuadRate;
        initialAngle = theta2;
      }

      x1 = round(cx + r * cos(theta1));
      y1 = round(cy - r * sin(theta1));
      x2 = round(cx + r * cos(theta2));
      y2 = round(cy - r * sin(theta2));
      pathD = `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`;

      quadrans.push(<path key={`${key}-${quadNumber}`} style={style} d={pathD} />);

      quadNumber += 1;
      quadCounter -= thisQuadRate;
    }

    return (
        <g>{quadrans}</g>
    );
  }
}

export default ProgressionCircle;

