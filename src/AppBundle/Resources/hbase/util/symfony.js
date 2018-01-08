/**
 * @package hbase.js
 * @doc symfony.js : Contains utilitary functions for handling DOM symfony formatted elements (forms,...)
 * @requires jQuery
 */
var hb = (function (hb,$) {
    "use strict";
    var _moduleName = "util:sf/symfony.js";
    console.log(hb.getLoadedModules());
    if(((typeof hb.getLoadedModules==="function"?hb.getLoadedModules():[])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.util = (function (util,$) {
        var _requiredModules = [];
        /**
         * @module hb/util/sf
         * @class hb.util.sf
         */
        util.sf = {
            /**
             * @doc returns an array of field name => index for a symfony serialized form
             * @param {string} formData
             * @return {array}
             */
            getFormMap: function(formData) {
                let map = [];
                $(Object.keys(formData)).each(function(key){
                    map[formData[key].name] = key;
                });
                return map;
            },
            /**
             * @doc returns the found input element(s) of given attrName (= symfony) in the form (Jquery object of it)
             * @param {jQuery} $object
             * @param {string} name
             * @return {jQuery|null}
             */
            getFormInput:function($object,name) {
                return $object.find("#" + $object.attr("id") + "_" + name).first();
            },
            /**
             * @doc returns the current value of a given form entry, identified by its name
             * @param {jQuery} $object
             * @param {string} name
             * @returns {jQuery|null}
             */
            getFormValue:function($object,name) {
                return this.getFormInput($object,name);
            },
            /**
             * @doc returns the name of the module
             * @return {string}
             */
            getModuleName() {
                return _moduleName;
            },
            /**
             * @doc returns list of required modules and libraries for this module
             * @return {array}
             */
            getRequiredModules() {
                return _requiredModules;
            }
        };
        console.log(_moduleName + " loaded");
        return util;
    }(hb.util || {},$));
    var _loadedModules = ((typeof hb.getLoadedModules==="function")?hb.getLoadedModules():[]);
    _loadedModules.push(_moduleName);
    hb.getLoadedModules = function() {
        return _loadedModules.push(_moduleName) ;
    }
    return hb;
}(hb || {},$));




