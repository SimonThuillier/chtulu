import React from "react";
import {Popover,OverlayTrigger,Tooltip,Image,ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
const uuidv4 = require('uuid/v4');
import { getOneByIdIfNeeded} from "../actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import {getOneByIdSelector} from "../selectors";
import {connect} from "react-redux";

/*const formDataTransformer = {
    abstract:function(value){
        return value.replace('<br />',"\n");
    }
};*/

class Article extends React.Component{
    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.state = {
            activeComponent: props.activeComponent||'detail',
            id: props.id||null,
            loading: false,
            detailGroups:props.detailGroups || {"minimal":true,"abstract":true,
                "detailImage":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            formGroups:props.formGroups || {"minimal":true},
            //pendingData: (props.data)?Object.create(props.data):null,
        };
        console.log("Article built");
        //console.log(props.data);
        //console.log(this.state.pendingData);
    }

    onDataLoading(){
        this.setState({
            loading:true
        });
    }

    componentDidMount(){
        console.log("Article begin Mount");
        const {dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",this.state.detailGroups, this.state.id));
    }


    handleSwitch() {
        const newActive = (this.state.activeComponent === 'detail')?'form':'detail';
        this.setState({ activeComponent:  newActive});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            console.log(`update ${prevProps.id} vs ${this.props.id}`);
            const {dispatch} = this.props;
            dispatch(getOneByIdIfNeeded("article",this.state.detailGroups, this.props.id));
            this.setState({id:this.props.id});
        }
    }

    render(){
        return (
            <Loadable
                active={this.state.loading}
                spinner
                text='Chargement des données...'
                color='black'
                background='rgba(192,192,192,0.4)'
            >
                {this.state.activeComponent==='detail' &&
                <div hidden={this.state.activeComponent!=='detail'}>
                    <ArticleDetail
                        id={this.state.id}
                        groups={this.state.detailGroups}
                        data={this.props.selector(this.state.id)}
                        handleSwitch={this.handleSwitch}
                    />
                </div>}
                {this.state.activeComponent==='form' &&
                <div hidden={this.state.activeComponent!=='form'}>
                    {this.state.activeComponent==='form' &&
                    <ArticleForm
                    id={this.state.id}
                    groups={this.state.formGroups}
                    handleSwitch={this.handleSwitch}
                    // changeHandler={this.getChangeHandler.bind(this)}
                    />}
                </div>}
            </Loadable>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(Article);