import React from 'react';
import {connect} from "react-redux";
import {Helmet} from 'react-helmet';
import HBExplorerProxy from "../organisms/HBExplorerProxy.jsx";

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

        let search = this.props.location.search;
        if(search) search = search.replace('?','');
        else search=null;

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
                        <HBExplorerProxy initialSearch={search}/>
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