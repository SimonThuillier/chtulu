import React from "react";
import {Table} from 'react-bootstrap';
import {connect} from "react-redux";
import {
    makeLocalGetByAttributeSelector, makeGetOneByIdSelector,
    makeGetNextNewIdSelector, makeGetNewlyCreatedIdSelector
} from "../../shared/selectors";
import {getIfNeeded} from "../../shared/actions";
import SearchBagUtil from "../../util/SearchBagUtil";
import SearchBag from "../../util/SearchBag";
import DateUtil from "../../util/date";
import HistoryForm from './ArticleHistoryForm';

const historySearchbag = {};
const componentUid = require("uuid/v4")();
const dateFormatter = DateUtil.getFormatterFromPattern('d/m/Y H:i');
import {COLORS} from "../../util/notifications";
class ArticleAdmin extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onHistorySubmit = this.onHistorySubmit.bind(this);

        this.state = {
            historyId:null
        };

        this.loadHistoryIfNecessary = this.loadHistoryIfNecessary.bind(this);
    }

    onHistorySubmit(){
        const {getNextNewHistoryId} = this.props;

        console.log('nextNewHistoryId',getNextNewHistoryId());

        this.setState({historyId:getNextNewHistoryId()});
    }

    loadHistoryIfNecessary(){
        if(this.props.id !== null && +this.props.id>0){
            const {getHistory,dispatch} = this.props;
            const searchBag = SearchBag({article_id:this.props.id},'id',SearchBagUtil.DESC,0,1000);
            dispatch(getIfNeeded("articleHistory",{minimal:true},searchBag,componentUid));
        }
    }

    componentDidMount()
    {
        this.loadHistoryIfNecessary();
        const {getNextNewHistoryId} = this.props;
        const newHistoryId = getNextNewHistoryId();
        console.log('newHistoryId=',newHistoryId);
        this.setState({historyId:newHistoryId});
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.id !== this.props.id){
            this.loadHistoryIfNecessary();
        }
    }

    render()
    {
        const {getHistory,getStatus,dispatch,id} = this.props;
        const {historyId} = this.state;

        //console.log('article history id',id);

        const historyRows = getHistory('articleId',id)
            .sort((a,b)=>{return b.get('editionDate').getTime()-a.get('editionDate').getTime();})
            .map((rec)=>{
            //console.log('article history ',rec.toJS());

            const style = {};
            if(+rec.get('id')<0) style.backgroundColor=COLORS.NEW;

            return (
                <tr style={style} key={rec.get('id')}>
                    <td>{getStatus(+rec.get('status')).get('label')}</td>
                    <td>{dateFormatter(rec.get('editionDate'))}</td>
                    <td>{rec.get('message')}</td>
                </tr>);
        });





        return (
            <div>
                <div
                    className="col-md-6"
                >
                    {(!!id && !!historyId)?
                        <HistoryForm
                            articleId={id}
                            id={historyId}
                            form={`article-${id}-history-form`}
                            onSubmit={this.onHistorySubmit}
                        />
                        :null}
                </div>
                <div
                    className="col-md-6"
                >
                    <h2>Historique de statut</h2>
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>statut</th>
                            <th>date</th>
                            <th>commentaire</th>
                        </tr>
                        </thead>
                        <tbody>
                            {historyRows}
                        </tbody>

                    </Table>
                </div>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getHistorySelector = makeLocalGetByAttributeSelector();
    const getStatusSelector = makeGetOneByIdSelector();
    const getNextNewIdSelector = makeGetNextNewIdSelector();
    const getNewlyCreatedIdSelector = makeGetNewlyCreatedIdSelector();

    return state => {
        return {
            getHistory : getHistorySelector(state.get("articleHistory")),
            getStatus : getStatusSelector(state.get("articleStatus")),
            getNextNewHistoryId: getNextNewIdSelector(state.get("articleHistory")),
            getNewlyCreatedHistoryId:getNewlyCreatedIdSelector(state.get("articleHistory"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleAdmin);
