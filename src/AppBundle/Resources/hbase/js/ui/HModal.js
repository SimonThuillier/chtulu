/**
 * @package HModal.js
 * @doc HModal.js :
 */
var hb = (function (hb) {
    "use strict";
    var _moduleName = "ui:HModal/HModal.js";
    if (((typeof hb.getLoadedModules === "function" ? hb.getLoadedModules() : [])).includes(_moduleName)) {
        console.log(_moduleName + " already loaded, skipping");
        return hb;
    }
    hb.ui = (function (ui, hb, $) {
        var _requiredModules = ["util:cmn/cmn.js","util:HArticle/HArticle.js",
            "util:trans/translation.js","util:HDate/HDate.js"];

        /**
         * @doc setDefaultOption for HArticleModal
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
            option.defaultTitle = option.defaultTitle || "Nouvel objet";
            option.groups = option.groups || ["minimal"];
            return option;
        };
        /**
         * @doc apply options to HArticleModal
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
            $modal.container = $("<div class=\"modal-dialog modal-lg\" role=\"document\">").appendTo($modal);
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

        let _buildDetail = function(modal){
            modal.builtGroups=modal.detailBuilder.build(modal.$modal.detail,modal.option.groups);
            modal.detailMediator.$target = modal.$modal;
        };

        let _buildForm = function(modal){
            modal.$modal.editButton = _addEditButton(modal.$modal);
            modal.formBuiltGroups=modal.formBuilder.build(modal.$modal.form,modal.option.groups);
            modal.formMediator.$target = modal.$modal;
        };

        let _addEditButton = function(modal){
            let $modal = modal.$modal;
            $modal.editButton = $('<a class="edit" title="Edition rapide"><i class="fa fa-pencil"></i></a>');
            $modal.editButton.insertAfter($modal.title);
            $modal.editButton.editButton.on("click",function(){
                $modal.editButton.hide();
                $modal.detail.hide();
                $modal.find(".hb-alert").remove();
                $modal.form.show();
                modal.formMediator.map();
            });
            return $modal.editButton;
        };

        let _addFormEvents = function(modal){
            let $modal = modal.$modal;
            $modal.form.find("#cancel").on("click",function(){
                $modal.form.hide();
                $modal.editButton.show();
                $modal.find(".hb-alert").remove();
                $modal.detail.show();
                modal.refresh('detail');
            });
            $modal.form.find("form").on("submit",function(event,element){
                event.preventDefault();
                event.stopPropagation();
                //console.log("submitted form");
                console.log(event);
                console.log($(event.target).serializeArray().slice());
                modal.formMediator.return($(event.target).serializeArray().slice(),modal.object.urlBag.post);
            });
            $modal.form.find("#delete").on("click",function(event,element){
                event.preventDefault();
                event.stopPropagation();
                //console.log("submitted delete");
                modal.formMediator.delete($(this),function(){
                    modal.object.$bsTable.bootstrapTable('remove', {field: 'id', values: [modal.object.id]});
                    modal.unbind();
                });
            });
        };

        /**
         * @doc refresh HModal
         * @private
         */
        let _refresh = function(modal,page='all')
        {
            let $modal = modal.$modal;
            if(['all','form'].includes(page) && modal.formMediator){
                modal.formMediator.map();
                if($modal.editButton){$modal.editButton.hide();}
                $modal.detail.hide();
                $modal.form.show();
            }
            if(['all','detail'].includes(page) && modal.detailMediator){
                modal.detailMediator.map();
                if($modal.editButton){$modal.editButton.show();}
                $modal.form.hide();
                $modal.detail.show();
            }
        };

        /**
         * @module hb/ui/HModal
         * @class hb.ui.HModal
         * @param {object} option
         */
        ui.HModal = function(option = {}){
            this.errors=[];
            this.object=null;

            this.option = _setDefaultOption(option);
            this.$modal = _build(this);

            this.detailBuilder = this.option.detailBuilder;
            this.detailMediator = this.option.detailMediator;
            this.formBuilder = this.option.formBuilder;
            this.formMediator = this.option.formMediator;

            if(this.detailBuilder && this.detailMediator){
                _buildDetail(this);
            }
            if(this.formBuilder && this.formMediator){
                _buildForm(this);
            }
            _applyOption(this);
            return this;
        };

        let _prototype = {
            bind : function(object,page='detail') {
                this.object = object;
                if(this.detailMediator)this.detailMediator.object = object;
                if(this.formMediator)this.formMediator.object = object;
                this.refresh(page);
            },
            refresh:function(page='all'){
                _refresh(this,page);
            },
            unbind : function() {
                this.object = null;
                if(this.detailMediator)this.detailMediator.object = null;
                if(this.formMediator)this.formMediator.object = null;
                this.$modal.modal("hide");
            }
        };
        Object.assign(ui.HModal.prototype,_prototype);


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
