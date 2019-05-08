/**
 * @package HTimeRange.js
 * @doc HTimeRange.js :
 */
import date from "./date";
import HDate from "./HDate";
import HTimeGrad from "./HTimeGrad";

let _getTypeFromHDate = function(hDate) {
  let dayCount = hDate.getIntervalSize();
  if (dayCount < 50) {
    return "day";
  } else if (dayCount < 210) {
    return "week";
  } else if (dayCount < 1500) {
    return "month";
  } else if (dayCount < 20000) {
    return "year";
  } else if (dayCount < 200000) {
    return "decade";
  } else if (dayCount < 2000000) {
    return "century";
  } else {
    return "millennium";
  }
};

/** @doc switcher functions according to type */
let _switchFunctions = [
  { type: "day", switcher: date.switchToNextDay, supType: "week" },
  { type: "week", switcher: date.switchToNextWeek, supType: "month" },
  { type: "month", switcher: date.switchToNextMonth, supType: "year" },
  { type: "year", switcher: date.switchToNextYear, supType: "decade" },
  {
    type: "decade",
    switcher: date.switchToNextDecade,
    supType: "century"
  },
  {
    type: "century",
    switcher: date.switchToNextCentury,
    supType: "millennium"
  },
  {
    type: "millennium",
    switcher: date.switchToNextMillennium,
    supType: "millennium"
  }
];
/** @doc callback function to find the adhoc switcher function and superior type (compound) */
let _findSwitcherFunction = function(thisType) {
  return _switchFunctions.find(function(functionArray) {
    return functionArray.type === thisType;
  });
};

const logFormatter = date.getFormatterFromPattern("d/m/Y");

let _createGrads = function(beginDate, endDate, type) {
  /*console.log("create grads");
  console.log(beginDate);
  console.log(endDate);
  console.log(type);
  console.log(parent);*/
  let compoundSwitcher = _findSwitcherFunction(type);
  type = compoundSwitcher.type;
  let switcher = compoundSwitcher.switcher;
  let supType = compoundSwitcher.supType;
  let supSwitcher = _findSwitcherFunction(supType).switcher;
  // dates to begin with
  let currentDate = switcher(date.clone(beginDate));
  let nextCurrentDate = null;
  let currentMajorDate = supSwitcher(date.clone(beginDate));
  let nextCurrentMajorDate = null;
  let range = [];
  let minorGradMajor = 0; // to allow minor graduations with major -1 (legend undisplayed) if too close to next major graduations
  while (currentDate < endDate || currentMajorDate < endDate) {
    if (type === "week") {
      if (currentDate.getDate() > 27 || currentDate.getDate() < 3) {
        minorGradMajor = -1;
      } else {
        minorGradMajor = 0;
      }
    }
    if (currentDate < currentMajorDate) {
      //console.log(`create m grad for date ${logFormatter(currentDate)}`);
      nextCurrentDate = switcher(date.clone(currentDate), true);
      range.push(
        new HTimeGrad(
          date.clone(currentDate),
          type,
          minorGradMajor,
          date.clone(nextCurrentDate)
        )
      );
      currentDate = nextCurrentDate;
    } else if (currentDate > currentMajorDate) {
      //console.log(`create M grad for date ${logFormatter(currentMajorDate)}`);
      nextCurrentMajorDate = supSwitcher(date.clone(currentMajorDate), true);
      range.push(
        new HTimeGrad(
          date.clone(currentMajorDate),
          type,
          1,
          null,
          date.clone(nextCurrentMajorDate)
        )
      );
      currentMajorDate = nextCurrentMajorDate;
    } else {
      // equal dates
      //console.log(`create M grad for date ${logFormatter(currentMajorDate)}`);
      nextCurrentMajorDate = supSwitcher(date.clone(currentMajorDate), true);
      currentDate = switcher(date.clone(currentDate), true);
      range.push(
        new HTimeGrad(
          date.clone(currentMajorDate),
          type,
          1,
          date.clone(currentDate),
          date.clone(nextCurrentMajorDate)
        )
      );
      currentMajorDate = nextCurrentMajorDate;
    }
  }
  return range;
};

/** @doc function adding/removing graduations according to a new beginDate */
let _handleLeftSide = function(hTimeRange, newBeginDate) {
  /*console.log(hb.util.date.equals(hTimeRange.hDate.beginDate,newBeginDate));
  console.log(hTimeRange.hDate.beginDate);
  console.log(newBeginDate);*/
  if (date.equals(hTimeRange.hDate.beginDate, newBeginDate)) return;
  else if (newBeginDate < hTimeRange.hDate.beginDate) {
    // this case we need to add grads at the beginning of grad array
    let newGrads = _createGrads(
      newBeginDate,
      hTimeRange.hDate.beginDate,
      hTimeRange.type
    );
    hTimeRange.grads = newGrads.concat(hTimeRange.grads);
  } else if (newBeginDate > hTimeRange.hDate.endDate) {
    /*hTimeRange.grads.forEach(function(grad) {
      console.log("remove");
      grad.remove();
    });*/
    hTimeRange.grads = [];
  } else if (newBeginDate > hTimeRange.hDate.beginDate) {
    let index = 0;
    while (hTimeRange.grads[index].date < newBeginDate) {
      /*console.log(
        `removing grad for date ${logFormatter(hTimeRange.grads[index].date)}`
      );*/
      //console.log("remove");
      //hTimeRange.grads[index].remove();
      index++;
    }
    hTimeRange.grads.splice(0, index);
  }
};

/** @doc function adding/removing graduations according to a new endDate */
let _handleRightSide = function(hTimeRange, newEndDate) {
  if (date.equals(hTimeRange.hDate.endDate, newEndDate)) return;
  else if (newEndDate > hTimeRange.hDate.endDate) {
    // this case we need to add grads at the end of grad array
    let newGrads = _createGrads(
      hTimeRange.hDate.endDate,
      newEndDate,
      hTimeRange.type
    );
    hTimeRange.grads = hTimeRange.grads.concat(newGrads);
  } else if (newEndDate <= hTimeRange.hDate.beginDate) {
    /*hTimeRange.grads.forEach(function(grad) {
      grad.remove();
    });*/
    hTimeRange.grads = [];
  } else if (newEndDate < hTimeRange.hDate.endDate) {
    let index = hTimeRange.grads.length - 1;
    while (index >= 0 && hTimeRange.grads[index].date >= newEndDate) {
      /*console.log(
        `removing grad for date ${logFormatter(hTimeRange.grads[index].date)}`
      );*/
      index--;
    }
    hTimeRange.grads.splice(index + 1, hTimeRange.grads.length - 1 - index);
  }
};

/**
 * @doc handles the range of date graduations in a given HDate
 * @module hb/util/HTimeRange
 * @class hb.util.HTimeRange
 */
let HTimeRange = function() {
  this.hDate = null;
  this.type = null;
  this.grads = [];
};

Object.assign(HTimeRange.prototype, {
  /** @doc set interval HDate of the range  */
  setHDate: function(hDate) {
    let newType = _getTypeFromHDate(hDate);
    if (newType === this.type) {
      // add new elements
      //console.log("creer sur les cotes");
      _handleLeftSide(this, hDate.beginDate);
      _handleRightSide(this, hDate.endDate);
      this.hDate = hDate;
    } else {
      // drop old graduations and compute new range
      /*this.grads.forEach(function(grad) {
        grad.remove();
      });*/

      this.hDate = hDate;
      this.type = newType;
      this.grads = _createGrads(hDate.beginDate, hDate.endDate, this.type);
    }
    /*this.grads.forEach(function(grad) {
      grad.updateScale();
    });*/
    return this;
  },
  getHDateFromGrad: function(hGrad) {
    let switcher = _findSwitcherFunction(hGrad.type).switcher;
    let newBeginDate = date.clone(hGrad.date);
    let newEndDate = switcher(date.clone(hGrad.date), true);

    let type = "2";
    switch (hGrad.type) {
      case "month":
        type = "3";
        break;
      case "year":
        type = "5";
        break;
      case "decade":
        type = "6";
        break;
      case "century":
        type = "7";
        break;
      case "millennium":
        type = "8";
        break;
    }
    return new HDate(type, newBeginDate, newEndDate);
  }
});

export default HTimeRange;
