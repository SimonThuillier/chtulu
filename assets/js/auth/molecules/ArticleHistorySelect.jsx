import React,{ Component } from "react";
import {getIfNeeded} from '../actions';
import {makeGetSelector} from "../../shared/selectors";
import { connect } from 'react-redux'
import SearchBag from "../../util/SearchBag";
import HBFormField from '../hoc/HBFormField';
import SearchBagUtil from '../../util/SearchBagUtil';


class ArticleHistorySelect extends Component {
    constructor(props) {
        super(props);

        const searchBag = SearchBag();
        searchBag.sort='label';
        searchBag.order=SearchBagUtil.ASC;

        this.state = {
            searchBag:searchBag,
            items:props.selector,
            required:(typeof props.required !=='undefined')?props.required:true
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getIfNeeded("articleHistory",true,this.state.searchBag));
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
            get: getSelector(state.get("articleHistory"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleHistorySelect);