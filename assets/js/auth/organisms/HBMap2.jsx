import React from "react";
import L from "leaflet";

import debounce from "debounce";
import { getGeoDataFromAbstract} from "../../util/explorerUtil";
import {
     makeGetNewlyCreatedIdSelector, makeGetNextNewIdSelector, makeGetOneByIdSelector,
} from "../../shared/selectors";
import {connect} from "react-redux";
import {AVAILABLE_AREAS} from '../../util/explorerUtil';

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};

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
        this.setMarker = this.setMarker.bind(this);
        this.geoMarkersIndex = new Map();
    }

    setMarker(event){
        if(event.hbOrigin ===AVAILABLE_AREAS.MAP || !event.iconId.includes('GEO_MARKER')) return;

        const {iconId} = event;

        const icon = document.getElementById(iconId);
        if(!icon) return;

        const markerIndex = this.geoMarkersIndex.get(iconId);
        console.log('set map index=',iconId,markerIndex);
        const {center,zoom} = markerIndex;

        if(!!markerIndex){
            this.map.setView(new L.LatLng(center.lat,center.lng),zoom,{animate:true});
        }
    }



    componentDidMount() {
        this.map = L.map('mymap', {
            center: [0, 0],
            zoom: 2,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: null
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
                tooltip.innerText = (layer.feature.properties.title||null);
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
            const geoData = getGeoDataFromAbstract(mainArticle);
            console.log('HBMap2 geoData',geoData);
            this.drawnItems.clearLayers();
            this.geoMarkersIndex = new Map();

            geoData.forEach(({hGeo,html,id,index})=>{

                this.geoMarkersIndex.set(id,{center:hGeo.center,zoom:hGeo.zoom});

                hGeo.drawnItems.features.forEach((feature)=>{
                    feature.properties.iconId= id;
                    console.log("add layers, feature=",feature);
                    let geoJsonFeature = L.geoJson(feature);
                    console.log("add layers, GeoJsonFeature=",feature);
                    this.drawnItems.addLayer(geoJsonFeature);
                });


            });
        }
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
