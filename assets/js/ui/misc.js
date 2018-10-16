/**
 * @package misc.js
 * @doc misc.js :
 */

/**
 * @module hb/ui/misc
 * @class hb.ui.misc
 */
module.exports = {
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
    },
    confirm:function(title,message,onConfirm,onCancel,$target=null)
    {
        let $confirm = this.makeNewConfirm(title,message);
        if($target === null) $target = $('.hb-container');
        $confirm.dialog({
            title:title,
            dialogClass: "no-close hb-modal-z9",
            buttons: [
                {
                    text: "Valider",
                    class: "btn btn-warning",
                    click: onConfirm
                },
                {
                    text: "Annuler",
                    class: "btn btn-default",
                    click: onCancel
                }
            ],
            position: { my: "left top", at: "left bottom", of: $target }
        });
        $confirm.parent().find(".ui-dialog-titlebar-close").hide();

    },
    makeNewConfirm:function (title,message)
    {
        let $confirm = $('<div id="dialog" title="' + title + '">');
        $confirm.$message = $('<p>'+ message + '</p>').appendTo($confirm);
        return $confirm;
    },
};