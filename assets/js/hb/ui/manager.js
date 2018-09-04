/**
 * @package manager.js
 * @doc manager.js : Handles DOM resources creation and delivery to clients
 */

let _resources = {
    "hdatepicker":null
};

/**
 * @doc instanciate available unique resources
 * @returns {object}
 * @private
 */
let _instanciateUniques = function() {
    let loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);

    if(loadedModules.includes("ui:HDatePicker/HDatePicker.js")){
        _resources.hdatepicker = new hb.ui.HDatePicker();
    }
    if(loadedModules.includes("ui:SfFormMediator/SfFormMediator.js")){
        _resources.sfFormMediator = new hb.ui.SfFormMediator();
    }
};

_instanciateUniques();

/**
 * @module hb/ui/manager
 * @class hb.ui.manager
 */
let mod = {
    /**
     * @doc get requested HBase resource : either a new object or the instanciated one if it's unique
     * @param {string} str
     * @return {object|null}
     */
    get : function (str) {
        if(!(str in _resources)){return null;}
        if(typeof _resources[str] === 'function') {
            return _resources[str]();
        }
        return _resources[str];
    },
    /**
     * @doc  apply classes
     * @param {Object|null} $element
     * @return {object|null}
     */
    applyClasses : function ($element) {
        if(typeof $element === 'undefined' || $element === null){
            //(".hbase-hmaxlength").hmaxlength();
            $(".hb-hdatepicker").hdatepicker();
            //$(".hbase-htimescroller").htimescroller();
            //$(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this)});
        }
        else{
            //$element.find(".hbase-hmaxlength").hmaxlength();
            $element.find(".hb-hdatepicker").hdatepicker();
            //$element.find(".hbase-htimescroller").htimescroller();
            $element.find(".hb-hdatepicker").hdatepicker();
            //$element.find(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this);});
        }
    }
};

$(function() {
    console.log("apply classes");
    mod.applyClasses(null);
});

module.exports = mod;