/**
 * @package manager.js
 * @doc manager.js : Handles DOM resources creation and delivery to clients
 */

let _resources = {
    "hdatepicker":null,
    "sfFormMediator":null,
    "hResourcePicker":null
};

/**
 * @module hb/ui/manager
 * @class hb.ui.manager
 */
let mod = {
    /**
     * @doc instanciate available unique resources
     * @returns {object}
     */
    instanciateUniques : function() {
        _resources.hdatepicker = new hb.ui.HDatePicker();
        _resources.sfFormMediator = new hb.ui.SfFormMediator();
        _resources.hResourcePicker = new hb.ui.HResourcePicker();
    },
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
            $(".hb-hte").each(function(){
                let hte = new hb.ui.HTimeExplorer($(this));
            });
            $(function(){
                    $(".hb-resourcepicker").each(function(){
                        let $this = $(this);
                        let classes = $this.attr('class').split(/\s+/);
                        let concreteClass = '';
                        $.each(classes, function(index, item) {
                            if ($.inArray(item,['hb-imagepicker']) !== -1) {concreteClass = item;}
                        });
                        console.log($this.attr('class').split(/\s+/));
                        let $button = $("<a target=\"#" + $this.attr('id') + "\" class=\"btn btn-default " + concreteClass + " \">" +
                            "</a>").insertAfter($this);
                        $button.attr('data-hb-value',$this.attr('value'));
                        $this.hide();
                        hb.ui.HResourcePicker.prototype.onHbResourcePickerChange($this);
                    });
                    $(".hb-resourcepicker").on("change",function(){hb.ui.HResourcePicker.prototype.onHbResourcePickerChange($(this));});

                    $("a.hb-imagepicker").on('click',function(){
                        //console.log(hResourcePicker.$modal);
                        mod.get("hResourcePicker").bind($(this));
                    });
                }
            );

            //$(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this)});
        }
        else{
            //$element.find(".hbase-hmaxlength").hmaxlength();
            $element.find(".hb-hdatepicker").hdatepicker();
            //$element.find(".hbase-activer").each(function(){$.hbase.func.hbaseChecker(this);});
        }
    }
};

module.exports = mod;