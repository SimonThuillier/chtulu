import React,{ Component } from "react";
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import {getData} from '../actions';

class ArticleTypeSelect extends Component {

    componentDidMount() {

        /*const { dispatch, getData } = this.props;
        dispatch(getData("truc"));*/
    }

    render(){
        const { types } = this.props;

        const options =  types.map((option) =>{
            return(
                <option value={option.id}>
                    {option.label}
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