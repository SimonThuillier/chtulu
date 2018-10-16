/**
 * @package HResourcePicker.js
 * @doc HResourcePicker.js :
 */

let _onHbDeleterClick = function($this,mode='value'){
    console.log("delete");
    let $target = $($this.attr('target'));
    $target.attr("value",null);
};

let _onHbResourcePickerChange = function($this){
    console.log("change");
    console.log($this);
    let $button = $("a[target=\"#" + $this.attr('id') + "\"]");
    if(typeof $this.attr("value") !== 'undefined' &&
        $this.attr("value") !== null &&
        $this.attr("value") !==''){
        let resource = JSON.parse($this.attr("value"));
        let name = resource.name + '-' + resource.activeVersion.number;
        if(resource.activeVersion.type && resource.activeVersion.type !==''){
            name = name + '.' + resource.activeVersion.type;
        }
        $button.html(name + "&nbsp;");
        console.log(resource);
        if(resource.activeVersion.urlMini && resource.activeVersion.urlMini!==''){
            let $mini = $("<img src=\"" + resource.activeVersion.urlMini + "\"  class=\"img-circle\">");
            $button.append($mini);
        }

        $button.append("&nbsp;");
        let $deleter = $("<i class=\"fa fa-times-circle hb-deleter\"></i>");
        $deleter.attr("target","#" + $this.attr('id'));
        $deleter.on("click",function(event){
            event.preventDefault();
            event.stopPropagation();
            _onHbDeleterClick($(this));
            _onHbResourcePickerChange($this);
        });
        $button.append($deleter);
    }
    else{
        $button.html("Selectionner une image <i class=\"fa fa-image\"></i>");
    }
};

/**
 * @doc setDefaultOption for HResourcePicker
 * @param option
 * @returns {object}
 * @private
 */
let _setDefaultOption = function(option) {
    option.detailBuilder = option.detailBuilder || null;
    option.detailMediator = option.detailMediator || null;
    option.formBuilder = option.formBuilder || null;
    option.formMediator = option.formMediator || null;
    option.z = option.z || 7;
    option.fadeTime = option.fadeTime || 250;
    option.defaultTitle = option.defaultTitle || "Choisissez une ressource";
    option.groups = option.groups || ["minimal"];
    option.uploadFormName = "h_file_upload";
    return option;
};

/**
 * @doc apply options to HResourcePicker
 * @private
 */
let _applyOption = function(modal){

    let $modal = modal.$modal;
};

/**
 * @doc builds modal container
 * @private
 */
let _build = function() {
    let $modal = $("<div class=\"modal fade\" " +
        "role=\"dialog\">").appendTo('body');
    $modal.alerts=[];
    $modal.container = $("<div class=\"modal-dialog\" role=\"document\">").appendTo($modal);
    $modal.content = $("<div class=\"modal-content\">").appendTo($modal.container);

    $modal.header = $("<div class=\"modal-header\">").appendTo($modal.content);
    $modal.title = $("<h4 class=\"modal-title\">Modal Header</h4>").appendTo($modal.header);
    $modal.header.append("<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>");

    $modal.body = $("<div class=\"modal-body\">").appendTo($modal.content);
    $modal.detail = $("<div class= \"hb-detail\">").appendTo($modal.body);
    $modal.form = $("<div class= \"hb-form\">").appendTo($modal.body);

    $modal.footer = $("<div class=\"modal-footer\">").appendTo($modal.content);
    $modal.footer.append("<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Fermer</button>");

    return $modal;
};

let _getNewPanel = function(id,accordionSelector){
    let $panel = $("<div class=\"panel panel-default\">");
    $panel.heading = $("<div class=\"panel-heading\" role=\"tab\" id=\""+ id +"-heading\">").appendTo($panel);

    $panel.button = $("<a role=\"button\" data-toggle=\"collapse\" data-parent=\"" + accordionSelector + "\" " +
        "href=\"#" + id + "-collapse\" class=\"collapsed\" aria-controls=\""+ id + "-collapse\">lol</a>")
        .appendTo($("<h4 class=\"panel-title\">").appendTo($panel.heading));

    $panel.body = $("<div class=\"panel-body\">")
        .appendTo($("<div id=\""+ id +"-collapse\" class=\"panel-collapse collapse\" " +
            "role=\"tabpanel\" aria-labelledby=\"" + id + "\">").appendTo($panel));
    console.log($panel);
    return $panel;
};

let _buildUploadPanel = function(modal){
    let $modal = modal.$modal;
    $modal.uploadPanel = _getNewPanel('hrp-upload','#resource-picker-accordion');
    $modal.uploadPanel.appendTo($modal.panelGroup);

    let $form = $("div#hb-data form[name='" + modal.option.uploadFormName  + "']");
    console.log($form);
    console.log($form.length>0);
    if($form.length!==1){return [];}
    $form.parent().detach().appendTo($modal.uploadPanel.body);

    $modal.uploadPanel.form = $form;
    $modal.uploadPanel.iframe = $form.parent().find("iframe");

    $modal.uploadPanel.submitButton = $form.parent().find("button[type='submit']");

    $form.find("input[name$='[file]']").on("change",function(){
        let regex = new RegExp("([\\w|-]+)\\.(\\w+)$");
        let pieces = regex.exec($(this).val());
        if(pieces !== null && typeof pieces[1] !== 'undefined'){
            $form.find("input[name$='[name]']").val(pieces[1]);
        }
    });



};

let _buildSelectPanel = function(modal){
    let $modal = modal.$modal;
    $modal.selectPanel = _getNewPanel('hrp-select','#resource-picker-accordion');
    $modal.selectPanel.appendTo($modal.panelGroup);
};

/**
 * @module hb/ui/HResourcePicker
 * @class hb.ui.HResourcePicker
 * @param {object} option
 */
let HResourcePicker = function(option = {}){
    this.errors=[];
    this.object=null;

    this.option = _setDefaultOption(option);
    this.$modal = _build(this);
    this.$modal.title.text(this.option.defaultTitle);

    this.$modal.panelGroup = $("<div class=\"panel-group\" id=\"resource-picker-accordion\" " +
        "role=\"tablist\" aria-multiselectable=\"true\">").appendTo(this.$modal.body);
    _buildUploadPanel(this);
    _buildSelectPanel(this);
    console.log(this.$modal.uploadPanel.button);
    this.$modal.uploadPanel.button.html('Charger depuis votre poste');
    this.$modal.selectPanel.button.html('Selectionner dans votre galerie');

    let modal = this;
    if(!this.$modal.uploadPanel.submitButton){return;}
    this.$modal.uploadPanel.submitButton.on('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        modal.$modal.uploadPanel.form.find(".hb-form-error").each(function(){$(this).remove();});

        let $form = modal.$modal.uploadPanel.form;
        let $iframe = modal.$modal.uploadPanel.iframe;

        let typeId = "resource_post_upload_image";

        let url = $form.parent().find("#" + typeId).html();
        url = url + '?name=' + $form.find("input[name$='[name]']").val();
        $form.attr('action',url);


        console.log($iframe);
        console.log($form);
        console.log($form.attr('target'));

        $form.submit();
    });

    this.$modal.uploadPanel.iframe.on('load',function(event){
        let response = modal.$modal.uploadPanel.iframe.get(0).contentDocument.body.textContent;
        console.log(response);
        response = JSON.parse(response);
        hb.ui.misc.alert(response.status,response.message,modal.$modal.uploadPanel.form);
        if(response.status === "error"){
            if(response.errors !== null && typeof response.errors ==='object'){
                Object.keys(response.errors).map(function(key, index) {
                    let $errorTarget = modal.$modal.uploadPanel.form.find("[name$='["+ key +"]']");
                    let errorMsg = '';
                    for (var i in response.errors[key]){
                        errorMsg = response.errors[key][i];
                        $("<li style='color:red' class='hb-form-error'>").html(errorMsg).
                        insertAfter($errorTarget);
                    }
                });
            }
            return;
        }
        if(response.status === "success"){
            let resource = response.data;
            let name = resource.name + '-' + resource.activeVersion.number;
            if(resource.activeVersion.type && resource.activeVersion.type !==''){
                name = name + '.' + resource.activeVersion.type;
            }
            modal.object.attr('data-hb-value',response.data);
            console.log(modal.object);
            modal.object.text(name);
            let $target = $(modal.object.attr('target'));
            console.log($target);
            if($target !== null){
                $target.attr('value',JSON.stringify(resource));
                $target.trigger("change");
            }
        }
    });
    _applyOption(this);
    return this;
};

let _prototype = {
    bind : function(object,page='detail') {
        this.object = object;
        this.$modal.modal('show');
    },
    refresh:function(page='all'){
        //_refresh(this,page);
    },
    unbind : function() {
        this.object = null;
        this.$modal.modal("hide");
    },
    onHbResourcePickerChange : function($this){
        console.log("change");
        console.log($this);
        let $button = $("a[target=\"#" + $this.attr('id') + "\"]");
        if(typeof $this.attr("value") !== 'undefined' &&
            $this.attr("value") !== null &&
            $this.attr("value") !==''){
            let resource = JSON.parse($this.attr("value"));
            let name = resource.name + '-' + resource.activeVersion.number;
            if(resource.activeVersion.type && resource.activeVersion.type !==''){
                name = name + '.' + resource.activeVersion.type;
            }
            $button.html(name + "&nbsp;");
            console.log(resource);
            if(resource.activeVersion.urlMini && resource.activeVersion.urlMini!==''){
                let $mini = $("<img src=\"" + resource.activeVersion.urlMini + "\"  class=\"img-circle\">");
                $button.append($mini);
            }

            $button.append("&nbsp;");
            let $deleter = $("<i class=\"fa fa-times-circle hb-deleter\"></i>");
            $deleter.attr("target","#" + $this.attr('id'));
            $deleter.on("click",function(event){
                event.preventDefault();
                event.stopPropagation();
                _onHbDeleterClick($(this));
                _onHbResourcePickerChange($this);
            });
            $button.append($deleter);
        }
        else{
            $button.html("Selectionner une image <i class=\"fa fa-image\"></i>");
        }
    }
};

Object.assign(HResourcePicker.prototype,_prototype);

module.exports = HResourcePicker;







