import React from 'react';
import ArticleTypeSelect from './ArticleTypeSelect';
import {connect} from "react-redux";
import {getOneByIdSelector} from "../reducers";
import ArticleForm from './ArticleForm';
import {Helmet} from 'react-helmet';
import {getOneByIdIfNeeded} from "../actions";

export class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 32,
            loading: false,
            formGroups:props.formGroups || {"minimal":true,"abstract":true,"date":true,
                "detailImageResource":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            //pendingData: (props.data)?Object.create(props.data):null,
        };
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",
            this.state.formGroups,
            this.state.id));
    }

    render(){
        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>Page1</title>
                </Helmet>
                <section className="content-header">
                </section>
                <section className="content">
                    <ArticleForm
                        id={this.state.id}
                        groups={this.state.formGroups}
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