/**
 * @package HTimeGrad.js
 * @doc HTimeGrad.js :
 */
import cmn from "./common";
import date from "./date";

/** make the idGenerator for graduations */
let _idGenerator = cmn.getIdGenerator();
let idFormatter = date.getFormatterFromPattern("Ymd");
/** animations time (ms) */
/*let _animationTime = 300;
let _gradMinHeight = 15;
let _gradMaxHeight = 25;

let _opacity = d3
  .scaleLinear()
  .domain([-100000, 0, 5, 8, 92, 95, 100, 100000])
  .range([0, 0, 0.5, 1, 1, 0.5, 0, 0]);*/

/**  make the date formatters functions according to different type/major */
let _formatDateFunctions = [
  {
    type: "day",
    major: 1,
    formatter: date.getFormatterFromPattern("Dj/m")
  },
  {
    type: "day",
    major: 0,
    formatter: date.getFormatterFromPattern("Dd")
  },
  {
    type: "day",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "week",
    major: 1,
    formatter: date.getFormatterFromPattern("M")
  },
  {
    type: "week",
    major: 0,
    formatter: date.getFormatterFromPattern("Dd")
  },
  {
    type: "week",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "month",
    major: 1,
    formatter: date.getFormatterFromPattern("Y")
  },
  {
    type: "month",
    major: 0,
    formatter: date.getFormatterFromPattern("M")
  },
  {
    type: "month",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "year",
    major: 1,
    formatter: date.getFormatterFromPattern("Y")
  },
  {
    type: "year",
    major: 0,
    formatter: date.getFormatterFromPattern("y")
  },
  {
    type: "year",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "decade",
    major: 1,
    formatter: date.getFormatterFromPattern("Y")
  },
  {
    type: "decade",
    major: 0,
    formatter: date.getFormatterFromPattern("y")
  },
  {
    type: "decade",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "century",
    major: 1,
    formatter: date.getFormatterFromPattern("Y")
  },
  {
    type: "century",
    major: 0,
    formatter: date.getFormatterFromPattern("c")
  },
  {
    type: "century",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "millennium",
    major: 1,
    formatter: date.getFormatterFromPattern("Y")
  },
  {
    type: "millennium",
    major: 0,
    formatter: date.getFormatterFromPattern("c")
  },
  {
    type: "millennium",
    major: -1,
    formatter: function() {
      return "";
    }
  },
  {
    type: "id",
    major: 0,
    formatter: date.getFormatterFromPattern("d_m_Y")
  }
];

/**  callback function to find the adhoc formatter function */
let _findFormatDateFunction = function(thisType, thisMajor) {
  return _formatDateFunctions.find(function(functionArray) {
    return functionArray.type === thisType && functionArray.major === thisMajor;
  }).formatter;
};

/**
 * @doc
 * @module hb/util/HTimeGrad
 * @class hb.util.HTimeGrad
 */
let HTimeGrad = function(
  date,
  type,
  major,
  minorAreaEndDate = null,
  majorAreaEndDate = null
) {
  this.date = date;
  this.id = _idGenerator();
  this.type = type;
  this.major = major;
  this.minorAreaEndDate = minorAreaEndDate;
  this.majorAreaEndDate = majorAreaEndDate;
};

Object.assign(HTimeGrad.prototype, {
  getLegend: function() {
    return _findFormatDateFunction(this.type, this.major)(this.date);
  }
});

export default HTimeGrad;
