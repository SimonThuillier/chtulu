import React,{ Component } from "react";
import {getIfNeeded} from '../actions';
import {makeGetSelector} from "../selectors";
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
        const { input, label, type, meta: { touched, error } ,get} = this.props;
        let options =  get(this.state.searchBag).map((rec) =>{
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

const makeMapStateToProps = () => {
    const getSelector = makeGetSelector();
    return state => {
        return {
            get: getSelector(state.get("articleType"))
        }
    }
};

/*const mapStateToProps = (state) => {
    const selector = selector || getSelector(state.get("articleType"));
    return {
        selector: selector
    }
};*/

export default connect(makeMapStateToProps)(ArticleTypeSelect);