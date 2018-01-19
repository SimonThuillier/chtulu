/**
 * @package geometry.js
 * @doc geometry.js : Contains various geometry functions for hbase
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:geom/geometry.js";
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util) {
        var _requiredModules = [];
        /**
         * @module hb/util/geom
         * @class hb.util.geom
         */
        util.geom = {
            /** @doc returns D3 points for htsChevron : takes for argument the upper point and the peak point
             * @param {Number} x1
             * @param {Number} y1
             * @param {Number} x2
             * @param {Number} y2
             * @returns {String}
             * */
            getChevronDefPoints : function(x1,y1,x2,y2){
                return ['M',x1,y1,
                    'L',x2,y2,
                    'L',x1,(y1 + 2*(y2-y1)),
                    'L',x1+((x2-x1)/2),y2,
                    'Z'].join(' ');
            },

            /** @doc returns D3 points for isocel triangle : takes for argument the upper point and the peak point
             * @param {Number} x1
             * @param {Number} y1
             * @param {Number} x2
             * @param {Number} y2
             * @returns {String}
             * */
            getTriangleDefPoints : function(x1,y1,x2,y2){
                return ['M',x1,y1,
                    'L',x2,y2,
                    'L',x1,(y1 + 2*(y2-y1)),
                    'Z'].join(' ');
            },
            /** @doc returns D3 points for diamond : takes for argument the upper point and lower point coordinates and the ratio horizontal vs vertical
             * @param {Number} x1
             * @param {Number} y1
             * @param {Number} x2
             * @param {Number} y2
             * @param {Number} ratio
             * @returns {String}
             */
            getDiamondDefPoints : function(x1,y1,x2,y2,ratio){
                var horizontalArrow = ratio*Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
                var angle = Math.atan((x1-x2)/(y2-y1));

                var xc = x1 + (x2-x1)/2;
                var yc = y1 + (y2-y1)/2;

                var x3 = xc + 0.5*horizontalArrow * Math.cos(angle);
                var y3 = yc + 0.5*horizontalArrow * Math.sin(angle);
                var x4 = xc - 0.5*horizontalArrow * Math.cos(angle);
                var y4 = yc - 0.5*horizontalArrow * Math.sin(angle);

                return ['M',x1,y1,
                    'L',x3,y3,
                    'L',x2,y2,
                    'L',x4,y4,
                    'Z'].join(' ');
            },
            /** @doc returns D3 points for ArrowPeak : takes for argument the left upper point,the left upper peak point and the peak right point
             * @param {Number} x1
             * @param {Number} y1
             * @param {Number} x2
             * @param {Number} y2
             * @param {Number} x3
             * @param {Number} y3
             * @returns {String} */
            getArrowDefPoints : function(x1,y1,x2,y2,x3,y3){
            return ['M',x1,y1,
                'L',x2,y1,
                'L',x2,y2,
                'L',x3,y3,
                'L',x2,y2+2*(y3-y2),
                'L',x2,y1+2*(y3-y1),
                'L',x1,y1+2*(y3-y1),
                'Z'].join(' ');
        },
        /**
         * @doc returns the name of the module
         * @return {string}
         */
        getModuleName : function() {
            return _moduleName;
        },
        /**
         * @doc returns list of required modules and libraries for this module
         * @return {Array}
         */
        getRequiredModules : function () {
            return _requiredModules;
        }
    };
        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {}));

    let _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules;
    }
    return hb;
}(hb || {}));
