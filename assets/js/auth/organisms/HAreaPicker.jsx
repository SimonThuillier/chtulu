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

export default class HAreaPicker extends Component {
    constructor(props) {
        super(props);

        //this.onRootFocus = this.onRootFocus.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

        this.onSave = this.onSave.bind(this);

        this.containerRef = React.createRef();
        this.onMapDblClick = this.onMapDblClick.bind(this);
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
            zoom:this.map.getZoom()
        };

        console.log('on save hAreaPicker = ',data);

        onSave(data);
    }


    componentDidMount() {

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }

        const area = {center:[0,0],zoom:0};
        const {initialValue} = this.props;

        if(!!initialValue){
            area.center = initialValue.center||area.center;
            area.zoom = initialValue.zoom||area.zoom;
        }

        this.map = L.map('harea-picker-widget-map-div', {
            ...area,
            layers: [
                L.tileLayer(MAP_TILE_LAYER_URL, {
                    attribution: MAP_TILE_LAYER_ATTRIBUTION
                }),
            ]
        });
    }

    componentDidUpdate(prevProps){

        if(prevProps.initialValue !== this.props.initialValue){
            console.log("hgeo new initial value = ",this.props.initialValue);
            const {center,zoom} = this.props.initialValue;
            this.map.setView(new L.LatLng(center.lat,center.lng),zoom);
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

        return (
            <Panel ref={this.containerRef} id={this.props.id||null} style={realStyle} className={className}>
                <Panel.Heading align="center">
                    Zone de l'article <Glyphicon glyph="pushpin" />
                </Panel.Heading>
                <Panel.Body>
                    <div>

                        <Form horizontal>
                            <FormGroup
                                controlId="formBasicText"
                                validationState="success"
                            >
                                <Row>
                                    <Col sm={12}>
                                        <div id='harea-picker-widget-map-div' style={mapStyle}>
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
                                align={"center"}
                                onClick={() => {
                                    this.onSave();
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph="ok"/>
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <Button bsStyle="default" align={"center"} onClick={onClose}>
                                <Glyphicon glyph="off" />
                            </Button>
                        </Col>
                    </Row>
                </Panel.Footer>
            </Panel>
        );
    }
}
