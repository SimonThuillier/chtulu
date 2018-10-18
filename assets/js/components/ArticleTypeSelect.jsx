import React,{ Component } from "react";
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import {getIfNeeded} from '../actions';

class ArticleTypeSelect extends Component {

    componentDidMount() {

        const {dispatch} = this.props;
        dispatch(getIfNeeded("articleType"));
    }

    render(){
        const { ArticleType } = this.props;
        //const options = [];
        console.log(ArticleType);
        console.log(Array.from(ArticleType.items.values()));


        const options =  Array.from(ArticleType.items.values()).map((value) =>{
            return(
                <option key={value.id} value={value.id}>
                    {value.label}
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