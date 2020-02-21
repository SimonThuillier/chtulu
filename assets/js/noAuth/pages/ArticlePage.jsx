import React from 'react';
import {connect} from "react-redux";
import {Helmet} from 'react-helmet';
import HBExplorerProxy from "../organisms/HBExplorerProxy.jsx";
import {makeGetOneByIdSelector} from "../../shared/selectors";
import {getOneByIdIfNeeded,notifyArticleSelection} from '../../shared/actions';

export class ArticlePage extends React.Component {
    constructor(props) {
        super(props);

        /*console.log(props);
        console.log(props.match.params.id);*/

        const {id} = props.match.params;

        this.state = {
            id: +props.id||+id,
        };
    }

    componentDidMount(){
        const {dispatch} = this.props;
        /*if(!this.state.id){
            this.setState({id:nextNewIdSelector(),activeComponent:'form'})
        }*/
        if(!!this.state.id){
            dispatch(getOneByIdIfNeeded("article",
                {
                    minimal:true,
                    date:true,
                    detailImage:{minimal:true,urlMini:true},
                    abstract:true,
                    geometry:true,
                    owner:{minimal:true}
                },
                this.state.id));

            dispatch(notifyArticleSelection(+this.state.id));
        }
    }

    componentDidUpdate(prevProps) {
        const id = +this.props.id||+this.props.match.params.id;
        const oldId = +this.state.id;
        if (id !== oldId) {
            this.setState({id:+id});
            this.props.dispatch(notifyArticleSelection(+id));
        }
    }

    render(){
        const {id} = this.state;
        const {getOneById} = this.props;
        const article = getOneById(id);

        const articleTitle = (article && article.get("title")) || 'Nouvel article';

        return (
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>{articleTitle}</title>
                </Helmet>
                <section className="content no-padding">
                    <div>
                        <HBExplorerProxy
                            mainArticleId={+id}
                        />
                    </div>
                </section>
            </div>
        )
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        const dataSubState = state.get("article");

        return {
            getOneById : getOneByIdSelector(dataSubState)
        }
    }
};

export default connect(makeMapStateToProps)(ArticlePage);