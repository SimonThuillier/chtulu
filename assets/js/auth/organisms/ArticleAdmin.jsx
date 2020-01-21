import React from "react";
import {Table} from 'react-bootstrap';
import {connect} from "react-redux";
import {makeLocalGetByAttributeSelector,makeGetOneByIdSelector} from "../../shared/selectors";
import {getIfNeeded} from "../actions";
import SearchBagUtil from "../../util/SearchBagUtil";
import SearchBag from "../../util/SearchBag";
import DateUtil from "../../util/date";
import HistoryForm from './ArticleHistoryForm';

const historySearchbag = {};
const componentUid = require("uuid/v4")();
const dateFormatter = DateUtil.getFormatterFromPattern('d/m/Y H:i');

class ArticleAdmin extends React.Component
{
    constructor(props)
    {
        super(props);

        this.loadHistoryIfNecessary = this.loadHistoryIfNecessary.bind(this);
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

        const searchBag = SearchBag({article_id:this.props.id},'id',SearchBagUtil.DESC,0,1000);

        const historyRows = getHistory(searchBag).map((rec)=>{
            console.log('article history ',rec.toJS());

            return (
                <tr key={rec.get('id')}>
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

                    {(!!id)?<HistoryForm form={`article-${id}-history-form`}/>:null}
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

    return state => {
        return {
            getHistory : getHistorySelector(state.get("articleHistory")),
            getStatus : getStatusSelector(state.get("articleStatus"))
        }
    }
};

export default connect(makeMapStateToProps)(ArticleAdmin);
