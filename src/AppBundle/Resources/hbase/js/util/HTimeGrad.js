/**
 * @package HTimeGrad.js
 * @doc HTimeGrad.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "util:HTimeGrad/HTimeGrad.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];

        /**
         * @doc
         * @module hb/util/HTimeGrad
         * @class hb.util.HTimeGrad
         */
        util.HTimeGrad = {};


        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {}, hb, $));

    let _loadedModules = ((typeof hb.getLoadedModules === "function") ? hb.getLoadedModules() : []);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function () {
        return _loadedModules;
    };
    return hb;
}(hb || {}));
