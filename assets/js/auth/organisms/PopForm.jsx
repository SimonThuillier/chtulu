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


export default class PopForm extends Component {
    constructor(props) {
        super(props);

        //this.onRootFocus = this.onRootFocus.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.isValid = this.isValid.bind(this);

        this.onSave = this.onSave.bind(this);

        this.state = {
        };

        this.containerRef = React.createRef();
    }

    isValid() {
        return true;
    }

    onSave(){
        const {onSave} = this.props;

        const data = {};
        onSave(data);
    }


    componentDidMount() {

        if(!!this.props.setContainerRef){
            this.props.setContainerRef(this.containerRef);
        }

    }

    componentDidUpdate(prevProps){

        if(prevProps.initialValue !== this.props.initialValue){

            console.log("hgeo new initial value = ",this.props.initialValue);


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
                                // controlId="formBasicText"
                                validationState={this.isValid() ? "success" : "error"}
                            >
                                <Row>
                                    <Col sm={12}>
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
