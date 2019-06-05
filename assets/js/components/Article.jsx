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
        this.state = {
            id: props.id||null,
            loading: false,
            groups: {
                detail : props.detailGroups || {"minimal":true,"date":true,"abstract":true,"detailImage":true},
                form : props.formGroups ||
                {"minimal":true,"date":true,"abstract":true,"detailImage":true}
            }
        };
        console.log("Article built");
    }

    componentDidMount(){
        console.log("Article begin Mount");
        const {activeComponent,dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",this.state.groups[activeComponent], this.state.id,componentUid));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            console.log(`update ${prevProps.id} vs ${this.props.id}`);
            const {activeComponent,dispatch} = this.props;
            dispatch(getOneByIdIfNeeded("article",this.state.groups[activeComponent], this.props.id,componentUid));
            this.setState({id:this.props.id});
        }
    }

    render(){
        const {selector,notificationsSelector,activeComponent,handleSwitch} = this.props;
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
                {activeComponent==='detail' &&
                <div hidden={activeComponent!=='detail'}>
                    <ArticleDetail
                        id={this.state.id}
                        groups={this.state.groups[activeComponent]}
                        data={selector(this.state.id)}
                        handleSwitch={handleSwitch}
                    />
                </div>}
                {activeComponent==='form' &&
                <div hidden={activeComponent!=='form'}>
                    {activeComponent==='form' &&
                    <ArticleForm
                    container={this.props.container || null}
                    id={this.state.id}
                    groups={this.state.groups[activeComponent]}
                    handleSwitch={handleSwitch}
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