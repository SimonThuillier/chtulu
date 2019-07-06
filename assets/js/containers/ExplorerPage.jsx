import React from 'react';
import {connect} from "react-redux";
import {
    getBabiesSelector, getNewlyCreatedIdSelector, getNextNewIdSelector, getNotificationsSelector,
    getSelector,
    totalSelector2
} from "../selectors/index";
import {Helmet} from 'react-helmet';
import HBExplorerProxy from "../components/HBExplorerProxy.jsx";
import HBExplorerProxyOld from "../components/HBExplorerProxyOld.jsx";
import HDate from "../util/HDate";

export class ExplorerPage extends React.Component {
    constructor(props) {
        super(props);

        console.log("building explorerPage");
        console.log(props);

        this.state = {
        };
    }

    componentDidMount(){
        const {dispatch,nextNewIdSelector} = this.props;
    }

    componentDidUpdate(prevProps) {
    }


    render(){

        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>{!!this.props.old? 'Explorateur Old':'Explorateur' }</title>
                </Helmet>
                {/*<section className="content-header">*/}
                    {/*<h4>Explorateur</h4>*/}
                {/*</section>*/}
                <section className="content no-padding">
                    <div>
                        {!!this.props.old &&
                        <HBExplorerProxyOld/>
                        }
                        {!this.props.old &&
                        <HBExplorerProxy/>
                        }
                    </div>
                </section>
            </div>
        )
    }
}


const mapStateToProps = state => {
    const selector = selector || getSelector(state.get("article"));
    const babiesSelector = getBabiesSelector(state.get("article"));
    const nextNewIdSelector = getNextNewIdSelector(state.get("article"));
    const totalSelector = totalSelector2(state.get("article"));
    const newlyCreatedIdSelector = getNewlyCreatedIdSelector(state.get("article"));
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        babiesSelector:babiesSelector,
        nextNewIdSelector: nextNewIdSelector,
        totalSelector:totalSelector,
        newlyCreatedIdSelector:newlyCreatedIdSelector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(ExplorerPage);