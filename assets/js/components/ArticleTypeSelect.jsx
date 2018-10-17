import React,{ Component } from "react";
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import {getData} from '../actions';

class ArticleTypeSelect extends Component {

    componentDidMount() {

        const {dispatch} = this.props;
        dispatch(getData("truc"));
    }

    render(){
        const { type } = this.props;
        //const options = [];

        const options =  typeof type !== 'undefined' && Object.keys(type).map((id) =>{
            return(
                <option key={type[id].id} value={type[id].id}>
                    {type[id].label}
                </option>
            );
        });

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

export default ArticleTypeSelect;