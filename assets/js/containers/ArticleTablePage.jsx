import React, {Component} from 'react';
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';
import {Edit,Submit,Reset,Delete,CancelDelete,CancelAdd} from '../components/actions';
import {
    Modal,
    OverlayTrigger,
    Tooltip,
    Button,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';
import Article from "../components/Article";
import {deleteLocally, getIfNeeded, postOne, reset as stateReset} from "../actions/index";
import SearchBag from '../util/SearchBag';
import SearchBagUtil from '../util/SearchBagUtil';
import ArticleType from '../components/ArticleType';
import {connect} from "react-redux";
import {
    getNotificationsSelector,
    getSelector,
    totalSelector2,
    getNextNewIdSelector,
    getBabiesSelector,
    getNewlyCreatedIdSelector
} from "../selectors/index";
import RImageMini from "../components/RImageMini";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ArticleFilter from '../components/ArticleFilter';
import {LOADING,SUBMITTING, COLORS, SUBMITTING_COMPLETED} from "../util/notifications";
import {untouch as formUntouch} from "redux-form/immutable";
import {getAllPropertiesInGroups} from "../util/WAOUtil";
const componentUid = require('uuid/v4')();


const columns = (dispatch,onSelection,notificationsSelector) => [{
    dataField: 'title',
    text: 'Titre',
    formatter: function(cell,row,rowIndex){
        const value = row.detailImageResource;
        return (
            <div><Button onClick={()=>{onSelection(row,rowIndex)}}
                         title={"Previsualiser l'article"}
                         bsStyle="link">
                {cell}
            </Button>
                &nbsp;
                {value?<RImageMini id={value}/>:''}
            </div>
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
    dataField: 'beginHDate',
    text: 'Début',
    formatter: function(cell){
        //console.log(cell);
        if(cell === null) return '-';
        return cell.getLabel();
    },
    sort:true
}, {
    dataField: 'endHDate',
    text: 'Fin',
    formatter: function(cell){
        //console.log(cell);
        if(cell === null) return '-';
        return cell.getLabel();
    },
    sort:true
},{
    dataField: 'initialValues',
    text: 'Actions',
    formatExtraData:notificationsSelector,
    formatter: (cell, row, rowIndex,notificationsSelector) => {
        const toDelete = (row && row.has("toDelete") && row.get("toDelete"));
        const isNew = !toDelete && (row && row.has("isNew") && row.get("isNew")(row));
        const isDirty = !toDelete && !isNew && (row.has("isDirty") && row.get("isDirty")(row));

        console.log(`actions formatter id ${row.get("id")} : toDelete:${toDelete}, isNew:${isNew}, isDirty:${isDirty} `);
        const actionUid = componentUid+'#' + row.get("id");
        const notifications = notificationsSelector(actionUid);
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
                        <Edit onClick={() => onSelection(row,rowIndex,'form')}/>:''}
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

// if(row && row.has("toDelete") && row.get("toDelete")){
//     return {backgroundColor:COLORS.DELETED};
// }
// else if(row && row.has("isNew") && row.get("isNew")(row)){
//     return {backgroundColor:COLORS.NEW};
// }
// else if(row && row.has("isDirty") && row.get("isDirty")(row)){
//     return {backgroundColor:COLORS.DIRTY};
// }

const customTotal = (babiesCount) => (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
    &nbsp;Lignes { from } à { to } affichées parmi { size } résultats{babiesCount>0?` + ${babiesCount} article(s) ajouté(s)`:''}
  </span>
);

const leftBreadcrumb = (breadcrumb,switcher) => {
    return ((breadcrumb.prev)?<OverlayTrigger
        placement="left"
        overlay={
            <Tooltip id="prev-tooltip">
                {breadcrumb.prev.title}
            </Tooltip>
        }>
        <Button onClick={() => {switcher(breadcrumb.prev.id)}}>
            <Glyphicon glyph="menu-left" />
        </Button>
    </OverlayTrigger>:<span>&nbsp;&nbsp;&nbsp;</span>);
};

const rightBreadcrumb = (breadcrumb,switcher) => {
    //const id = breadcrumb.next?breadcrumb.next.id:null;

    return ((breadcrumb.next)?<OverlayTrigger
        placement="right"
        overlay={
            <Tooltip id="next-tooltip">
                {breadcrumb.next.title}
            </Tooltip>
        }>
        <Button onClick={() => {switcher(breadcrumb.next.id)}}>
            <Glyphicon glyph="menu-right" />
        </Button>
    </OverlayTrigger>:<span>&nbsp;&nbsp;&nbsp;</span>);
};

const rowStyle = (row, rowIndex) => {
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

class ArticleTablePage extends React.Component{

    constructor(props) {
        super(props);
        this.getBreadcrumb = this.getBreadcrumb.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleComponentSwitch = this.handleComponentSwitch.bind(this);
        this.handleArticleSwitch = this.handleArticleSwitch.bind(this);
        this.loadSearchBag = this.loadSearchBag.bind(this);
        this.onTableChange = this.onTableChange.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.onNewArticle = this.onNewArticle.bind(this);

        this.onRowSelection = this.onRowSelection.bind(this);

        this.modalRef = null;

        this.state = {
            loading:false,
            searchBag:SearchBag({}),
            groups:{minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}}},
            selected:null,
            activeId:null,
            breadcrumb:{prev:null,next:null},
            page:1,
            sizePerPage:10,
            activeComponent: 'detail',
        };
    }

    componentDidMount(){
        this.loadSearchBag(this.state.groups,this.state.searchBag);
    }

    componentDidUpdate(prevProps) {
        console.log("articleTablePage");
        console.log(prevProps.selector !== this.props.selector);
        // when babies are submitted all indexes are erased to ensure coherence between server and client so we have to reload
        if (this.state.activeId && this.state.activeId<0 &&
            prevProps.newlyCreatedIdSelector !== this.props.newlyCreatedIdSelector
        && this.props.newlyCreatedIdSelector(this.state.activeId)) {
            this.setState({activeId:this.props.newlyCreatedIdSelector(this.state.activeId)});
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
        else if (prevProps.babiesSelector !== this.props.babiesSelector) {
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
        else if (prevProps.selector !== this.props.selector && this.props.selector(this.state.searchBag).length<1) {
            this.loadSearchBag(this.state.groups,this.state.searchBag);
        }
    }

    loadSearchBag(groups,searchBag){
        const {dispatch} = this.props;
        dispatch(getIfNeeded("article",groups,searchBag,componentUid));
    }

    getBreadcrumb(id){
        let breadcrumb = {prev:null,next:null};
        const items = this.props.selector(this.state.searchBag);

        if(items.length>0){
            const index = items.findIndex((item)=>{return item.id === id;});
            breadcrumb = {
                prev:(index>0)?{id:items[index-1].id,title:items[index-1].title}:null,
                next:(index<items.length-1)?{id:items[index+1].id,title:items[index+1].title}:null
            };
        }
        return breadcrumb;
    }

    onNewArticle(){
        console.log('vous voulez un nouvel article ?');
        const {nextNewIdSelector} = this.props;
        this.setState({
            selected:[],
            activeId:nextNewIdSelector(),
            activeComponent:'form',
            breadcrumb:null
        });
    }

    onRowSelection(row,rowIndex,activeComponent='detail'){

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

        const searchBag = Object.assign({}, this.state.searchBag,{search:values});
        this.loadSearchBag(this.state.groups,searchBag);
        this.setState({searchBag:searchBag});
    }

    onTableChange(type,newState){
        console.log("on table change");
        console.log(type);
        console.log(newState);
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
        const {selector,babiesSelector,totalSelector,notificationsSelector,dispatch} = this.props;
        const babies = babiesSelector();
        const babiesCount = babies.length;

        let items = babies.concat(selector(this.state.searchBag));
        console.log("items");
        console.log(items);
        let total = totalSelector(this.state.searchBag);
        const notifications = notificationsSelector(componentUid);

        const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(this.state.searchBag));
        const loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;

        const activeArticleTitle = ((items.find((item)=> item.id === this.state.activeId) &&
            items.find((item)=> item.id === this.state.activeId).title)) || 'Nouvel article';
        const alreadyCreatedArticle = this.state.activeId > 0;

        return(
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>Liste des articles</title>
                </Helmet>
                <Loadable
                    active={loading}
                    spinner
                    text='Chargement des données ...'
                    color={COLORS.LOADING}
                    background={COLORS.LOADING_BACKGROUND}
                >
                    <section className="content-header">
                        <Row>
                            <Col md={4}>
                                <h3>Liste des articles&nbsp;&nbsp;&nbsp;
                                    <Button bsStyle="success" onClick={this.onNewArticle}>
                                        Ajouter&nbsp;<Glyphicon glyph="plus" />
                                    </Button>
                                </h3>
                            </Col>
                        </Row>
                    </section>
                    <section className="content">
                        <ArticleFilter onSubmit={this.onFilter}/>
                        <BootstrapTable
                            keyField='id'
                            data={ items }
                            rowStyle={rowStyle}
                            pagination={ paginationFactory({
                                page:this.state.page,
                                sizePerPage:this.state.sizePerPage,
                                totalSize:total,
                                showTotal:true,
                                paginationTotalRenderer:customTotal(babiesCount),
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
                            loading={this.state.loading}
                            columns={columns(dispatch,this.onRowSelection,notificationsSelector)}
                        />

                        <Modal show={this.state.activeId !== null} onHide={this.handleClose}>
                            <Modal.Header>
                                <Modal.Title>
                                    <Row className="show-grid">
                                        <Col xs={9} sm={9} md={9}>
                                            {alreadyCreatedArticle?
                                                <Link
                                                to={`/article/${this.state.activeId}${this.state.activeComponent==='form'?'/edit':''}`}
                                                className={'btn btn-link'}
                                                title={"Page principale de l'article"}
                                                >
                                                    {activeArticleTitle}
                                                </Link>
                                            :
                                            activeArticleTitle}
                                        </Col>
                                        <Col xs={3} sm={3} md={3}>
                                            {this.state.breadcrumb && leftBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
                                            {this.state.breadcrumb && rightBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
                                        </Col>
                                    </Row>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body ref={input => (this.modalRef = input)}>
                                <Article
                                    container={this.modalRef}
                                    dispatch={this.props.dispatch}
                                    id={this.state.activeId}
                                    activeComponent={this.state.activeComponent}
                                    formGroups={{"minimal":true,"date":true,"abstract":true,"detailImage":true}}
                                    context={'modal'}
                                    handleSwitch={this.handleComponentSwitch}
                                    onNothing={this.handleClose}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Row>
                                    <Col md={2}>
                                        {
                                            this.state.activeComponent==='form' &&
                                            <Button bsStyle="success" onClick={this.onNewArticle}>
                                                Ajouter&nbsp;<Glyphicon glyph="plus" />
                                            </Button>
                                        }
                                    </Col>
                                    <Col md={8}>

                                    </Col>
                                    <Col md={2}>
                                        <Button onClick={this.handleClose}>Fermer</Button>
                                    </Col>
                                </Row>
                            </Modal.Footer>
                        </Modal>
                        {/*<div className='innerbox' height="1000px" min-height="1000px"></div>*/}
                        {/*<svg width="400" height="1000">*/}
                        {/*</svg>*/}
                    </section>
                </Loadable>
            </div>
        );
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

export default connect(mapStateToProps)(ArticleTablePage);