import React,{ Component } from "react";
import {getIfNeeded} from '../actions';
import {getSelector} from "../selectors";
import { connect } from 'react-redux'
import SearchBag from "../util/SearchBag";
import HBFormField from './HBFormField';

class ArticleTypeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBag:SearchBag(),
            items:props.selector,
            required:(typeof props.required !=='undefined')?props.required:true
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getIfNeeded("articleType"));
    }

    render(){
        const { input, label, type, meta: { touched, error } ,selector} = this.props;
        let options =  selector(this.state.searchBag).map((rec) =>{
            return(
                <option key={rec.get("id")} value={rec.get("id")}>
                    {rec.get("label")}
                </option>
            );
        });

        if(!this.state.required){
            options.unshift(
                <option key={0} value={''}>
                {''}
            </option>)
        }

        return(
            <HBFormField {...this.props} options={options}/>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = selector || getSelector(state.get("articleType"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleTypeSelect);