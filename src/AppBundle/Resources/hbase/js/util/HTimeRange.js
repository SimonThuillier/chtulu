
/**
 * @package HTimeRange.js
 * @doc HTimeRange.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:HTimeRange/HTimeRange.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util, hb, $,d3) {
        var _requiredModules = ["util:cmn/common.js,util:date/date.js"];

        /** @doc returns the best type of range according to a given HDate
         * @param {hb.util.HDate} hDate
         * @return {string}
         * */
        let _getTypeFromHDate = function(hDate){
            let dayCount = hDate.getIntervalSize();
            if(dayCount <50){return 'day';}
            else if(dayCount <210){return 'week';}
            else if(dayCount <1500){return 'month';}
            else if(dayCount <20000){return 'year';}
            else if(dayCount <200000){return 'decade';}
            else if(dayCount <2000000){return 'century';}
            else{return 'millennium';}
        };

        /** @doc switcher functions according to type */
        let _switchFunctions = [
            {type:'day',switcher:util.date.switchToNextDay,supType:'week'},
            {type:'week',switcher:util.date.switchToNextWeek,supType:'month'},
            {type:'month',switcher:util.date.switchToNextMonth,supType:'year'},
            {type:'year',switcher:util.date.switchToNextYear,supType:'decade'},
            {type:'decade',switcher:util.date.switchToNextDecade,supType:'century'},
            {type:'century',switcher:util.date.switchToNextCentury,supType:'millennium'},
            {type:'millennium',switcher:util.date.switchToNextMillennium,supType:'millennium'}
        ];
        /** @doc callback function to find the adhoc switcher function and superior type (compound) */
        let _findSwitcherFunction = function(thisType){
            return (_switchFunctions).find(function(functionArray){
                return (functionArray.type === thisType);
            });
        };

        let _createGrads = function(beginDate,endDate,type,parent){
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
            let currentDate = switcher(hb.util.date.clone(beginDate));
            let currentMajorDate = supSwitcher(hb.util.date.clone(beginDate));
            let range = [];
            let minorGradMajor = 0; // to allow minor graduations with major -1 (legend undisplayed) if too close to next major graduations
            while(currentDate < endDate || currentMajorDate < endDate){
                if(type === 'week'){
                    if (currentDate.getDate() > 27 || currentDate.getDate() < 4 ) {minorGradMajor = -1;}
                    else{minorGradMajor=0;}
                }
                if(currentDate < currentMajorDate){
                    range.push(new hb.util.HTimeGrad(parent,hb.util.date.clone(currentDate),type,minorGradMajor));
                    currentDate = switcher(currentDate,true);
                }
                else if(currentDate > currentMajorDate){
                    range.push(new hb.util.HTimeGrad(parent,hb.util.date.clone(currentMajorDate),type,1));
                    currentMajorDate = supSwitcher(currentMajorDate,true);
                }
                else{ // equal dates
                    range.push(new hb.util.HTimeGrad(parent,hb.util.date.clone(currentMajorDate),type,1));
                    currentDate = switcher(currentDate,true);
                    currentMajorDate = supSwitcher(currentMajorDate,true);
                }
            }
            return range;
        };

        /** @doc function adding/removing graduations according to a new beginDate */
        let _handleLeftSide = function(hTimeRange,newBeginDate){
            /*console.log(hb.util.date.equals(hTimeRange.hDate.beginDate,newBeginDate));
            console.log(hTimeRange.hDate.beginDate);
            console.log(newBeginDate);*/
            if (hb.util.date.equals(hTimeRange.hDate.beginDate,newBeginDate)) return;
            else if (newBeginDate < hTimeRange.hDate.beginDate){ // this case we need to add grads at the beginning of grad array
                let newGrads = _createGrads(newBeginDate,hTimeRange.hDate.beginDate,hTimeRange.type,hTimeRange.parent);
                hTimeRange.grads = newGrads.concat(hTimeRange.grads);
            }
            else if (newBeginDate > hTimeRange.hDate.endDate){
                hTimeRange.grads.forEach(function(grad) {
                    console.log("remove");
                    grad.remove();
                });
                hTimeRange.grads = [];
            }
            else if (newBeginDate > hTimeRange.hDate.beginDate){
                let index =0;
                /*console.log("remove ?");
                console.log(hTimeRange.grads[index].date);
                console.log(newBeginDate);*/
                while(hTimeRange.grads[index].date < newBeginDate){
                    //console.log("remove");
                    hTimeRange.grads[index].remove();
                    index++;
                }
                hTimeRange.grads.splice(0,index);
            }
        };

        /** @doc function adding/removing graduations according to a new endDate */
        let _handleRightSide = function(hTimeRange,newEndDate){
            if (hb.util.date.equals(hTimeRange.hDate.endDate,newEndDate)) return;
            else if (newEndDate > hTimeRange.hDate.endDate){ // this case we need to add grads at the end of grad array
                let newGrads = _createGrads(hTimeRange.hDate.endDate,newEndDate,hTimeRange.type,hTimeRange.parent);
                hTimeRange.grads = hTimeRange.grads.concat(newGrads);
            }
            else if (newEndDate <= hTimeRange.hDate.beginDate){
                hTimeRange.grads.forEach(function(grad) {
                    grad.remove();
                });
                hTimeRange.grads = [];
            }
            else if (newEndDate < hTimeRange.hDate.endDate){
                let index =hTimeRange.grads.length-1;
                while(index>=0 && hTimeRange.grads[index].date >= newEndDate){
                    hTimeRange.grads[index].remove();
                    index--;
                }
                hTimeRange.grads.splice(index+1,hTimeRange.grads.length-1-index);
            }
        };

        /**
         * @doc handles the range of date graduations in a given HDate
         * @module hb/util/HTimeRange
         * @class hb.util.HTimeRange
         */
        util.HTimeRange = function(parent){
            this.parent = parent;
            this.hDate = null;
            this.type = null;
            this.grads = [];
        };

        Object.assign(util.HTimeRange.prototype,{
            /** @doc set interval HDate of the range  */
            setHDate : function(hDate){
                let newType = _getTypeFromHDate(hDate);
                if(newType === this.type){ // add new elements
                    console.log("creer sur les cotes");
                    _handleLeftSide(this,hDate.beginDate);
                    _handleRightSide(this,hDate.endDate);
                    this.hDate = hDate;
                }
                else{ // drop old graduations and compute new range
                    this.grads.forEach(function(grad) {
                        grad.remove();
                    });

                    this.hDate = hDate;
                    this.type = newType;
                    this.grads = _createGrads(hDate.beginDate,hDate.endDate,this.type,this.parent);
                }
                this.grads.forEach(function(grad) {
                    grad.updateScale();
                });
            },
            getHDateFromGrad : function(hGrad){
                let ud = hb.util.date;
                let switcher = _findSwitcherFunction(hGrad.type).switcher;
                let newBeginDate = ud.clone(hGrad.date);
                let newEndDate = switcher(ud.clone(hGrad.date),true);

                let type = 2;
                switch(hGrad.type){
                    case 'month':
                        type = "3";
                        break;
                    case 'year':
                        type = "5";
                        break;
                    case 'decade':
                        type = "6";
                        break;
                    case 'century':
                        type = "7";
                        break;
                    case 'millennium':
                        type = "8";
                        break;
                }
                return new hb.util.HDate(type,newBeginDate,newEndDate);
            },
        });

        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {}, hb, $,d3));

    let _loadedModules = ((typeof hb.getLoadedModules === "function") ? hb.getLoadedModules() : []);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function () {
        return _loadedModules;
    };
    return hb;
}(hb || {}));