import React,{ Component } from "react";
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import {getIfNeeded} from '../actions';
import {getSelector} from "../reducers";
import { connect } from 'react-redux'
import SearchBag from "../util/SearchBag";

class ArticleTypeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBag:SearchBag(),
            items:props.selector,
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getIfNeeded("articleType"));
    }

    render(){
        console.log("render article Select");
        const options =  this.props.selector(this.state.searchBag).map((rec) =>{
            return(
                <option key={rec.get("id")} value={rec.get("id")}>
                    {rec.get("label")}
                </option>
            );
        });
        console.log(options);

        return(
            <FormGroup validationState={null} controlId="formControlsSelect">
                <ControlLabel>Type</ControlLabel>
                <FormControl componentClass="select" placeholder="choisissez un type d'article">
                    {options}
                </FormControl>
            </FormGroup>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = selector || getSelector(state.articleType);
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleTypeSelect);