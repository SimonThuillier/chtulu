import React, { Component } from "react";
import {
    Alert,
    Button,
    FormControl,
    FormGroup,
    ControlLabel,
    HelpBlock,
    Row,
    Col,
    Glyphicon,
    Form,
    Panel
} from "react-bootstrap";
import L from "leaflet";
import HDateInput from '../molecules/HDateInput';

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
        this.state = {
            value: props.initialValue,
            errors: []
        };

        this.containerRef = React.createRef();
        this.onMapDblClick = this.onMapDblClick.bind(this);
    }

    isValid() {
        return this.state.errors.length < 1;
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


    componentDidMount() {

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }

        this.map = L.map('hgeo-picker-widget-map-div', {
            center: [0, 0],
            zoom: 0,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: null
                }),
            ]
        });
        // FeatureGroup is to store editable layers
        var drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            }
        });
        this.map.addControl(drawControl);

        const map = this.map;




        this.map.on('draw:created', function (e) {

            function saveIdIW(layer) {
                var sName = $('#shapeName').val();
                var sDesc = $('#shapeDesc').val();

                layer.title = sName;
                layer.content = sDesc;

                if (idIW) {
                    map.closePopup();
                }
            }

            e.layer.bindPopup('<span><b>Shape Name</b></span><br/><input id="shapeName" type="text"/><br/><br/><span><b>Shape Description<b/></span><br/><textarea id="shapeDesc" cols="25" rows="5"></textarea><br/><br/><input type="button" id="okBtn" value="Save" ' +
                'onclick="()=>{saveIdIW(e.layer);}' + '"/>');

            drawnItems.addLayer(e.layer);

            drawnItems.on('click',(e)=>{
                console.log(e.layer);
                $('#shapeName').val(e.layer.title);
            });
        });



        this.map.on('dblclick',this.onMapDblClick);


        if(!!this.props.setMap) this.props.setMap(this.map);


    }

    componentDidUpdate(prevProps){

        if(!!this.props.initialValue && prevProps.initialValue !== this.props.initialValue){

            this.setState({
                value:this.props.initialValue,
                errors: []
            });

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
                                <Row>
                                    <Col sm={3}>
                                        <ControlLabel>Nom (optionnel)</ControlLabel>
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            componentClass="input"
                                            onChange={this.onInputChange}
                                            autoComplete="off"
                                            value={this.state.currentInput}
                                            type="text"
                                            placeholder="nom du marqueur"
                                        />
                                        <FormControl.Feedback />
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
                                    onSave(this.state.value);
                                    onClose();
                                }}
                            >
                                <Glyphicon glyph={this.isValid() ? "ok" : "ban-circle"} />
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
