/**
 * @package hbase.js
 * @doc date.js : utilitary functions for date handling, parsing and formatting/rendering
 * @requires hb.util.cmn,trans
 */

import cmn from "./common";
import trans from "./translation";

/**
 *
 * @doc declaration of private consts for formatting
 */
const _FORMAT_CHARACTERS = "([d|j|l|D|m|n|F|M|Y|c|y|z|S|s])";
const _FORMAT_SEPARATORS = "([/|_|:| ])";
const _FORMAT_PATTERN = [
  "^",
  _FORMAT_CHARACTERS,
  _FORMAT_SEPARATORS,
  "{0,1}",
  _FORMAT_CHARACTERS,
  "*",
  _FORMAT_SEPARATORS,
  "{0,1}",
  _FORMAT_CHARACTERS,
  "*",
  _FORMAT_SEPARATORS,
  "{0,1}",
  _FORMAT_CHARACTERS,
  "*",
  "$"
].join("");
const _FORMAT_REGEX = new RegExp(_FORMAT_PATTERN);
const _FORMAT_YEAR_REGEX = new RegExp("(-*)(\\d+)");
const _FORMATTERS = {
  /**
   * @doc returns day number with initial zero
   * @param {Date} date
   * @returns {string}
   */
  d: function(date) {
    return date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  },
  /**
   * @doc returns day number without initial zero
   * @param {Date} date
   * @returns {string}
   */
  j: function(date) {
    return date.getDate() + "";
  },
  /**
   * @doc returns textual day
   * @param {Date} date
   * @returns {string}
   */
  l: function(date) {
    return trans.DAY_NAMES[date.getDay()];
  },
  /**
   * @doc returns short textual day
   * @param {Date} date
   * @returns {string}
   */
  D: function(date) {
    return trans.DAY_NAMES_MIN[date.getDay()];
  },
  /**
   * @doc returns month number with initial zero
   * @param {Date} date
   * @returns {string}
   */
  m: function(date) {
    return date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  },
  /**
   * @doc returns month number without initial zero
   * @param {Date} date
   * @returns {string}
   */
  n: function(date) {
    return date.getMonth() + 1 + "";
  },
  /**
   * @doc returns textual month
   * @param {Date} date
   * @returns {string}
   */
  F: function(date) {
    return trans.MONTH_NAMES[date.getMonth()];
  },
  /**
   * @doc returns short textual month
   * @param {Date} date
   * @returns {string}
   */
  M: function(date) {
    return trans.MONTH_NAMES_SHORT[date.getMonth()];
  },
  /**
   * @doc returns textual season
   * @param {Date} date
   * @returns {string}
   */
  S: function(date) {
    return trans.SEASON_NAMES[dateUtil.getSeason(date)];
  },
  /**
   * @doc returns season number (1 winter to 4 fall)
   * @param {Date} date
   * @returns {string}
   */
  s: function(date) {
    return dateUtil.getSeason(date) + 1;
  },
  /**
   * @doc returns complete year number
   * @param {Date} date
   * @returns {string}
   */
  Y: function(date) {
    return date.getFullYear() + "";
  },
  /**
   * @doc returns year number last two figures
   * @param {Date} date
   * @returns {string}
   */
  y: function(date) {
    let arrayDate = _FORMAT_YEAR_REGEX.exec(date.getFullYear() + "");
    if (arrayDate[2].length > 2) {
      return arrayDate[2].substring(arrayDate[2].length - 2);
    }
    return arrayDate[1] + arrayDate[2];
  },
  /**
   * @doc returns last digit of year number
   * @param {Date} date
   * @returns {string}
   */
  z: function(date) {
    let arrayDate = _FORMAT_YEAR_REGEX.exec(date.getFullYear() + "");
    if (arrayDate[2].length > 1) {
      return arrayDate[2].substring(arrayDate[2].length - 1);
    }
    return arrayDate[1] + arrayDate[2];
  },
  /**
   * @doc returns century of the year (3 digit or 0 if first gregorian year)
   * for negative years the "-" is displayed if the year is originally on the requested size
   * @param {Date} date
   * @returns {string}
   */
  c: function(date) {
    let arrayDate = _FORMAT_YEAR_REGEX.exec(date.getFullYear() + "");
    if (arrayDate[2].length > 3) {
      return arrayDate[2].substring(arrayDate[2].length - 3);
    }
    return arrayDate[1] + arrayDate[2];
  }
};

const _PARSE_REGEXS = {
  "1": new RegExp(trans.PARSING_REGEX_STRS["1"]), // DAY
  "3": new RegExp(trans.PARSING_REGEX_STRS["3"]), // MONTH
  "4": new RegExp(trans.PARSING_REGEX_STRS["4"]), // SEASON
  "5": new RegExp(trans.PARSING_REGEX_STRS["5"]), // YEAR
  "6": new RegExp(trans.PARSING_REGEX_STRS["6"]), // DECADE
  "7": new RegExp(trans.PARSING_REGEX_STRS["7"]), // CENTURY
  "8": new RegExp(trans.PARSING_REGEX_STRS["8"]) // MILLENNIUM
};
const _PARSERS = {
  "1": {
    // DAY
    DAY: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["1"].DAY]);
    },
    MONTH: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["1"].MONTH]);
    },
    YEAR: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["1"].YEAR]);
    }
  },
  "3": {
    // MONTH
    MONTH: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["3"].MONTH]);
    },
    YEAR: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["3"].YEAR]);
    }
  },
  "4": {
    // SEASON
    // "MONTH" : function(array){return (3*(parseInt(array[trans.PARSING_PLACEMENT["4"].MONTH])-1)+1);},
    SEASON: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["4"].SEASON]);
    },
    YEAR: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["4"].YEAR]);
    }
  },
  "5": {
    // YEAR
    YEAR: function(array) {
      return parseInt(array[trans.PARSING_PLACEMENT["5"].YEAR]);
    }
  },
  "6": {
    // DECADE
    YEAR: function(array) {
      return (
        Math.floor(parseInt(array[trans.PARSING_PLACEMENT["6"].YEAR]) / 10) * 10
      );
    }
  },
  "7": {
    // CENTURY
    YEAR: function(array) {
      return (
        Math.floor(parseInt(array[trans.PARSING_PLACEMENT["7"].YEAR]) / 100) *
        100
      );
    }
  },
  "8": {
    // MILLENNIUM
    YEAR: function(array) {
      return (
        Math.floor(parseInt(array[trans.PARSING_PLACEMENT["8"].YEAR]) / 1000) *
        1000
      );
    }
  }
};

/**
 * @module hb/util/date
 * @class hb.util.date
 * @requires trans
 */
const dateUtil = {
  /**
   * @doc add to a date a certain given number of day (accept negative number of day)
   * @param {Date} date
   * @param {int} nbDay
   * @returns {Date}
   */
  addDay: function(date, nbDay) {
    if (nbDay === 0) return date;
    date.setDate(date.getDate() + nbDay);
    return date;
  },
  /**
   * @doc clone a date object and returns the clone
   * @param {Date} date
   * @returns {Date}
   */
  clone: function(date) {
    let copy = new Date();
    copy.setTime(date.getTime());
    copy.setHours(0, 0, 0, 0);
    return copy;
  },
  /**
   * @doc corrects a date year to prevent incorrect interpretation with two figures dates (ex 63 ap JC) and returns it
   * @param {Date} date
   * @param {int} year
   * @returns {Date}
   */
  correctYear: function(date, year) {
    date.setFullYear(year);
    return date;
  },
  /**
   * @doc returns the entire number of days between two dates
   * @param {Date} endDate
   * @param {Date} beginDate
   * @returns {int}
   */
  dayDiff: function(endDate, beginDate) {
    return Math.round((endDate - beginDate) / (1000 * 60 * 60 * 24));
  },
  /**
   * @doc returns true if same day, false otherwise
   * @param {Date} date1
   * @param {Date} date2
   * @returns {boolean}
   */
  equals: function(date1, date2) {
    return dateUtil.dayDiff(date1, date2) === 0;
  },
  /**
   * @doc returns the float number of days between two dates
   * @param {Date} endDate
   * @param {Date} beginDate
   * @returns {number}
   */
  floatDayDiff: function(endDate, beginDate) {
    return (endDate - beginDate) / (1000 * 60 * 60 * 24);
  },
  /**
   * @doc returns french day numbering in week switched from sunday/0-saturday/6 to monday/0-sunday/6
   * @param {Date} date
   * @returns {int}
   */
  getFrenchDay: function(date) {
    return (date.getDay() + 6) % 7;
  },
  /**
   * @doc returns the simple html regex for dd/MM/yyyy dates
   * @returns {string}
   * @deprecated
   */
  getHtmlDateRegex: function() {
    return "^(0?[1-9]|[1-2][1-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$";
  },
  /**
   * @doc returns season number of a date : 0 winter,1 spring, 2 summer, 3 fall
   * @param {Date} date
   * @returns {int}
   */
  getSeason: function(date) {
    let season = Math.floor(date.getMonth() / 3);
    let isChangingMonth = (date.getMonth() + 1) % 3 === 0;
    if (isChangingMonth && date.getDate() > 20) {
      season++;
    }
    return season % 4;
  },
  /**
   * @doc returns the minimum year allowed, eg. 1 million years ago (dawn of man)
   * @returns {int}
   */
  getMinYear: function() {
    return -1000000;
  },
  /**
   * @doc returns the maximum date allowed, eg. now
   * @returns {Date}
   */
  getMaxDate: function() {
    return new Date();
  },
  /**
   * @doc returns the maximum year allowed, eg. current year
   * @returns {int}
   */
  getMaxYear: function() {
    return new Date().getFullYear();
  },
  /**
   * @doc sets the time of a date to 0 and returns it
   * @param {Date} date
   * @returns {Date}
   */
  stripHours: function(date) {
    console.log(date);
    date.setHours(0, 0, 0, 0);
    return date;
  },
  /**
   * @doc rewind a date to the first day of its current month and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToMonthFirst: function(date) {
    date.setDate(1);
    return date;
  },
  /**
   * @doc rewinds a date to the first day of its current season and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToSeasonFirst: function(date) {
    let month;
    let isChangingYear = date.getMonth() === 11 && date.getDate() > 20;
    if (isChangingYear) {
      month = 11;
    } else {
      let season = dateUtil.getSeason(date);
      month = season * 3 - 1;
    }
    date.setMonth(month);
    date.setDate(21);
    return date;
  },
  /**
   * @doc rewinds a date to the first day of its current year and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToYearFirst: function(date) {
    date.setDate(1);
    date.setMonth(0);
    return date;
  },
  /**
   * @doc rewinds a date to the first day of its current decade and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToDecadeFirst: function(date) {
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(Math.floor(date.getFullYear() / 10) * 10);
    return date;
  },
  /**
   * @doc rewinds a date to the first day of its current century and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToCenturyFirst: function(date) {
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(Math.floor(date.getFullYear() / 100) * 100);
    return date;
  },
  /**
   * @doc rewinds a date to the first day of its current millennium and returns it
   * @param {Date} date
   * @returns {Date}
   */
  rewindToMillenniumFirst: function(date) {
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(Math.floor(date.getFullYear() / 1000) * 1000);
    return date;
  },
  /**
   * @doc advances the date to next day (if force is true), then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments of one day, else do nothing
   * @param {boolean} exact - unused here, but kept for compatibility with other switch functions
   * @returns {Date}
   */
  switchToNextDay: function(date, force = false, exact = false) {
    if (force === true) return dateUtil.addDay(date, 1);
    return date;
  },
  /**
   * @doc advances the date to next Monday (default mode) ; if exact mode increment of exactly one week
   * if not force and date is already a monday nothing is done, exact to advance exactly of one week, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of week (monday), not if false
   * @param {boolean} exact - if true always increments the date of exactly one week
   * @returns {Date}
   */
  switchToNextWeek: function(date, force = false, exact = false) {
    if (exact) return dateUtil.addDay(date, 7);
    let originDay = dateUtil.getFrenchDay(date);
    if (force || originDay !== 0) {
      dateUtil.addDay(date, 7 - originDay);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next month, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of month, not if false
   * @param {boolean} exact - if true always increments the date of exactly one month
   * @returns {Date}
   */
  switchToNextMonth: function(date, force = false, exact = false) {
    if (exact) {
      date.setMonth(date.getMonth() + 1);
      return date;
    }
    if (force || date.getDate() !== 1) {
      date.setMonth(date.getMonth() + 1, 1);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next season, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of season, not if false
   * @param {boolean} exact - if true always increments the date of exactly one season (3 months)
   * @returns {Date}
   */
  switchToNextSeason: function(date, force = false, exact = false) {
    if (exact) {
      date.setMonth(date.getMonth() + 3);
      return date;
    }
    let isChangingMonth = (date.getMonth() + 1) % 3 === 0;
    let newMonth = date.getMonth() - ((date.getMonth() + 1) % 3) + 3;

    date.setDate(21);
    if (force || !(date.getDate() < 22 && isChangingMonth)) {
      date.setMonth(newMonth);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next year, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of year, not if false
   * @param {boolean} exact - if true always increments the date of exactly one year
   * @returns {Date}
   */
  switchToNextYear: function(date, force = false, exact = false) {
    if (exact) {
      date.setFullYear(date.getFullYear() + 1);
      return date;
    }
    if (force || !(date.getMonth() === 0 && date.getDate() === 1)) {
      date.setFullYear(date.getFullYear() + 1, 0, 1);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next decade, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of decade, not if false
   * @param {boolean} exact - if true always increments the date of exactly one decade
   * @returns {Date}
   */
  switchToNextDecade: function(date, force = false, exact = false) {
    if (exact) {
      date.setFullYear(date.getFullYear() + 10);
      return date;
    }
    let year = date.getFullYear();
    let decade = Math.floor(year / 10) * 10;
    if (
      force ||
      !(year - decade === 0 && date.getMonth() === 0 && date.getDate() === 1)
    ) {
      date.setFullYear(decade + 10, 0, 1);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next century, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of century, not if false
   * @param {boolean} exact - if true always increments the date of exactly one century
   * @returns {Date}
   */
  switchToNextCentury: function(date, force = false, exact = false) {
    if (exact) {
      date.setFullYear(date.getFullYear() + 100);
      return date;
    }
    let year = date.getFullYear();
    let century = Math.floor(year / 100) * 100;

    if (
      force ||
      !(year - century === 0 && date.getMonth() === 0 && date.getDate() === 1)
    ) {
      date.setFullYear(century + 100, 0, 1);
    }
    return date;
  },
  /**
   * @doc advances the date to first day of next millennium, then returns it
   * @param {Date} date
   * @param {boolean} force - if true increments even if the date is first day of millennium, not if false
   * @param {boolean} exact - if true always increments the date of exactly one millennium
   * @returns {Date}
   */
  switchToNextMillennium: function(date, force = false, exact = false) {
    if (exact) {
      date.setFullYear(date.getFullYear() + 1000);
      return date;
    }
    let year = date.getFullYear();
    let millennium = Math.floor(year / 1000) * 1000;

    if (
      force ||
      !(
        year - millennium === 0 &&
        date.getMonth() === 0 &&
        date.getDate() === 1
      )
    ) {
      date.setFullYear(millennium + 1000, 0, 1);
    }
    return date;
  },
  /**
   * @doc returns the date formatter function corresponding to the wanted pattern
   * format given date using a simplified personal pattern expression (php inspired)
   * ## DAYS ##
   * [d] : day month n° with initial zero, [j] : day month n° without initial zero, [l] : textual day, [D] : abridged textual day
   * ## MONTHS ##
   * [m] : month number with initial zero, [n] : month number without initial zero, [F] : textual month, [M] : abridged textual month,
   * [S] : textual season, [s] : season index (1-4)
   * ## YEARS ##
   * [Y] : complete year, [y] year on two numbers, [z] : last digit of year, [c] century of the year (3 digit or 0 if first Gregorian year),
   * for negative years the - is displayed if the year is originally on the requested size
   * ## SEPARATORS ##
   * separators can be [/][_][:][a space] or nothing
   * @param {string} pattern - the string pattern with which format the date (ex : dd/MM/YY ). "-" can't be used as separator
   * @returns {Function}
   */
  getFormatterFromPattern: function(pattern) {
    let regexArray = _FORMAT_REGEX.exec(pattern);
    if (regexArray === null) {
      throw [
        "The given pattern : ",
        pattern,
        " isn't a valid date pattern."
      ].join("");
    }
    // determine the required data and max index to loop on for the format function
    let maxIndex = 7;
    if (typeof regexArray[maxIndex] === "undefined") {
      maxIndex = 5;
    }
    if (typeof regexArray[maxIndex] === "undefined") {
      maxIndex = 3;
    }
    if (typeof regexArray[maxIndex] === "undefined") {
      maxIndex = 1;
    }

    /**
     * @doc returns date formatted with the previously given pattern
     * @param {Date} date
     * @param {Array} pieces - if given the function fills it with each piece of the rendered date
     * @returns {string}
     */
    function formatter(date, pieces = []) {
      if(!date) return "";
      for (let index = 1; index <= maxIndex; index++) {
        if (typeof _FORMATTERS[regexArray[index]] === "function") {
          pieces[index - 1] = _FORMATTERS[regexArray[index]](date);
        } else {
          pieces[index - 1] = regexArray[index];
        }
      }
      return pieces.join("");
    }

    return formatter;
  },
  /**
   * @doc returns the parser for the given parsing style
   * @param {string} type - parsing style to apply from "1" (PRECISE) to "8" (MILLENNIUM), at the exception of "2" (BOUNDED type, see HDate)
   * @returns {Function}
   * @throws Exception - if unknown type
   */
  getParserFromStyle: function(type) {
    let parseRegex = _PARSE_REGEXS[type];
    if (typeof parseRegex === "undefined" || parseRegex === null) {
      throw [
        "The given type : '",
        type,
        "' isn't a valid parsing style ('1,3-8' accepted)."
      ].join("");
    }

    /**
     * @doc in accordance to the wanted parsing style, returns either the date corresponding to the given string or null
     * @param {String} sDate
     * @param {Array} errors - if given the function fills it with errors encountered during parsing
     * @returns {Date|null}
     */
    function parser(sDate, errors = []) {
      let regexArray = parseRegex.exec(sDate);
      if (regexArray === null) {
        errors.push(
          cmn.multiReplace(trans.PARSING_ERRORS[0], {
            "<SDATE>": sDate,
            "<PARSING_TYPE>": trans.PARSING_TYPE_LABELS[type],
            "<PARSING_EXAMPLE>": trans.PARSING_TYPE_EXAMPLES[type]
          })
        );
        return null;
      }
      let date = null,
        day = 1,
        month = 1,
        season = 1,
        year = 1;
      let parsers = _PARSERS[type];

      if (typeof parsers.DAY === "function") {
        day = +parsers.DAY(regexArray);
      }
      if (typeof parsers.MONTH === "function") {
        month = +parsers.MONTH(regexArray);
      }
      if (typeof parsers.SEASON === "function") {
        season = +parsers.SEASON(regexArray);
      }
      if (typeof parsers.YEAR === "function") {
        year = +parsers.YEAR(regexArray);
      }

      if (day < 1 || day > 31) {
        errors.push(
          cmn.multiReplace(trans.PARSING_ERRORS[1], { "<DAY>": day })
        );
      }

      if (season < 1 || season > 4) {
        errors.push(
          cmn.multiReplace(trans.PARSING_ERRORS[2], {
            "<SEASON>": season,
            "<WINTER>": trans.SEASON_NAMES[0],
            "<FALL>": trans.SEASON_NAMES[3]
          })
        );
      }

      if (month < 1 || month > 12) {
        errors.push(
          cmn.multiReplace(trans.PARSING_ERRORS[3], { "<MONTH>": month })
        );
      }
      if (year < dateUtil.getMinYear() || year > dateUtil.getMaxYear()) {
        errors.push(
          cmn.multiReplace(trans.PARSING_ERRORS[4], {
            "<YEAR>": year,
            "<MAX_YEAR>": dateUtil.getMaxYear()
          })
        );
      }

      if (errors.length === 0) {
        if (type === "4") {
          day = 1;
          month = (season - 1) * 3 + 1;
        }
        date = dateUtil.correctYear(new Date(year, month - 1, day), year);
      }
      return date;
    }

    return parser;
  },
  parseRegularServerDate(sDate)
  {
      if(sDate === null || sDate ==='') return null;
      console.log('parsing date');
      console.log(sDate);

      const serverDateRegex = new RegExp(/^#DATE#(\d{4}-\d{2}-\d{2})#(\d{2}:\d{2}:\d{2})#$/);
      const p = serverDateRegex.exec(sDate);
      if(p === null) return null;

      return new Date(`${p[1]}T${p[2]}.000Z`);
  }
};

export default dateUtil;
