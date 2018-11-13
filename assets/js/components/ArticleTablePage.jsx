import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
import React, {Component} from 'react';
//import server from '../util/ServerDeprecated.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';
import {Preview} from './actions.jsx';
import {
    Modal,
    Popover,
    OverlayTrigger,
    Tooltip,
    Button,
    ButtonToolbar,
    ToggleButtonGroup,
    ToggleButton,
    Col,
    Row,
    Glyphicon
} from 'react-bootstrap';
import Article from "./Article";
import {getIfNeeded} from "../actions";
import SearchBag from '../util/SearchBag';
import ArticleType from './ArticleType';
import {connect} from "react-redux";
import { getSelector} from "../reducers";
import RImageMini from "./RImageMini"


const columns = [{
    dataField: 'title',
    text: 'Titre',
    formatter: function(cell,row){
        const value = row.detailImageResource;
        return (
            value?<div>{cell}&nbsp;<RImageMini id={value}/></div>:cell
        );
    }
}, {
    dataField: 'type',
    text: 'Type',
    formatter: function(cell){
        return <ArticleType id={cell}/>
    }
}, {
    dataField: 'beginHDate',
    text: 'Début',
    formatter: function(cell){
        //console.log(cell);
        if(cell === null) return '-';
        return cell.getLabel();
    }
}, {
    dataField: 'endHDate',
    text: 'Fin',
    formatter: function(cell){
        //console.log(cell);
        if(cell === null) return '-';
        return cell.getLabel();
    }
}
];

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
    console.log("row style");
    console.log(row);

    if(row && row.has("isDirty") && row.get("isDirty")(row)){
        return {backgroundColor:'#c8e6c9'};
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

        this.state = {
            loading:false,
            searchBag:SearchBag(null,'id','DESC',0,10),
            selected:null,
            activeId:null,
            breadcrumb:{prev:null,next:null}
        };
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(getIfNeeded("article",
            {minimal:true,date:true,detailImage:true},
            this.state.searchBag));
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

    render(){
        const items = this.props.selector(this.state.searchBag);
        console.log("items");
        console.log(items);

        return(
            <div className="content-wrapper hb-container">
                <Helmet>
                    <title>Liste des articles</title>
                </Helmet>
                <section className="content-header">
                </section>
                <section className="content">
                    <Loadable
                        active={this.state.loading}
                        spinner
                        text='Chargement des données...'
                        color='black'
                        background='rgba(192,192,192,0.4)'
                    >
                        <BootstrapTable
                            keyField='id'
                            data={ items }
                            rowStyle={rowStyle}
                            selectRow={{
                                hideSelectColumn:true,
                                mode :'radio',
                                style: { backgroundColor: 'LightBlue' },
                                selected:this.state.selected,
                            }}
                            remote={ {
                                filter: true,
                                pagination: false,
                                sort: true,
                                cellEdit: true
                            } }
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
                    </Loadable>
                    <Modal show={this.state.activeId !== null} onHide={this.handleClose}>
                        <Modal.Header>
                            <Modal.Title>
                                <Row className="show-grid">
                                    <Col xs={9} sm={9} md={9}>
                                        {this.state.activeId && items.find((item)=> item.id === this.state.activeId).title}
                                    </Col>
                                    <Col xs={3} sm={3} md={3}>
                                        {leftBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
                                        {rightBreadcrumb(this.state.breadcrumb,this.handleArticleSwitch)}
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
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonToolbar>
                                <ToggleButtonGroup
                                    type={'radio'}
                                    name="options"
                                    defaultValue={this.state.activeComponent}
                                >
                                    <ToggleButton onClick={this.handleComponentSwitch} value={"detail"}>
                                        Previsualiser
                                    </ToggleButton>
                                    <ToggleButton onClick={this.handleComponentSwitch} value={"form"}>
                                        Editer
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                            <Button onClick={this.handleClose}>Fermer</Button>
                        </Modal.Footer>
                    </Modal>

                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const selector = selector || getSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(ArticleTablePage);