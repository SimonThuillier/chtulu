import React from 'react';
import ArticleTypeSelect from './ArticleTypeSelect';
import {connect} from "react-redux";
import {getOneByIdSelector} from "../selectors";
import Article from './Article';
import {Helmet} from 'react-helmet';
import {getOneByIdIfNeeded} from "../actions";
import {ButtonToolbar,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';

export class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 32,
            selector:props.selector,
            loading: false,
            activeComponent:'form',
            detailGroups:props.detailGroups || {"minimal":true,"abstract":true,"date":true,
                "detailImage":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            formGroups:props.formGroups || {"minimal":true,"abstract":true,"date":true},
            //pendingData: (props.data)?Object.create(props.data):null,
        };
    }

    componentDidMount(){
        const {dispatch} = this.props;
        /*dispatch(getOneByIdIfNeeded("article",
            this.state.formGroups,
            this.state.id));*/
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.setState({id:this.props.id});
        }
        if (prevProps.selector !== this.props.selector) {
            this.setState({selector:this.props.selector});
        }
    }

    render(){
        const {selector,id} = this.state;
        const data = selector(id);

        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>Page1</title>
                </Helmet>
                <section className="content-header">
                </section>
                <section className="content">
                    <h4>{data && data.get("title")}</h4>
                    <Article
                        dispatch={this.props.dispatch}
                        id={this.state.id}
                        activeComponent={this.state.activeComponent}
                        detailGroups={this.state.detailGroups}
                        formGroups={this.state.formGroups}
                        />

                </section>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(Page1);