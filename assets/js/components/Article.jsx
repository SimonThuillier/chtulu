import React from "react";
import {Popover,OverlayTrigger,Tooltip,Image,ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
const componentUid = require('uuid/v4')();
import { getOneByIdIfNeeded} from "../actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import {getOneByIdSelector,getNotificationsSelector} from "../selectors";
import {connect} from "react-redux";
import {LOADING,COLORS} from '../util/notifications';

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
        };
        console.log("Article built");
    }

    componentDidMount(){
        console.log("Article begin Mount");
        const {dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",this.state.detailGroups, this.state.id,componentUid));
    }


    handleSwitch() {
        const newActive = (this.state.activeComponent === 'detail')?'form':'detail';
        this.setState({ activeComponent:  newActive});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            console.log(`update ${prevProps.id} vs ${this.props.id}`);
            const {dispatch} = this.props;
            dispatch(getOneByIdIfNeeded("article",this.state.detailGroups, this.props.id,componentUid));
            this.setState({id:this.props.id});
        }
    }

    render(){
        const {selector,notificationsSelector} = this.props;
        const notifications = notificationsSelector(componentUid);
        const loading = (notifications && notifications.hasIn([this.state.id || 'DEFAULT',LOADING]))||false;
        //,this.state.id || 'DEFAULT',LOADING]);
        console.log("notifications");
        console.log(loading);
        console.log(notifications);

        return (
            <Loadable
                active={loading}
                spinner
                text="Chargement de l'article ..."
                color={COLORS.LOADING}
                background={COLORS.LOADING_BACKGROUND}
            >
                {this.state.activeComponent==='detail' &&
                <div hidden={this.state.activeComponent!=='detail'}>
                    <ArticleDetail
                        id={this.state.id}
                        groups={this.state.detailGroups}
                        data={selector(this.state.id)}
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
                    onNothing={this.props.onNothing}
                    />}
                </div>}
            </Loadable>
        );
    }
}

const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    const notificationsSelector = notificationsSelector || getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(Article);