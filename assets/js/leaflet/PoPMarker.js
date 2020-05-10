import L from "leaflet";
import Draw from "leaflet-draw";

const Popmarker = L.Marker.extend({

    // A property with initial value = 42
    myDemoProperty: 42,

    // A method
    myDemoMethod: function() { return this.myDemoProperty; }

});

L.Draw.Popmarker= L.Draw.Feature.extend({
    statics: {
        TYPE: 'popmarker'
    },
    options: {
        position: 'topleft',
    },
    initialize: function (map, options /*{ data: {...}  }*/) {
        this.type = L.Draw.Popmarker.TYPE;

        this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start;

        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },
    onAdd: function (map) {
        // happens after added to map
        var container = L.DomUtil.create('div', 'leaflet-bar');
        this.button = L.DomUtil.create('a', 'fa fa-users', container);
        this.button.title='ajouter des PoPs';
        L.DomEvent.addListener(this.button, 'click',()=>{console.log('click')}, this);
        // L.DomEvent.addListener(this.form, 'submit', this.submit, this);
        // L.DomEvent.disableClickPropagation(container);
        return container;
    },
});


L.Chtulu = L.Chtulu || {};

L.Chtulu.Pop = {TYPE:'pop'};


L.Chtulu.Pop = L.Draw.Marker.extend({
    statics: {
        TYPE: 'pop'
    },

    options: {
        icon: new L.Icon.Default(),
        repeatMode: false,
        customType:'pop',
        zIndexOffset: 2000 // This should be > than the highest z-index any markers
    },
    initialize: function (map, options) {
        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Chtulu.Pop.TYPE;

        this._initialLabelText = 'lol';

        this.options.icon.customData = {customType:'pop'};

        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },


    _createMarker: function (latlng) {
        const pop = new L.Marker(latlng, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset
        });
        console.log('returned pop : ',pop);
        return pop;
    }
});


L.ChtuluToolbar = L.DrawToolbar.extend({
    statics: {
        TYPE: 'chtulu'
    },

    options: {
        pop: {},
    },

    BUTTON_CLASSNAMES : {'pop':'leaflet-draw-draw-marker fa fa-users'},

    _createButton: function (options) {
        console.log('options : ', options);

        var link = L.DomUtil.create('a', this.BUTTON_CLASSNAMES[options.type], options.container);
        // Screen reader tag
        var sr = L.DomUtil.create('span', 'sr-only', options.container);

        link.href = '#';
        link.appendChild(sr);

        if (options.title) {
            link.title = options.title;
            sr.innerHTML = options.title;
        }

        if (options.text) {
            link.innerHTML = options.text;
            sr.innerHTML = options.text;
        }

        /* iOS does not use click events */
        var buttonEvent = this._detectIOS() ? 'touchstart' : 'click';

        L.DomEvent
            .on(link, 'click', L.DomEvent.stopPropagation)
            .on(link, 'mousedown', L.DomEvent.stopPropagation)
            .on(link, 'dblclick', L.DomEvent.stopPropagation)
            .on(link, 'touchstart', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, buttonEvent, options.callback, options.context);

        return link;
    },

    getModeHandlers: function (map) {
        return [
            {
                enabled: this.options.pop,
                handler: new L.Chtulu.Pop(map, this.options.pop),
                title: 'ajouter des PoPs'
            }
        ];
    }
});

L.Control.Chtulu = L.Control.Draw.extend({
    // @method initialize(): void
    // Initializes draw control, toolbars from the options
    initialize: function (options) {
        if (L.version < '0.7') {
            throw new Error('Leaflet.draw 0.2.3+ requires Leaflet 0.7.0+. Download latest from https://github.com/Leaflet/Leaflet/');
        }

        L.Control.prototype.initialize.call(this, options);

        var toolbar;

        this._toolbars = {};

        // Initialize toolbars
        if (L.ChtuluToolbar && this.options.draw) {
            toolbar = new L.ChtuluToolbar(this.options.draw);

            this._toolbars[L.ChtuluToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.ChtuluToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }

        if (L.EditToolbar && this.options.edit) {
            toolbar = new L.EditToolbar(this.options.edit);

            this._toolbars[L.EditToolbar.TYPE] = toolbar;

            // Listen for when toolbar is enabled
            this._toolbars[L.EditToolbar.TYPE].on('enable', this._toolbarEnabled, this);
        }
        L.toolbar = this; //set global var for editing the toolbar
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-draw'),
            addedTopClass = false,
            topClassName = 'leaflet-draw-toolbar-top',
            toolbarContainer;

        console.log('toolbars : ',this._toolbars);
        for (var toolbarId in this._toolbars) {
            if (this._toolbars.hasOwnProperty(toolbarId)) {
                toolbarContainer = this._toolbars[toolbarId].addToolbar(map);

                if (toolbarContainer) {
                    // Add class to the first toolbar to remove the margin
                    if (!addedTopClass) {
                        if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
                            L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
                        }
                        addedTopClass = true;
                    }

                    container.appendChild(toolbarContainer);
                }
            }
        }

        return container;
    },

    // onAdd: function (map) {
    //     // happens after added to map
    //     var container = L.DomUtil.create('div', 'leaflet-bar');
    //     this.button = L.DomUtil.create('a', 'fa fa-users', container);
    //     this.button.title='ajouter des PoPs';
    //     L.DomEvent.addListener(this.button, 'click',()=>{console.log('click')}, this);
    //     // L.DomEvent.addListener(this.form, 'submit', this.submit, this);
    //     // L.DomEvent.disableClickPropagation(container);
    //     return container;
    // }
});


console.log("leaflet popmarker2",L);