/**
 * @package hbase.js
 * @doc symfony.js : Contains utilitary functions for handling DOM symfony formatted elements (forms,...)
 * @requires jQuery
 */

/**
 * @module hb/util/sf
 * @class hb.util.sf
 */
module.exports = {
    /**
     * @doc returns an array of field name => index for a symfony serialized form
     * @param {string} formData
     * @return {Array}
     */
    getFormMap: function(formData) {
        let map = [];
        $(Object.keys(formData)).each(function(key){
            map[formData[key].name] = key;
        });
        return map;
    },
    /**
     * @doc returns the first input element of given attrName (= symfony) in the form (Jquery object of it)
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
        let $input = this.getFormInput($object,name);
        if($input !== null){return $input.val();}
        return null;
    },
};




