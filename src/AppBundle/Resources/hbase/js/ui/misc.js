/**
 * @package misc.js
 * @doc misc.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:misc/misc.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/common.js"];

        /**
         * @module hb/ui/misc
         * @class hb.ui.misc
         */
        ui.misc = {
            blink:function($object,period = 500,timeout = 8000)
            {
                let maxPeriod = timeout/period;
                let nbPeriod = 0;
                let halfPeriod = period/2;
                function nextFrame() {
                    if($object.hasClass('hb-enabled') && nbPeriod < maxPeriod) {
                        $object.fadeOut(halfPeriod).fadeIn(halfPeriod);
                        nbPeriod++;
                        setTimeout(nextFrame, period);
                    }
                    else{ // stop actions
                        $object.removeClass('hb-enabled');
                        $object.show();
                    }
                }
                // launch animation
                setTimeout(nextFrame, 0);
            },
            disappear:function($object,time = 1300)
            {
                let phase = 0;
                function nextFrame() {
                    if(phase === 0) {
                        $object.fadeOut(time);
                        phase++;
                        setTimeout(nextFrame, time);
                    }
                    else if (phase === 1){
                        $object.remove();
                        phase++;
                    }
                }
                setTimeout(nextFrame, 0);
            },
            makeNewAlert:function (type,msg)
            {
                if(type==='error'){type='danger';}
                let $alert = $('<div class="alert alert-' + type + ' hb-alert"/>');
                $alert.append(msg);
                let $dismissBtn = $('<button type="button" class="close" data-dismiss="alert">&times;</button>').appendTo($alert);
                return $alert;
            },
            alert:function(type,msg,$object=null,mode='atBeginning',sense = 1,duration=320)
            {
                let $alert = this.makeNewAlert(type,msg);
                if($object === null) $object = $('.hb-container');
                $object = $object.first();
                if(sense === 1 && $('.hb-alert').length > 0){
                    $alert.insertAfter($('.hb-alert').last());
                }
                else{
                    switch(mode){
                        case "after":
                            console.log('after');
                            $alert.insertAfter($object);
                            break;
                        case "before":
                            console.log('before');
                            $alert.insertBefore($object);
                            break;
                        case "atEnd":
                            console.log('atEnd');
                            $alert.appendTo($object);
                            break;
                        default :
                            console.log('atBeginning');
                            $alert.prependTo($object);
                            break;
                    }
                }
                $alert.hide().show(duration);
                return $alert;
            }
        };
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
