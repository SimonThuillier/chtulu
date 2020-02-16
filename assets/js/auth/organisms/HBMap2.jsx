import React from "react";
import L from "leaflet";

import debounce from "debounce";
import { getGeoDataFromAbstract} from "../../util/explorerUtil";
import {
     makeGetOneByIdSelector,
} from "../../shared/selectors";
import {connect} from "react-redux";
import {AVAILABLE_AREAS,MAP_TILE_LAYER_URL,MAP_TILE_LAYER_ATTRIBUTION} from '../../util/explorerUtil';
import HDate from '../../util/HDate';

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};

function highlight (layer) {
    layer.setStyle({
        weight: 5,
        dashArray: ''
    });
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}


class HBMap2 extends React.Component {
    constructor(props) {
        super(props);

        this.resizingDelay = 8;

        this.handleContainerResizing = debounce(
            this.handleContainerResizing.bind(this),
            this.resizingDelay
        );

        this.map=null;
        this.drawnItems = null;
        this._updateLayers = this._updateLayers.bind(this);
        this._updateTime = this._updateTime.bind(this);
        this.setMarker = this.setMarker.bind(this);
        this.geoMarkersIndex = new Map();
        this.timedGeoMarkersIndex = [];
    }

    setMarker(event){
        if(event.hbOrigin ===AVAILABLE_AREAS.MAP || !event.iconId.includes('GEO_MARKER')) return;

        const {iconId} = event;

        const icon = document.getElementById(iconId);
        if(!icon) return;

        const markerIndex = this.geoMarkersIndex.get(iconId);
        //console.log('set map index=',iconId,markerIndex);

        if(!!markerIndex){
            const {center,zoom,layers} = markerIndex;
            this.map.setView(new L.LatLng(center.lat,center.lng),zoom,{animate:true});
            layers.forEach((layer)=>{
                /*console.log(L.GeoJSON);
                console.log(layer._leaflet_id);
                console.log(L);*/
                const realLayer = this.drawnItems.getLayer(layer._leaflet_id);
                realLayer.fire('mouseover',{layer:realLayer});
                highlight(this.drawnItems.getLayer(layer._leaflet_id));
                setTimeout(()=>{
                    realLayer.resetStyle();
                },600);
            });
        }
    }



    componentDidMount() {

        const area = {center:[0,0],zoom:2};

        const mainArticle = this.props.getOneById(this.props.mainArticleId);
        if(!!mainArticle && !!mainArticle.area) {
            if(!!mainArticle.area.center){
                area.center[0]= mainArticle.area.center.lat;
                area.center[1]= mainArticle.area.center.lng;
            }
            area.zoom = mainArticle.area.zoom||area.zoom;
        }


        this.map = L.map('mymap', {
            ...area,
            layers: [
                L.tileLayer(MAP_TILE_LAYER_URL, {
                    attribution: MAP_TILE_LAYER_ATTRIBUTION
                }),
            ]
        });
        // necessary to update map properly when its dimensions change
        this.map.on('zoom',()=>{this.map.invalidateSize();});

        const drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        this.drawnItems = drawnItems;

        drawnItems
            .on('click',(e)=>{
                console.log('click on layer ; ',e);
                const event = new CustomEvent('hb.explorer.set.marker');
                event.iconId = e.layer.feature.properties.iconId;
                event.hbOrigin = AVAILABLE_AREAS.MAP;
                window.dispatchEvent(event);
            })
            .bindTooltip('<span id="shapeTooltip"></span>')
            .on('mouseover',(e)=>{
                const layer = e.layer;
                const tooltip = document.getElementById('shapeTooltip');
                tooltip.innerText = ((layer.feature.properties.title||'') +
                    (layer.feature.properties.hDate?(' - ' + HDate.prototype.parseFromJson(layer.feature.properties.hDate).getLabel()):'')
                );
            });

        if(!!this.props.mainArticleId) this._updateLayers();


        // handle marker focus from reader or timeArea
        window.addEventListener('hb.explorer.set.marker',this.setMarker);
    }

    componentWillUnmount(){
        window.removeEventListener('hb.explorer.set.marker',this.setMarker);
    }

    _updateLayers(){
        const mainArticle = this.props.getOneById(this.props.mainArticleId);
        if(!!mainArticle){

            const area = {center:{lat:0,lng:0},zoom:2};

            if(!!mainArticle.area) {
                area.center = mainArticle.area.center||area.center;
                area.zoom = mainArticle.area.zoom||area.zoom;
            }
            this.map.setView(new L.LatLng(area.center.lat,area.center.lng),area.zoom,{animate:true});

            const geoData = getGeoDataFromAbstract(mainArticle);
            //console.log('HBMap2 geoData',geoData);
            this.drawnItems.clearLayers();
            this.geoMarkersIndex = new Map();
            this.timedGeoMarkersIndex = [];

            geoData.forEach(({hGeo,html,id,index})=>{
                let layers = [];

                hGeo.drawnItems.features.forEach((feature)=>{
                    feature.properties.iconId= id;
                    //console.log("add layers, feature=",feature);
                    let geoJsonFeature = new L.GeoJSON(feature);
                    if(!!feature.properties.hDate) {
                        //console.log('HBMap2 feature with HDate', feature, feature.properties.hDate);
                        this.timedGeoMarkersIndex.push({
                            hDate:HDate.prototype.parseFromJson(feature.properties.hDate),
                            layer:geoJsonFeature,
                            displayed:true
                        });
                    }
                    //console.log("add layers, GeoJsonFeature=",geoJsonFeature);
                    this.drawnItems.addLayer(geoJsonFeature);
                    layers.push(geoJsonFeature);
                });
                this.geoMarkersIndex.set(id,{center:hGeo.center,zoom:hGeo.zoom,layers:layers});


            });
        }
    }

    _updateTime(){
        const {hInterval:fullHInterval,cursorDate} = this.props;

        const hInterval = new HDate("2",cursorDate,fullHInterval.endDate);

        this.timedGeoMarkersIndex.forEach(({hDate,layer})=>{
            // console.log('HBMap2 update hInterval : ',hDate,layer);
            if(!hDate.intersects(hInterval)){
                this.drawnItems.removeLayer(layer);
            }
            else if(!this.drawnItems.hasLayer(layer)){
                this.drawnItems.addLayer(layer);
            }
        });


    }

    componentDidUpdate(prevProps){
        // handle resizing
        const isResizing =
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height;

        //console.log("map should update ?");
        //console.log(isResizing);
        if (isResizing) {
            this.handleContainerResizing();
        }
        if (prevProps.isResizing && !this.props.isResizing) {
            setTimeout(this.handleContainerResizing, 2 * this.resizingDelay);
        }


        if(this.props.getOneById !== prevProps.getOneById || this.props.mainArticleId !== prevProps.mainArticleId){
            this._updateLayers();
        }

        if(this.props.hInterval !== prevProps.hInterval || this.props.cursorDate !== prevProps.cursorDate){
            this._updateTime();
        }
    }

    handleContainerResizing() {
        //console.log(this.map);
        this.map.invalidateSize();

        for (let layer in this.layers) {
            //layer.redraw();
        }
    }

    render() {
        const width = this.props.width;
        const height = this.props.height;

        let currentStyle = { ...style };
        currentStyle.width = `${width}px`;
        currentStyle.height = `${height}px`;



        return (
            <div
                id='mymap'
                style={style}
                onDoubleClick={(e)=>{
                    console.log('hbexplorer dbl click');
                    const event = new CustomEvent('hb.explorer.magnify');
                    event.hbOrigin = AVAILABLE_AREAS.MAP;
                    window.dispatchEvent(event);
                    e.preventDefault();
                    e.stopPropagation();
                }
                }
            >
            </div>);
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();

    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("article"))
        }
    }
};

export default connect(makeMapStateToProps)(HBMap2);
