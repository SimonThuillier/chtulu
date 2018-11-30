import React, {Component} from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';
import {Preview} from './actions.jsx';
import {
    Modal,
    OverlayTrigger,
    Tooltip,
    Button,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';
import Article from "./Article";
import {getIfNeeded} from "../actions";
import SearchBag from '../util/SearchBag';
import SearchBagUtil from '../util/SearchBagUtil';
import ArticleType from './ArticleType';
import {connect} from "react-redux";
import {getNotificationsSelector, getSelector, totalSelector2,getNextNewIdSelector,getBabiesSelector} from "../selectors";
import RImageMini from "./RImageMini";
import paginationFactory from 'react-bootstrap-table2-paginator';
import ArticleFilter from './ArticleFilter';
import {LOADING, COLORS, SUBMITTING_COMPLETED} from "../util/notifications";
import {untouch as formUntouch} from "redux-form/immutable";
import {getAllPropertiesInGroups} from "../util/WAOUtil";
const componentUid = require('uuid/v4')();


const columns = [{
    dataField: 'title',
    text: 'Titre',
    formatter: function(cell,row){
        const value = row.detailImageResource;
        return (
            value?<div>{cell}&nbsp;<RImageMini id={value}/></div>:cell
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
}
];

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
    if(row && row.has("isDirty") && row.get("isDirty")(row)){
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

        this.state = {
            loading:false,
            searchBag:SearchBag({}),
            groups:{minimal:true,date:true,detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true}}},
            selected:null,
            activeId:null,
            breadcrumb:{prev:null,next:null},
            page:1,
            sizePerPage:10
        };
    }

    componentDidMount(){
        this.loadSearchBag(this.state.groups,this.state.searchBag);
    }

    componentDidUpdate(prevProps) {
        // when babies are submitted all indexes are erased to ensure coherence between server and client so we have to reload
        if (prevProps.babiesSelector !== this.props.babiesSelector) {
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

    onRowPreview(row,rowIndex){

        this.setState({
            selected:[row.id],
            activeId:row.id,
            activeComponent:'detail',
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

    handleComponentSwitch() {
        this.setState({ activeComponent: (this.state.activeComponent === 'detail')?'form':'detail' });
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
        const {selector,babiesSelector,totalSelector,notificationsSelector} = this.props;
        const babies = babiesSelector();
        const babiesCount = babies.length;

        let items = babies.concat(selector(this.state.searchBag));
        /*console.log("items");
        console.log(items);*/
        let total = this.props.totalSelector(this.state.searchBag);
        const notifications = this.props.notificationsSelector(componentUid);

        const coreBagKey = JSON.stringify(SearchBagUtil.getCoreBag(this.state.searchBag));
        const loading = (notifications && notifications.hasIn([coreBagKey || 'DEFAULT',LOADING]))||false;

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
                            columns={ columns.concat([
                                {
                                    dataField: 'id',
                                    text: 'Action',
                                    formatter: (cell, row, rowIndex) =>
                                        (<Preview onClick={() => this.onRowPreview(row,rowIndex)}/>)
                                }
                            ])
                            }
                        />

                        <Modal show={this.state.activeId !== null} onHide={this.handleClose}>
                            <Modal.Header>
                                <Modal.Title>
                                    <Row className="show-grid">
                                        <Col xs={9} sm={9} md={9}>
                                            {(this.state.activeId &&
                                            items.find((item)=> item.id === this.state.activeId) &&
                                            items.find((item)=> item.id === this.state.activeId).title) || 'Nouvel article'}
                                        </Col>
                                        <Col xs={3} sm={3} md={3}>
                                            {this.state.breadcrumb && leftBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
                                            {this.state.breadcrumb && rightBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
                                        </Col>
                                    </Row>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Article
                                    dispatch={this.props.dispatch}
                                    id={this.state.activeId}
                                    activeComponent={this.state.activeComponent}
                                    formGroups={{"minimal":true,"date":true,"abstract":true}}
                                    context={'modal'}
                                    handleSwitch={this.handleComponentSwitch}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.handleClose}>Fermer</Button>
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
    const notificationsSelector = getNotificationsSelector(state.get("app"));
    return {
        selector: selector,
        babiesSelector:babiesSelector,
        nextNewIdSelector: nextNewIdSelector,
        totalSelector:totalSelector,
        notificationsSelector : notificationsSelector
    }
};

export default connect(mapStateToProps)(ArticleTablePage);