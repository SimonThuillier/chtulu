import React, { Component } from "react";
import {
    Button,
    FormGroup,
    Row,
    Col,
    Glyphicon,
    Form,
    Panel
} from "react-bootstrap";
import L from "leaflet";
import HGeoInfoWidget from '../widget/HGeoInfoWidget';
import HDate from '../../util/HDate';
import {MAP_TILE_LAYER_URL,MAP_TILE_LAYER_ATTRIBUTION} from '../../util/explorerUtil';

const UUID = require("uuid/v4");

const defaultStyle = {
    position: "absolute",
    backgroundColor: "#EEE",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid #CCC",
    borderRadius: 3,
    //marginLeft: 0,
    marginTop: -0,
    minWidth: 350,
    zIndex: 2000
    //padding: 5
    //width: "500px"
};

const mapStyle = {
    width: "600px",
    height: "600px",
    margin: "0 auto"
};

export default class HGeoPicker extends Component {
    constructor(props) {
        super(props);

        //this.onRootFocus = this.onRootFocus.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.isValid = this.isValid.bind(this);

        this.onSave = this.onSave.bind(this);

        this.state = {
            itemCount:0
        };

        this.containerRef = React.createRef();
        this.onMapDblClick = this.onMapDblClick.bind(this);

        this.drawnItems = null;
        this.drawControl = null;

        this.infoWidget = HGeoInfoWidget;
    }

    isValid() {
        return this.state.itemCount>0;
    }

    onMapDblClick(e){
        console.log("You dblclicked the map at ",e.latlng,"zoom ",this.map.zoom,"center ",this.map.center);

        // const {displayedArticles} = this.props;
        // displayedArticles.forEach((a,id)=>{
        //     if(a.isOpen){
        //         this.handleArticlePlacement(e.latlng,id);
        //     }
        // });
    }

    onSave(){
        const {onSave} = this.props;

        const data = {
            center:this.map.getCenter(),
            zoom:this.map.getZoom(),
            drawnItems:this.drawnItems.toGeoJSON(),

        };

        console.log('on save hgeopicker = ',data);



        onSave(data);
        this.drawnItems.clearLayers();
        this.setState({itemCount:0});
    }


    componentDidMount() {

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }

        this.map = L.map('hgeo-picker-widget-map-div', {
            center: [0, 0],
            zoom: 0,
            layers: [
                L.tileLayer(MAP_TILE_LAYER_URL, {
                    attribution: MAP_TILE_LAYER_ATTRIBUTION
                }),
            ]
        });
        // FeatureGroup is to store editable layers
        const drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        this.drawnItems = drawnItems;

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            },
            remove: {
                featureGroup: drawnItems
            }
        });
        this.map.addControl(drawControl);
        this.drawControl = drawControl;
        console.log('draw control : ',drawControl);

        const map = this.map;
        const component= this;


        this.map.on('draw:created', function (e) {
            let layer = e.layer;

            // this quite weird workaround allows for some extra props appearance in toGeoJSON function result
            let feature = layer.feature = layer.feature || {}; // Initialize feature
            feature.type = feature.type || "Feature"; // Initialize feature.type
            let props = feature.properties = feature.properties || {}; // Initialize feature.properties
            props.id = UUID();
            props.title=null;
            props.hDate=null;
            drawnItems.addLayer(layer);
            console.log('feature group added = ',drawnItems);
            console.log(`geovalid, new item count : ${component.state.itemCount+1}`);
            component.setState({itemCount:component.state.itemCount+1});
        });

        this.map.on('draw:deleted', function (e) {
            console.log(`geovalid deleted, new item count : ${component.state.itemCount-e.layers.getLayers().length}`,e.layers.getLayers().length);
            component.setState({itemCount:component.state.itemCount-e.layers.getLayers().length});
        });

        drawnItems
            //.bindPopup('<span><b>Shape Name</b></span><br/><input id="shapeName" type="text"/><br/><br/><br/><input type="button" id="shapeSaveBtn" value="Save"/>')
            .bindPopup(this.infoWidget.getDOMElement())
            .on('click',(e)=>{
                console.log('click on layer ; ',e)})
            .on('popupopen',(e)=>{
                const layer = e.layer;
                console.log('hGeoInfo layer : ',layer);
                console.log('hGeoInfo element in theory : ',layer.feature.properties);
                this.infoWidget.props({
                    initialValue:{
                    hDate:layer.feature.properties.hDate?HDate.prototype.parseFromJson(layer.feature.properties.hDate):null,
                        title:layer.feature.properties.title||null},
                onSave:(value)=>{
                        console.log('onSave hGeo=',value);
                    layer.feature.properties.hDate = value.hDate?JSON.stringify(value.hDate):null;
                    layer.feature.properties.title = value.title;
                }});
                this.infoWidget.show();
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
            })
            .bindTooltip('<span id="shapeTooltip"></span>')
            .on('mouseover',(e)=>{
            const layer = e.layer;
            const tooltip = document.getElementById('shapeTooltip');
            tooltip.innerText = ((layer.feature.properties.title||'') +
                (layer.feature.properties.hDate?` - ${HDate.prototype.parseFromJson(layer.feature.properties.hDate).getLabel()}`:''));
        });

        this.infoWidget.props({onClose:()=>{map.closePopup();}});




        this.map.on('dblclick',this.onMapDblClick);


        if(!!this.props.setMap) this.props.setMap(this.map);


    }

    componentDidUpdate(prevProps){

        if(prevProps.initialValue !== this.props.initialValue){

            console.log("hgeo new initial value = ",this.props.initialValue);

            const {center,zoom,drawnItems} = this.props.initialValue;

            this.map.setView(new L.LatLng(center.lat,center.lng),zoom);

            let itemCount=0;

            drawnItems.features.forEach((geoJson)=>{
                console.log("add layers, feature=",geoJson);
                let geoJsonFeature = L.GeoJSON.geometryToLayer(geoJson);

                // this quite weird workaround allows for some extra props appearance in toGeoJSON function result
                let feature = geoJsonFeature.feature = geoJsonFeature.feature || {}; // Initialize feature
                feature.type = feature.type || "Feature"; // Initialize feature.type
                let props = feature.properties = feature.properties || {}; // Initialize feature.properties
                props.id = (geoJson.properties && geoJson.properties.id) || UUID();
                props.title=(geoJson.properties && geoJson.properties.title) || 'test';
                props.hDate=(geoJson.properties && geoJson.properties.hDate) || null;
                console.log("add layers, GeoJsonFeature=",geoJsonFeature);
                this.drawnItems.addLayer(geoJsonFeature);
                itemCount=itemCount+1;
            });


            console.log('feature group init = ',this.drawnItems);
            this.setState({itemCount:itemCount});

        }
    }

    onInputChange(e) {

    }

    onChange(e) {
        console.log(`onChange ?`);
        this.setState({ value: e.target.value });
    }

    render() {
        const { className, onClose, onSave,style } = this.props;

        const realStyle = Object.assign({},defaultStyle,style || {});

        /*console.log(this.state.errors);
        console.log(
            this.state.errors.map(err => {
                return err;
            })
        );*/

        console.log(`geovalid, render : ${this.state.itemCount}`);

        return (
            <Panel ref={this.containerRef} id={this.props.id||null} style={realStyle} className={className}>
                <Panel.Heading align="center">
                    Positionnez un marqueur <Glyphicon glyph="pushpin" />
                </Panel.Heading>
                <Panel.Body>
                    <div>

                        <Form horizontal>
                            <FormGroup
                                controlId="formBasicText"
                                validationState={this.isValid() ? "success" : "error"}
                            >
                                <Row>
                                    <Col sm={12}>
                                        <div id='hgeo-picker-widget-map-div' style={mapStyle}>
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </div>
                </Panel.Body>
                <Panel.Footer>
                    <Row className="show-grid">
                        <Col xs={6} sm={6} md={6}>
                            <button
                                type="button"
                                className={"btn btn-primary"}
                                disabled={!this.isValid()}
                                align={"center"}
                                onClick={() => {
                                    this.onSave();
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph={this.isValid() ? "ok" : "ban-circle"} />
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <Button bsStyle="default" align={"center"} onClick={()=>{
                                this.drawnItems.clearLayers();
                                this.setState({itemCount:0});
                                onClose();
                            }}>
                                <Glyphicon glyph="off" />
                            </Button>
                        </Col>
                    </Row>
                </Panel.Footer>
            </Panel>
        );
    }
}
