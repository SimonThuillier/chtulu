import React from 'react';
import {connect} from "react-redux";
import {getNewlyCreatedIdSelector, getNextNewIdSelector, getOneByIdSelector} from "../selectors";
import Article from './Article';
import {Helmet} from 'react-helmet';

export class ArticlePage extends React.Component {
    constructor(props) {
        super(props);

        console.log("building articlePage");
        console.log(props);
        console.log(props.match.params.id);

        this.handleComponentSwitch = this.handleComponentSwitch.bind(this);


        this.state = {
            id: +props.id||+props.match.params.id,
            activeComponent:props.activeComponent||(props.match.params.actionParam==='edit'?'form':'detail'),
            detailGroups:props.detailGroups || {"minimal":true,"abstract":true,"date":true,
                "detailImage":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            formGroups:props.formGroups || {"minimal":true,"abstract":true,"date":true,"detailImage":true},
            //pendingData: (props.data)?Object.create(props.data):null,
        };
    }

    componentDidMount(){
        const {dispatch,nextNewIdSelector} = this.props;
        if(!this.state.id){
            this.setState({id:nextNewIdSelector(),activeComponent:'form'})
        }
        /*dispatch(getOneByIdIfNeeded("article",
            this.state.formGroups,
            this.state.id));*/
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({id:+this.props.match.params.id});
        }
    }

    handleComponentSwitch(activeComponent='detail') {
        this.setState({ activeComponent: activeComponent });
    }

    render(){
        const {id} = this.state;
        const {selector} = this.props;
        const article = selector(id);

        const articleTitle = (article && article.get("title")) || 'Nouvel article';

        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>{articleTitle}</title>
                </Helmet>
                <section className="content-header">
                    <h4>{articleTitle}</h4>
                </section>
                <section className="content">
                    <Article
                        id={this.state.id}
                        activeComponent={this.state.activeComponent}
                        detailGroups={this.state.detailGroups}
                        formGroups={this.state.formGroups}
                        handleSwitch={this.handleComponentSwitch}
                        />
                </section>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const selector = selector || getOneByIdSelector(state.get("article"));
    const nextNewIdSelector = getNextNewIdSelector(state.get("article"));
    const newlyCreatedIdSelector = getNewlyCreatedIdSelector(state.get("article"));
    return {
        selector: selector,
        nextNewIdSelector: nextNewIdSelector,
        newlyCreatedIdSelector:newlyCreatedIdSelector
    }
};

export default connect(mapStateToProps)(ArticlePage);