/**
 * @package HTimeExplorerBuilder.js
 * @doc HTimeExplorerBuilder.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:HTimeExplorerBuilder/HTimeExplorerBuilder.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];




        console.log(_moduleName + " loaded");
        return ui;
    }(hb.ui || {}, hb, $));

    let _loadedModules = ((typeof hb.getLoadedModules === "function") ? hb.getLoadedModules() : []);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function () {
        return _loadedModules;
    };
    return hb;
}(hb || {}));
