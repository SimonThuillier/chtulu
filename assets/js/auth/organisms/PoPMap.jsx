import React from "react";
import ReactDOM from "react-dom";
import RImageMini from '../../shared/atoms/RImageMini';
import ArticleTitle from '../../shared/atoms/ArticleTitle';



import debounce from "debounce";
import {articleIsOpen} from "../../util/explorerUtil";
import {
     makeGetNewlyCreatedIdSelector, makeGetNextNewIdSelector, makeGetOneByIdSelector,makeGetSelector
} from "../../shared/selectors";
import {connect} from "react-redux";
import {submitLocally,deleteLocally} from "../actions";
import {fetchNewIfNeeded, createNew, getIfNeeded} from "../../shared/actions";

import SearchBag from '../../util/SearchBag';
import SearchBagUtil from '../../util/SearchBagUtil';

import PopWidget from '../widget/PopWidget';
import L from "leaflet";
import {getOneByIdIfNeeded} from "../../shared/actions";
require("../../leaflet/PoPMarker");

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};
const Imm = require("immutable");
const geometryGroups = {minimal:true};
const componentUid = require("uuid/v4")();

function initializeLayerFeature(layer,type='feature'){
    let feature = layer.feature = layer.feature || {};
    feature.type = type;
    feature.properties = feature.properties || {};
    return layer;
}

/*const ArticleIcon = (props) =>(
        <svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'>
            <defs>
                <pattern id={`article-image-${props.article.id}`} x='0' y='0' patternUnits='userSpaceOnUse' height='30' width='30'>
                    <RImageMini deltaX={0} id={props.article.detailImageResource} mode={'svg'}/>
                </pattern>
            </defs>
            <circle
                cx={20}
                cy={20}
                r='13'
                fill={`url(#article-image-${props.article.id})`}
            />
        </svg>);*/

const ArticleIcon = (props) =>(
                <RImageMini deltaX={0} id={props.article.detailImageResource} mode={'url'}/>
);

const popSearchbag = SearchBag({});
popSearchbag.limit=-1;
console.log(popSearchbag,'popSearchbag');

class PoPMap extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(fetchNewIfNeeded('pop'));

        this.resizingDelay = 8;

        this.handleContainerResizing = debounce(
            this.handleContainerResizing.bind(this),
            this.resizingDelay
        );
        this.getMarkerDragEndHandler = this.getMarkerDragEndHandler.bind(this);
        this.onMapDblClick = this.onMapDblClick.bind(this);
        this.handleArticlePlacement = this.handleArticlePlacement.bind(this);
        this.handleArticleIcons = this.handleArticleIcons.bind(this);

        this.updatePopLayer = this.updatePopLayer.bind(this);

        this.map=null;
        this.markerRefs = new Map();
        this.iconSvgRefs = new Map();

        this.popWidget = PopWidget;
    }

    getMarkerDragEndHandler(id){
        return (e) =>{this.handleArticlePlacement(e.target._latlng,id)};
    }

    onMapDblClick(e){
        console.log("You dblclicked the map at ",e.latlng);

        const {displayedArticles} = this.props;
        displayedArticles.forEach((a,id)=>{
            if(a.isOpen){
                this.handleArticlePlacement(e.latlng,id);
            }
        });
    }

    handleArticlePlacement(latlng,id){
        const {articles,dispatch,getNextNewId} = this.props;
        const article = articles.find((element)=>{return element.id === id});
        if(!article) return;
        console.log(`You want to place article of id ${article.id} at ${latlng}`);

        let geometryId = article.geometry;
        if(geometryId===null){
            geometryId =  getNextNewId();
            console.log(`establishing new geometry of id ${geometryId} for article ${article.id}`);
            dispatch(submitLocally("article",Imm.Map({geometry:geometryId}), article.id,{geometry:true}));
        }
        setTimeout(()=>{
            console.log(`submitting new geometry of id ${geometryId} for article ${article.id}`);
            dispatch(submitLocally("resourceGeometry",Imm.Map({
                    targetGeometry:{value:{type:"Point",coordinates:[latlng.lat,latlng.lng]}}
                }),
                geometryId,geometryGroups));
        },30);
    }

    componentDidMount() {
        this.props.dispatch(getIfNeeded("pop",{minimal:true},popSearchbag,componentUid));

        this.map = L.map('popmap', {
            center: [43.8703278, -69.8079838],
            zoom: 11,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: null
                }),
            ]
        });

        const pops = new L.FeatureGroup();
        this.map.addLayer(pops);
        this.pops = pops;

        const drawControl = new L.Control.Chtulu({
            draw: {
                pop: true
            },
            edit: {
                featureGroup: pops
            },
            remove: {
                featureGroup: pops
            }
        });

        // const drawControl2 = new L.Control.Draw({
        //     draw: {
        //         polyline: false,
        //         rectangle:false,
        //         circle:true,
        //         circlemarker:false,
        //         polygon: true,
        //         marker: true,
        //     },
        //     edit: {
        //         featureGroup: drawnItems
        //     },
        //     remove: {
        //         featureGroup: drawnItems
        //     }
        // });


        //L.control.popmarker({}).addTo(this.map);



        this.map.addControl(drawControl);
        // this.map.addControl(drawControl2);
        this.drawControl = drawControl;

        const popMap = this;

        this.map.on('draw:created', function (e) {
            const {dispatch,getNextNewPopId} = popMap.props;
            let layer = e.layer;
            console.log('new layer created ',e.layer);

            initializeLayerFeature(layer);
            let props = layer.feature.properties;

            const popId =  getNextNewPopId();

            if(layer.options && layer.options.icon && layer.options.icon.customData
                && layer.options.icon.customData.customType==='pop'){
                layer.feature.type = 'pop';
                props.id = popId;

                pops.addLayer(layer);
                console.log(`establishing new pop of id ${popId}`);
                // dispatch(getOneByIdIfNeeded("pop",{minimal:true}, popId,componentUid));
                const latlng = layer._latlng;
                dispatch(createNew('pop'));
                dispatch(submitLocally("pop",
                    Imm.Map({targetGeometry:{value:{type:"Point",coordinates:[latlng.lng,latlng.lat]}}}),
                    popId,{minimal:true}));
            }

        });

        const test = this.popWidget.getDOMElement();
        console.log(test);

        pops
            .bindPopup(this.popWidget.getDOMElement())
            .on('click',(e)=>{
                console.log('click on layer ; ',e);
            })
            .on('popupopen',(e)=>{
                const layer = e.layer;
                console.log('opening widget for pop');
                this.popWidget.props({
                    initialValue:{},
                    onSave:(value)=>{
                        //layer.feature.properties.title = value.title;
                    }});
                this.popWidget.show();
                /*
                const input = $('#shapeName');
                const saveButton = $("#shapeSaveBtn");
                input.val(layer.feature.properties.title||null);
                console.log('popupopen on layer ; ',e,input,saveButton);
                saveButton.on('click',()=>{
                    console.log('save layer name',input.val());
                    layer.feature.properties.title = input.val();
                    map.closePopup();
                });*/
            });

        this.popWidget.props({onClose:()=>{map.closePopup();}});

        this.map.on('zoom',()=>{this.map.invalidateSize();});
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

        // update of pops
        if(this.props.getPop !== prevProps.getPop){
            const pops = this.props.getPop(popSearchbag);
            console.log('pops received from server',pops);
            this.updatePopLayer(pops);
        }
    }

    updatePopLayer(records){
       console.log('update poplayer');
       console.log(records);
       console.log(this.pops);

       const pops = this.pops;
       const map = this.map;

       records.forEach((rec)=>{
           const id = rec.get('id');

           console.log(rec.get('targetGeometry'),rec.toGeoJSON());
           const test = L.geoJSON(rec.toGeoJSON());
           const layer = L.GeoJSON.geometryToLayer(rec.get('targetGeometry').value);
           initializeLayerFeature(layer,'pop');
           const properties = layer.feature.properties;
           properties.id = id;
           console.log(layer);
           pops.addLayer(layer);
           //map.addLayer(layer);
       });
    }

    handleArticleIcons(){
        //console.log('article icons svg ref');
        //console.log(this.iconSvgRefs);
        const {setHoveredArticle, getOneById} = this.props;

        // 1 delete not necessary markers
        this.markerRefs.forEach((ref,id)=>{
            if(!this.iconSvgRefs.has(+id)){
                ref.removeFrom(this.map);
                this.markerRefs.delete(+id);
            }
        });


        this.iconSvgRefs.forEach((object,id)=>{
            const {geometryId,ref} = object;
            if(!!ref && !!ref.innerHTML && !this.markerRefs.has(+id)){
                //console.log(test);
                //let myIconUrl = encodeURI("data:image/svg+xml;base64," + btoa(ref.innerHTML)).replace('#','%23');
                console.log(ref.innerHTML);
                console.log(geometryId);
                const geometry = getOneById(+geometryId);
                if(geometry === null || geometry.targetGeometry ===null) return;
                console.log(geometry.targetGeometry.value.coordinates);

                let icon = L.icon({
                    iconUrl:ref.children[0].innerHTML,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [7, -15],
                    shadowUrl: null,
                    shadowSize: [15, 15],
                    shadowAnchor: [0,0]
                });

                const {selectArticle} = this.props;

                const marker = L.marker(geometry.targetGeometry.value.coordinates, {
                        icon: icon,
                        draggable:true,
                        riseOnHover:true,
                        title:null
                    }
                );
                this.markerRefs.set(+id,marker);
                marker.addTo(this.map)
                    .on('click',()=>{selectArticle([id])})
                    .on('dragend',this.getMarkerDragEndHandler(id))
                    .on('mouseover',()=>{setHoveredArticle(id)})
                    .on('mouseout',()=>{setHoveredArticle()});

                const tooltip = marker.bindTooltip(ref.children[1].children[0].innerHTML);
                    //.bindTooltip("my tooltip text").openTooltip();
            }
        });
    }

    /*shouldComponentUpdate(prevProps) {
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
        return isResizing;
    }*/

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
        currentStyle.width = width;
        currentStyle.height = height;


        const articles = [];
        const displayedArticles = new Map();

        const arrayOfArticlesToDisplay = articles.filter((a) => {return !!a.geometry;});
        this.iconSvgRefs = new Map();
        const iconSvgRefs = this.iconSvgRefs;
        //console.log(iconSvgRefs);

        const articleSvgIconRefs = arrayOfArticlesToDisplay.map((a) => {
            return (
                <div ref={(ref)=>{iconSvgRefs.set(+a.id,{geometryId:+a.geometry,ref:ref})}} hidden={true}
                     key={`article-svg-icon-div-${a.id}`}>
                    <div>
                        <ArticleIcon
                            key={`article-svg-icon-${a.id}`}
                            selected={articleIsOpen(displayedArticles,+a.id)}
                            article={a}
                        />
                    </div>
                    <div>
                        <ArticleTitle id={a.id}/>
                    </div>
                </div>
            );
        });

        setTimeout(this.handleArticleIcons,15);

        return (
            <div id='popmap' style={currentStyle}>
                {articleSvgIconRefs}
            </div>);
    }
}

const makeMapStateToProps = () => {

    return state => {
        return {
            getPop: makeGetSelector()(state.get("pop")),
            getOnePopById: makeGetOneByIdSelector()(state.get("pop")),
            getNextNewPopId: makeGetNextNewIdSelector()(state.get("pop")),
            getNewlyCreatedPopId: makeGetNewlyCreatedIdSelector()(state.get("pop"))
        }
    }
};

export default connect(makeMapStateToProps)(PoPMap);
