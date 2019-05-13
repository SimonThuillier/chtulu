import React from "react";
import ReactDOM from "react-dom";

import L from "leaflet";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import debounce from "debounce";

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};

/*const RL = require("react-leaflet");
const { Map: LeafletMap, TileLayer, Marker, Popup } = RL;*/

export default class HBMap extends React.Component {
    constructor(props) {
        super(props);

        this.resizingDelay = 8;

        this.handleContainerResizing = debounce(
            this.handleContainerResizing.bind(this),
            this.resizingDelay
        );

        this.templateIcon = L.icon({
            iconUrl: 'http://localhost:8000/media/cache/mini/246-clement-1.jpeg',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [7, -15],
            shadowUrl: 'http://localhost:8000/media/cache/mini/246-clement-1.jpeg',
            shadowSize: [0, 0],
            shadowAnchor: [0,0]
        });


    }

    componentDidMount() {
        const position = [51, 0];
        const zoom = 6;

        /*this.layers = [
          L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: null
          })
        ];
        // create map
        this.map = L.map("map", {
          center: position,
          zoom: zoom,
          layers: this.layers,
          attributionControl: false
        });

          this.map = (

          );*/




        // add marker
        //this.marker = L.marker(this.props.markerPosition).addTo(this.map);
    }

    shouldComponentUpdate(prevProps) {
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
    }

    handleContainerResizing() {
        //console.log(this.map);
        this.map.leafletElement.invalidateSize();

        for (let layer in this.layers) {
            //layer.redraw();
        }
    }

    render() {
        const width = this.props.width;
        const height = this.props.height;

        const position = [51, 0];
        const zoom = 6;

        let currentStyle = { ...style };
        currentStyle.width = `${width}px`;
        currentStyle.height = `${height}px`;

        return <Map
            center={position} zoom={zoom} style={style}
            ref={node=>this.map=node}
        >
            <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution={null}
            />
            <Marker icon={this.templateIcon} position={position}>
                <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker>
            {/*<Marker position={position}>*/}
            {/*<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>*/}
            {/*</Marker>*/}
        </Map>
            ;

        /*return (
          <LeafletMap
            center={position}
            zoom={zoom}
            onClick={event => {
              console.log("click !");
            }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              minZoom={0}
              maxZoom={32}
            />
          </LeafletMap>
        );*/
    }
}
