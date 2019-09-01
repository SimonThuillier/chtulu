import React from 'react';
import {connect} from "react-redux";
import {
    getBabiesSelector, getNewlyCreatedIdSelector, getNextNewIdSelector, getNotificationsSelector,
    getSelector,
    totalSelector2
} from "../../shared/selectors";
import {Helmet} from 'react-helmet';
import HBExplorerProxy from "../organisms/HBExplorerProxy.jsx";
import HDate from "../../util/HDate";

export class ExplorerPage extends React.Component {
    constructor(props) {
        super(props);

        console.log("building explorerPage");
        console.log(props);

        this.state = {
        };
    }

    componentDidMount(){
        const {dispatch} = this.props;
    }

    componentDidUpdate(prevProps) {
    }


    render(){

        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>Explorateur</title>
                </Helmet>
                {/*<section className="content-header">*/}
                    {/*<h4>Explorateur</h4>*/}
                {/*</section>*/}
                <section className="content no-padding">
                    <div>
                        <HBExplorerProxy/>
                    </div>
                </section>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {

    }
};

export default connect(mapStateToProps)(ExplorerPage);