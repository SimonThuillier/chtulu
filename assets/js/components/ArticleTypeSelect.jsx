import React,{ Component } from "react";
import {ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import {getIfNeeded} from '../actions';

class ArticleTypeSelect extends Component {

    componentDidMount() {

        const {dispatch} = this.props;
        dispatch(getIfNeeded("articleType"));
    }

    render(){
        const { articleType } = this.props;

        const options =  Array.from(articleType.items.values()).map((rec) =>{
            /*console.log(rec);
            console.log(rec.has("id"));*/
            return(
                <option key={rec.get("id")} value={rec.get("id")}>
                    {rec.get("label")}
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