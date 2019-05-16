/**
 * @package HDate.js
 * @doc common.js : HDate class definition
 * @requires hb.util.cmn,hb.util.date,hb.util.trans
 */

import cmn from "./common";
import dateUtil from "./date";
import trans from "./translation";

let timeZoneOffset = new Date().getTimezoneOffset();
//console.log("timeZoneOffset : " + timeZoneOffset);

let _availableTypes = ["1", "2", "3", "4", "5", "6", "7", "8"];

let _formatters = {
  "1": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["1"]),
  "2": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["2"]),
  "3": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["3"]),
  "4": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["4"]),
  "5": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["5"]),
  "6": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["6"]),
  "7": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["7"]),
  "8": dateUtil.getFormatterFromPattern(trans.FORMAT_STRS["8"])
};

let _intervalFormatter = dateUtil.getFormatterFromPattern(
  trans.FORMAT_INTERVAL_STR
);
let _canonicalFormatters = {
  "1": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["1"]),
  "2": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["2"]),
  "3": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["3"]),
  "4": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["4"]),
  "5": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["5"]),
  "6": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["6"]),
  "7": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["7"]),
  "8": dateUtil.getFormatterFromPattern(trans.FORMAT_CANONICAL_STRS["8"])
};
/**
 * @doc HDate object constructor
 * @class hb.util.HDate
 * @param {string|number} type : "1" - "8"
 * @param {Date} date
 * @param {Date|null} endDate
 * @return {hb.util.HDate}
 */
let HDate = function(type, date, endDate = null) {
  if (Number.isInteger(type)) {
    type = type.toString();
  }
  if (_availableTypes.indexOf(type) === -1) {
    throw "invalid type for HDate";
  }
  this.beginDate = new Date(date.getTime() - timeZoneOffset * 60 * 1000);
  this.endDate =
    endDate !== null
      ? new Date(endDate.getTime() - timeZoneOffset * 60 * 1000)
      : null;
  this.setType(type);
  return this;
};

let _prototype = {
  /**
   * @doc HDate prototype clone function
   * @returns {HDate}
   */
  clone: function() {
    return new HDate(
      this.type,
      dateUtil.clone(this.beginDate),
      dateUtil.clone(this.endDate)
    );
  },
  /**
   * @doc add to a hDate a certain given number of day (accept negative number of day)
   * @param {HDate} hDate
   * @param {int} nbDay
   * @returns {HDate}
   */
  addDay: function(nbDay) {
    //console.log(this.beginDate);
    this.beginDate = dateUtil.addDay(this.beginDate, nbDay);
    //console.log(this.beginDate);
    this.endDate = dateUtil.addDay(this.endDate, nbDay);
    return this;
  },
  /**
   * @doc : determines if two HDates are equals (same types and dates)
   * @param {HDate} hDate
   * @returns {boolean}
   */
  equals: function(hDate) {
    return (
      this.type === hDate.type &&
      this.beginDate === hDate.beginDate &&
      this.endDate === hDate.endDate
    );
  },
  containsDate: function(date) {
    return date >= this.beginDate && date <= this.endDate;
  },
  getMiddleDate: function() {
    const intervalSize = this.getIntervalSize() + 1;
    if (intervalSize < 2) return dateUtil.clone(this.beginDate);
    else
      return dateUtil.addDay(
        dateUtil.clone(this.beginDate),
        Math.floor(intervalSize / 2)
      );
  },
  getBarycenterDate: function(rate) {
      const intervalSize = this.getIntervalSize() + 1;
      if (rate >= 1) return dateUtil.clone(this.endDate || new Date());
      if (rate <= 0) return dateUtil.clone(this.beginDate);
      return dateUtil.addDay(
                dateUtil.clone(this.beginDate),
                Math.floor(intervalSize*rate)
      );
  },
  getRateOfDate : function(date) {
      const {max,min} = Math;
      const beginTime = this.beginDate.getTime();
      const endTime = (this.endDate || new Date()).getTime();

      const dateTime = date.getTime();
      if((endTime - beginTime)<1000) return dateTime>=beginTime;
      return max(min((dateTime - beginTime)/(endTime - beginTime),1),0);
  }  ,
  multiply: function(factor) {
    const { clone, addDay } = dateUtil;
    const newIntervalSize = Math.floor(factor * (this.getIntervalSize() + 1));
    const middleDate = this.getMiddleDate();
    const oneSideLength = Math.floor(newIntervalSize / 2);

    return new HDate(
      this.type,
      addDay(clone(middleDate), -oneSideLength),
      addDay(clone(middleDate), oneSideLength - 1)
    );
  },
  /**
   * @doc : returns the requested bound date : beginDate if 0 and endDate if 1
   * @param {int} bound : 0 or 1
   * @returns {Date}
   */
  getBoundDate: function(bound) {
    if (bound === 0) {
      return this.beginDate;
    } else if (bound === 1) {
      return this.endDate;
    } else {
      return null;
    }
  },
  /**
   * @doc : returns the canonical input for this HDate, eg the input to enter to reparse it
   * @returns {string}
   */
  getCanonicalInput: function() {
    let formatter = _canonicalFormatters[this.type];

    if (this.type === "2") {
      return formatter(this.beginDate) + ";" + formatter(this.endDate);
    } else if (this.type === "4") {
      return formatter(
        dateUtil.switchToNextMonth(dateUtil.clone(this.beginDate))
      );
    } else {
      return formatter(this.beginDate);
    }
  },
  /**
   * @doc : gets the number of days between HDate begin date and end date
   * @returns {int}
   */
  getIntervalSize: function() {
    return dateUtil.dayDiff(this.endDate, this.beginDate);
  },
  /**
   * @doc returns display of the interval for control during user entry
   * @returns {string}
   */
  getIntervalLabel: function() {
    return (
      _intervalFormatter(this.beginDate) +
      " ; " +
      _intervalFormatter(this.endDate)
    );
  },
  /**
   * @doc : determine if the HDate is exact ie its begin and endDate are the same (same day)
   * @returns {boolean}
   */
  isExact: function() {
    if (
      this.beginDate === null ||
      this.endDate === null ||
      typeof this.beginDate === "undefined" ||
      typeof this.endDate === "undefined"
    ) {
      return true;
    }
    return dateUtil.dayDiff(this.endDate, this.beginDate) === 0;
  },
  /**
   * @doc HDate json parser/creator function : returns the HDate generated from its JSON representation
   * @param {string} jsonStr
   * @returns {HDate}
   */
  parseFromJson: function(jsonStr) {
    let jsonObj = JSON.parse(jsonStr);
    /*console.log("date avant parsage : " + jsonObj.beginDate);
    console.log(jsonObj.beginDate.substring(0,1));
    console.log(jsonObj.beginDate.substring(0,1) === "-");
    console.log(jsonObj.beginDate.substring(1));*/
    if (
      jsonObj.beginDate !== null &&
      jsonObj.beginDate.substring(0, 1) === "-"
    ) {
      jsonObj.beginDate = jsonObj.beginDate.substring(1);
      while (jsonObj.beginDate.substring(0, 1) === "0") {
        jsonObj.beginDate = jsonObj.beginDate.substring(1);
      }
      //console.log(jsonObj.beginDate.indexOf("-"));
      while (jsonObj.beginDate.indexOf("-") < 4) {
        jsonObj.beginDate = "0" + jsonObj.beginDate;
      }
      //console.log(jsonObj.beginDate);
      jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
      //console.log(jsonObj.beginDate);
      jsonObj.beginDate.setFullYear(-jsonObj.beginDate.getFullYear());
      //console.log(-jsonObj.beginDate.getFullYear());
    } else {
      jsonObj.beginDate = new Date(Date.parse(jsonObj.beginDate));
    }
    if (jsonObj.endDate !== null && jsonObj.endDate.substring(0, 1) === "-") {
      jsonObj.endDate = jsonObj.endDate.substring(1);
      while (jsonObj.endDate.substring(0, 1) === "0") {
        jsonObj.endDate = jsonObj.endDate.substring(1);
      }
      while (jsonObj.endDate.indexOf("-") < 4) {
        jsonObj.endDate = "0" + jsonObj.endDate;
      }
      jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
      jsonObj.endDate.setFullYear(-jsonObj.endDate.getFullYear());
    } else {
      jsonObj.endDate = new Date(Date.parse(jsonObj.endDate));
    }

    //console.log("date parsée : " + jsonObj.beginDate);
    return new HDate(jsonObj.type, jsonObj.beginDate, jsonObj.endDate);
  },
  /**
   * @doc type setter for HDate
   * @param {string|number} type : "1" - "8"
   */
  setType(type) {
    if (Number.isInteger(type)) {
      type = type.toString();
    }
    switch (type) {
      case "1":
        this.endDate = dateUtil.clone(this.beginDate);
        break;
      case "2":
        this.endDate =
          this.endDate !== null ? this.endDate : dateUtil.clone(this.beginDate);
        if (dateUtil.dayDiff(this.endDate, this.beginDate) === 0)
          dateUtil.addDay(this.endDate, 1);
        break;
      case "3":
        dateUtil.rewindToMonthFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextMonth(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      case "4":
        dateUtil.rewindToSeasonFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextSeason(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      case "5":
        dateUtil.rewindToYearFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextYear(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      case "6":
        dateUtil.rewindToDecadeFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextDecade(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      case "7":
        dateUtil.rewindToCenturyFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextCentury(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      case "8":
        dateUtil.rewindToMillenniumFirst(this.beginDate);
        this.endDate = dateUtil.addDay(
          dateUtil.switchToNextMillennium(dateUtil.clone(this.beginDate), true),
          -1
        );
        break;
      default:
        break;
    }
    this.type = type;
    return this;
  },
  /**
   * @doc : return display label for this HDate
   * @returns {string}
   */
  getLabel() {
    let formatter = _formatters[this.type];
    let pieces = [];
    let label = formatter(this.beginDate, pieces);
    let BC;

    // specific code for rendering
    if (this.type === "2") {
      let endPieces = [];
      formatter(this.endDate, endPieces);
      let totalLabel = "";
      for (var index = 4; index > -1; index--) {
        if (pieces[index] === endPieces[index]) {
          totalLabel = pieces[index] + totalLabel;
        } else {
          index++;
          break;
        }
      }
      let preBeginLabel = "",
        preEndLabel = "";
      for (let index2 = 0; index2 < index; index2++) {
        preBeginLabel += pieces[index2];
        preEndLabel += endPieces[index2];
      }
      if (preBeginLabel !== "") {
        totalLabel = preBeginLabel + "~" + preEndLabel + totalLabel;
      }
      label = totalLabel;
    } else if (this.type === "1") {
      pieces[
        trans.PARSING_PLACEMENT["1"].DAY - 1
      ] += trans.FORMAT_DAY_NUMBER_SUFFIX(trans.PARSING_PLACEMENT["1"].DAY - 1);
      label = pieces.join("");
    } else if (
      this.type === "4" &&
      pieces[0].toUpperCase() === trans.SEASON_NAMES[0]
    ) {
      pieces[pieces.length - 1] =
        pieces[pieces.length - 1] +
        (Number(pieces[pieces.length - 1]) >= -1 ? "-" : "") +
        (Number(pieces[pieces.length - 1]) + 1);
      label = pieces.join("");
    } else if (this.type === "6") {
      label = trans.FORMAT_DECADE_LABEL + " " + label;
    } else if (this.type === "7") {
      let century = Math.floor(Number(label) / 100);
      BC = century < 0;
      let absoluteCentury = BC ? Math.abs(century) : century + 1;
      label =
        cmn.convertArabicToRoman(absoluteCentury) +
        trans.FORMAT_CENTURY_NUMBER_SUFFIX(absoluteCentury + "") +
        " " +
        trans.FORMAT_CENTURY_LABEL +
        (BC ? " " + trans.FORMAT_BC_LABEL : "");
    } else if (this.type === "8") {
      let millennium = Math.floor(Number(label) / 1000);
      BC = millennium < 0;
      let absoluteMillennium = BC ? Math.abs(millennium) : millennium + 1;
      label =
        cmn.convertArabicToRoman(absoluteMillennium) +
        trans.FORMAT_CENTURY_NUMBER_SUFFIX(absoluteMillennium + "") +
        " " +
        trans.FORMAT_MILLENNIUM_LABEL +
        (BC ? " " + trans.FORMAT_BC_LABEL : "");
    }
    return label;
  }
};

Object.assign(HDate.prototype, _prototype);

export default HDate;
