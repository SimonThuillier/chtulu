import React from "react";
import {deleteLocally, postOne, reset as stateReset} from '../actions';
import {
    makeGetNewlyCreatedIdSelector, makeGetNextNewIdSelector, makeGetNotificationsSelector,
    makeGetPlusBabiesSelector, makeGetSelector, makeGetTotalSelector
} from "../../shared/selectors";
import {connect} from "react-redux";
import {COLORS, LOADING, SUBMITTING} from "../../util/notifications";
import SearchBagUtil from "../../util/SearchBagUtil";
import SearchBag from "../../util/SearchBag";
import paginationFactory from "react-bootstrap-table2-paginator";
import TimeBreadcrumb from "../atoms/TimeBreadcrumb";
import {
    Modal,
    Button,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';
import ArticleFilter from '../organisms/ArticleFilter';
import ArticleType from '../../shared/atoms/ArticleType';
import ArticleStatus from '../../shared/atoms/ArticleStatus';
import ArticleTitle from '../../shared/atoms/ArticleTitle';
import RImageMini from "../../shared/atoms/RImageMini";
import {Edit,Admin,Submit,Reset,Delete,CancelDelete,CancelAdd} from '../atoms/actions';
import Article from "../organisms/Article";
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from "react-router-dom";
import EditButton from "../atoms/EditButton";
import Loadable from 'react-loading-overlay';
import DateUtil from '../../util/date';
import {CURRENT_USER_ID} from '../../util/server';
import UserIconLink from '../../shared/molecules/UserIconLink';
import {getIfNeeded} from "../../shared/actions";

const Imm = require("immutable");
const componentUid = require("uuid/v4")();

const dateFormatter = DateUtil.getFormatterFromPattern('d/m/Y H:i');

const columns = (dispatch,onSelection,getNotifications) => [{
    dataField: 'title',
    text: 'Titre',
    headerStyle:{'width':'20%'},
    formatter: function(cell,row,rowIndex){
        const value = row.detailImageResource;


        //const label = cell

        return (
            <ul>
                {value?<RImageMini id={value}/>:''}&nbsp;
                {+row.id>0?
                    <Link title="page de l'article" className={""} to={`/article/${row.id}`}>
                        <ArticleTitle id={row.id}/>
                    </Link>
                    :
                    <ArticleTitle id={row.id}/>
                }
            </ul>
        );
    },
    sort:true
}, {
    dataField: 'type',
    text: 'Type',
    formatter: function(cell){
        return <ArticleType id={cell}/>
    },
    sort: true
}, {
    dataField: 'status',
    text: 'Statut',
    formatter: function(cell){
        return <ArticleStatus id={cell}/>
    },
    sort: true
}
    ,{
        dataField: 'editionDate',
        text: 'Derniere edition',
        formatter: function(cell,row){
            return dateFormatter(cell);
            //if(!row.editionUser) return dateFormatter(cell);
            //else return (<UserIconLink id={row.editionUser} prefix={dateFormatter(cell) + ' par '} mini={true}/>);
        },
        sort: true
    },{
        dataField: 'summary',
        text: 'Résumé',
        sort:false,
        headerStyle:{'width':'30%'}
    },
//
//     {
//     dataField: 'beginHDate',
//     text: 'Début',
//     formatter: function(cell){
//         //console.log(cell);
//         if(cell === null) return '-';
//         return cell.getLabel();
//     },
//     sort:true
// }, {
//     dataField: 'endHDate',
//     text: 'Fin',
//     formatter: function(cell){
//         //console.log(cell);
//         if(cell === null) return '-';
//         return cell.getLabel();
//     },
//     sort:true
// },
    {
        dataField: 'initialValues',
        text: 'Actions',
        formatExtraData:getNotifications,
        formatter: (cell, row, rowIndex,getNotifications) => {
            const toDelete = (row && row.has("toDelete") && row.get("toDelete"));
            const isNew = !toDelete && (row && row.has("isNew") && row.get("isNew")(row));
            const isDirty = !toDelete && !isNew && (row.has("isDirty") && row.get("isDirty")(row));

            //console.log(`actions formatter id ${row.get("id")} : toDelete:${toDelete}, isNew:${isNew}, isDirty:${isDirty} `);
            const actionUid = componentUid+'#' + row.get("id");
            const notifications = getNotifications(actionUid);
            const submitting = (notifications && notifications.hasIn([+row.get("id"),SUBMITTING]))||false;

            return (
                <Loadable
                    active={submitting}
                    animate
                    text='Enregistrement ...'
                    color={COLORS.SUBMITTING}
                    background={COLORS.LOADING_BACKGROUND}
                >
                    <div>
                        {!toDelete?
                            <Admin onClick={() => onSelection(row,rowIndex,'admin')}/>:''}
                        &nbsp;&nbsp;
                        {toDelete || isNew || isDirty ?
                            <Submit onClick={() => dispatch(postOne("article",null,row.get("id"),actionUid))}/>:''}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {!toDelete && !isNew && isDirty ?
                            <Reset onClick={() =>dispatch(stateReset("article",[row.get("id")],null))}/>:''}
                        {toDelete ?
                            <CancelDelete onClick={() =>dispatch(stateReset("article",[row.get("id")],null))}/>:''}
                        {isNew ?
                            <CancelAdd onClick={() =>dispatch(stateReset("article",[row.get("id")],null))}/>:''}
                        &nbsp;&nbsp;
                        {(!toDelete && !isNew)
                            ?
                            <Delete onClick={() => dispatch(deleteLocally("article",[row.get("id")]))}/>:''}
                    </div>
                </Loadable>);
        }
    }
];

const customTotal = () => (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
    &nbsp;Lignes { from } à { to } affichées parmi { size } résultats
  </span>
);

const rowStyle = (row) => {
    if(row && row.has("hasErrors") && row.get("hasErrors")(row)){
        return {backgroundColor:COLORS.ERROR};
    }
    if(row && row.has("toDelete") && row.get("toDelete")){
        return {backgroundColor:COLORS.DELETED};
    }
    else if(row && row.has("isNew") && row.get("isNew")(row)){
        return {backgroundColor:COLORS.NEW};
    }
    else if(row && row.has("isDirty") && row.get("isDirty")(row)){
        return {backgroundColor:COLORS.DIRTY};
    }
    return {};
};




class UserArticleList extends React.Component{

    constructor(props) {
        super(props);
        this.getBreadcrumb = this.getBreadcrumb.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleComponentSwitch = this.handleComponentSwitch.bind(this);
        this.handleArticleSwitch = this.handleArticleSwitch.bind(this);
        this.loadSearchBag = this.loadSearchBag.bind(this);
        this.onTableChange = this.onTableChange.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.onHasPostedAll = this.onHasPostedAll.bind(this);

        this.onNewArticle = this.onNewArticle.bind(this);
        this.validateNewArticle = this.validateNewArticle.bind(this);

        this.onRowSelection = this.onRowSelection.bind(this);

        this.getUserId = this.getUserId.bind(this);

        this.onSetValid=this.onSetValid.bind(this);

        this.modalRef = null;

        console.log('articleTablePage');

        this.state = {
            searchBag:SearchBag({},"editionDate"),
            groups:{minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}},owner:{minimal:true}},
            selected:null,
            activeId:null,
            breadcrumb:{prev:null,next:null},
            page:1,
            sizePerPage:10,
            activeComponent: 'detail',
            formValid:false
        };
    }

    onSetValid(valid){
        this.setState({formValid:valid});
        console.log('form valid',valid);
    }

    getUserId(){
        return this.props.ownerId || CURRENT_USER_ID;
    }

    componentDidMount(){
        let searchBag = this.state.searchBag;
        if(this.getUserId()){
            searchBag = Object.assign({},searchBag,{search:{ownerId:this.getUserId()}});
            this.setState({searchBag:searchBag});
        }

        console.log('items ownerId searchBag',this.getUserId(),searchBag);
        this.loadSearchBag(this.state.groups,searchBag);

        window.addEventListener('hb.has_posted.all',this.onHasPostedAll);
    }

    componentWillUnmount(){
        window.removeEventListener('hb.has_posted.all',this.onHasPostedAll);
    }

    componentDidUpdate(prevProps) {
        /*console.log("articleTablePage");
        console.log(prevProps.selector !== this.props.selector);*/
        // when babies are submitted all indexes are erased to ensure coherence between server and client so we have to reload
        if (this.state.activeId && this.state.activeId<0 &&
            prevProps.getNewlyCreatedId !== this.props.getNewlyCreatedId
            && this.props.getNewlyCreatedId(this.state.activeId)) {
            this.setState({activeId:this.props.getNewlyCreatedId(this.state.activeId)});
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
        else if (prevProps.getPlusBabies !== this.props.getPlusBabies &&
            this.props.getPlusBabies(this.state.searchBag).length<1) {
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
    }

    loadSearchBag(groups,searchBag){
        const {dispatch} = this.props;
        dispatch(getIfNeeded("article",groups,searchBag,componentUid));
    }

    getBreadcrumb(id){
        let breadcrumb = {prev:null,next:null};
        const items = this.props.getPlusBabies(this.state.searchBag);

        if(items.length>0){
            const index = items.findIndex((item)=>{return item.id === id;});
            breadcrumb = {
                prev:(index>0)?{id:items[index-1].id,title:items[index-1].title}:null,
                next:(index<items.length-1)?{id:items[index+1].id,title:items[index+1].title}:null
            };
        }
        return breadcrumb;
    }

    validateNewArticle(){
        const event = new CustomEvent('hb.article.leave.form');
        event.articleId = this.state.activeId;
        window.dispatchEvent(event);
        setTimeout(()=>{
            this.handleClose();
        },50);
    }

    onHasPostedAll(event){
        if(event.newItems.includes('article')){
            const searchBag = Object.assign(SearchBag({},"editionDate"),{search:{ownerId:this.getUserId()}});
            this.loadSearchBag(this.state.groups,searchBag);
            this.setState({searchBag:searchBag});
        }
    }

    onNewArticle(){
        console.log('vous voulez un nouvel article ?');
        const {getNextNewId} = this.props;
        this.setState({
            selected:[],
            activeId:getNextNewId(),
            activeComponent:'form',
            breadcrumb:null
        });
    }

    onRowSelection(row,rowIndex,activeComponent='admin'){

        this.setState({
            selected:[row.id],
            activeId:row.id,
            activeComponent:activeComponent,
            breadcrumb:this.getBreadcrumb(row.id)
        });
    }

    handleClose() {
        this.setState({
            activeId: null ,
            selected: [],
            breadcrumb:{prev:null,next:null}
        });
    }

    handleComponentSwitch(activeComponent='detail') {
        console.log(activeComponent);
        this.setState({ activeComponent: activeComponent });
    }

    handleArticleSwitch(id) {
        this.setState({
            selected:[id],
            activeId:id,
            breadcrumb:this.getBreadcrumb(id)
        });
    }

    onFilter(values){
        console.log("filter submitted");
        console.log(values);

        const searchBag = Object.assign({}, this.state.searchBag,{search:Object.assign(values,{ownerId:this.getUserId()})});
        this.loadSearchBag(this.state.groups,searchBag);
        this.setState({searchBag:searchBag});
    }

    onTableChange(type,newState){
        /*console.log("on table change");
        console.log(type);
        console.log(newState);*/
        let searchBag = {};
        switch(type){
            case 'pagination':
                const {page,sizePerPage} = newState;
                searchBag = Object.assign({}, this.state.searchBag,{offset:(page-1)*sizePerPage,limit:sizePerPage});
                this.loadSearchBag(this.state.groups,searchBag);
                this.setState({searchBag:searchBag,page:page,sizePerPage:sizePerPage});
                break;
            case 'sort':
                const {sortField,sortOrder} = newState;
                searchBag = Object.assign({}, this.state.searchBag,{sort:sortField,order:sortOrder.toUpperCase()});
                this.loadSearchBag(this.state.groups,searchBag);
                this.setState({searchBag:searchBag});
                break;
            default:
                break;
        }
    }

    render(){
        const {getPlusBabies,getTotal,getNotifications,dispatch} = this.props;
        const {activeComponent,breadcrumb,searchBag,formValid} = this.state;

        const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(searchBag));

        let items = getPlusBabies(searchBag);
        console.log("searchbag - items",searchBag,coreBagKey,items);
        console.log("items-"+coreBagKey);
        let total = getTotal(searchBag);
        const notifications = getNotifications(componentUid);


        const loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;

        const activeArticleTitle = ((items.find((item)=> item.id === this.state.activeId) &&
            items.find((item)=> item.id === this.state.activeId).title)) || 'Nouvel article';
        const alreadyCreatedArticle = this.state.activeId > 0;

        return(
            <div>
                <Loadable
                    active={loading}
                    spinner
                    text='Chargement des données ...'
                    color={COLORS.LOADING}
                    background={COLORS.LOADING_BACKGROUND}
                >
                    <Button bsStyle="success" onClick={this.onNewArticle}>
                        Ajouter&nbsp;<Glyphicon glyph="plus" />
                    </Button>
                    <ArticleFilter searchBag={searchBag} onSubmit={this.onFilter}/>
                    <BootstrapTable
                        keyField='id'
                        data={ items }
                        wrapperClasses={'hb-table'}
                        rowStyle={rowStyle}
                        pagination={ paginationFactory({
                            page:this.state.page,
                            sizePerPage:this.state.sizePerPage,
                            totalSize:total,
                            showTotal:true,
                            paginationTotalRenderer:customTotal(),
                            withFirstAndLast:true

                        })}
                        selectRow={{
                            hideSelectColumn:true,
                            mode :'radio',
                            style: { backgroundColor: COLORS.TABLE_SELECTED },
                            selected:this.state.selected,
                        }}
                        remote={ {
                            filter: true,
                            pagination: true,
                            sort: true,
                            cellEdit: true
                        } }
                        onTableChange={this.onTableChange}
                        loading={loading}
                        columns={columns(dispatch,this.onRowSelection,getNotifications)}
                    />

                    <Modal show={this.state.activeId !== null} onHide={this.handleClose}>
                        <Modal.Header>
                            <Modal.Title>
                                <Row className="show-grid">
                                    <Col xs={9} sm={9} md={9}>
                                        <h5><ArticleType articleId={this.state.activeId}/></h5>
                                        &nbsp;&nbsp;&nbsp;
                                        {alreadyCreatedArticle?
                                            <Link
                                                to={`/article/${this.state.activeId}/${this.state.activeComponent==='form'?'edit':''}`}
                                                className={'btn btn-link'}
                                                title={"Page principale de l'article"}
                                            >
                                                <h4><ArticleTitle id={this.state.activeId}/></h4>
                                            </Link>
                                            :
                                            activeArticleTitle}

                                    </Col>
                                    <Col xs={3} sm={3} md={3}>
                                        {breadcrumb && TimeBreadcrumb({sense:-1,target:breadcrumb.prev,switcher:this.handleArticleSwitch})}
                                        {breadcrumb && TimeBreadcrumb({sense:1,target:breadcrumb.next,switcher:this.handleArticleSwitch})}
                                    </Col>
                                </Row>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body ref={input => (this.modalRef = input)}>
                            <Article
                                container={this.modalRef}
                                dispatch={dispatch}
                                id={this.state.activeId}
                                handleSwitch={()=>{this.handleComponentSwitch(activeComponent==='detail'?'form':'detail')}}
                                onNothing={this.handleClose}
                                context={'modal'}
                                groups={{minimal:true,date:true,detailImage:true,abstract:true,owner:{minimal:true}}}
                            >
                                <div hidden={this.state.activeId<0 ||  activeComponent!=='admin'}>
                                    <Article.Admin/>
                                </div>
                                <div hidden={this.state.activeId>0 && activeComponent!=='form'}>
                                    <Article.Form setValid={this.onSetValid} autoSubmit={false}/>
                                </div>
                            </Article>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row>
                                <Col md={2}>
                                    {
                                        activeComponent==='detail' &&
                                        <EditButton
                                            onClick={()=>{this.handleComponentSwitch(activeComponent==='detail'?'form':'detail')}}
                                        />
                                    }
                                    {
                                        activeComponent==='form' &&
                                        <Button bsStyle="success" disabled={!formValid} onClick={this.validateNewArticle}>
                                            Valider creation&nbsp;<Glyphicon glyph="ok" />
                                        </Button>
                                    }
                                </Col>
                                <Col md={8}>

                                </Col>
                                <Col md={2}>
                                    <Button onClick={this.handleClose}>Annuler</Button>
                                </Col>
                            </Row>
                        </Modal.Footer>
                    </Modal>
                </Loadable>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getSelector = makeGetSelector();
    const getPlusBabiesSelector = makeGetPlusBabiesSelector();
    const getNextNewIdSelector = makeGetNextNewIdSelector();
    const getNewlyCreatedIdSelector = makeGetNewlyCreatedIdSelector();
    const getTotalSelector = makeGetTotalSelector();
    const getNotificationsSelector = makeGetNotificationsSelector();

    return state => {
        const dataSubState = state.get("article");
        return {
            get: getSelector(dataSubState),
            getPlusBabies : getPlusBabiesSelector(dataSubState),
            getNextNewId: getNextNewIdSelector(dataSubState),
            getNewlyCreatedId:getNewlyCreatedIdSelector(dataSubState),
            getTotal:getTotalSelector(dataSubState),
            getNotifications: getNotificationsSelector(state.get("app"))
        }
    }
};

export default connect(makeMapStateToProps)(UserArticleList);
