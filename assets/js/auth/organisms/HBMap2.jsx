import React from "react";
import ReactDOM from "react-dom";
import RImageMini from '../../shared/atoms/RImageMini';
import ArticleTitle from '../atoms/ArticleTitle';

import L from "leaflet";

import debounce from "debounce";
import {articleIsOpen} from "../../util/explorerUtil";
import {
     makeGetNewlyCreatedIdSelector, makeGetNextNewIdSelector, makeGetOneByIdSelector,
} from "../../shared/selectors";
import {connect} from "react-redux";
import {getOneByIdIfNeeded,submitLocally,deleteLocally,fetchNew} from "../actions";

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};
const Imm = require("immutable");
const geometryGroups = {minimal:true};
const componentUid = require("uuid/v4")();

class HBMap2 extends React.Component {
    constructor(props) {
        super(props);

        this.resizingDelay = 8;

        this.handleContainerResizing = debounce(
            this.handleContainerResizing.bind(this),
            this.resizingDelay
        );

        this.map=null;

        /*let achenSvgString = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><path d='M2,111 h300 l-242.7,176.3 92.7,-285.3 92.7,285.3 z' fill='#000000'/></svg>"
        let myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace('#','%23');

        this.templateIcon = L.icon({
            iconUrl: myIconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [7, -15],
            shadowUrl: 'http://localhost:8000/media/personnage.jpeg',
            shadowSize: [0, 0],
            shadowAnchor: [0,0]
        });*/
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

        // handle hovering
        const {hoveredArticleId, getOneById} = this.props;

        if(prevProps.hoveredArticleId !== hoveredArticleId){
            if(!!prevProps.hoveredArticleId){
                const oldHoveredMarker = this.markerRefs.get(+prevProps.hoveredArticleId);
                if(!!oldHoveredMarker) oldHoveredMarker.fire('mouseout');
            }
            if(!!hoveredArticleId){
                const hoveredMarker = this.markerRefs.get(+hoveredArticleId);
                if(!!hoveredMarker) hoveredMarker.fire('mouseover');
            }
        }

        if(getOneById !== prevProps.getOneById){
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


        const {} = this.props;


        return (
            <div id='mymap' style={style}>
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
