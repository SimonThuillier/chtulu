import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
import React, {Component} from 'react';
//import server from '../util/ServerDeprecated.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';
import {Preview} from './actions.jsx';
import {Modal,Popover,OverlayTrigger,Tooltip,Button,ButtonToolbar,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';
import {Article} from "./article";
import {getIfNeeded} from "../actions";
import SearchBag from '../util/SearchBag';
import ArticleType from './ArticleType';
import {connect} from "react-redux";
import {getSelectors} from "../reducers";


const columns = [{
    dataField: 'title',
    text: 'Titre',
    formatter: function(cell,row){
        if(row.detailImageResource &&
            row.detailImageResource.activeVersion){
            let activeVersion = row.detailImageResource.activeVersion;
            return (
                <div>{cell}&nbsp;<img src={activeVersion.urlMini} className="img-circle"/></div>
            );
        }
        return cell;
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



class ArticleTablePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            searchBag:SearchBag(null,'id','DESC',0,10),
            selected:null,
            activeData:null
        };
    }

    componentDidMount(){

        const {dispatch} = this.props;
        dispatch(getIfNeeded("article",
            {minimal:true,date:true,detailImage:true,detailImageUrl:true},
            this.state.searchBag));


        /*server.get('article',{minimal:true,date:true,detailImage:true,detailImageUrl:true},this.state.searchBag)
            .then(data =>{
                console.log("reception client");
                data.rows.forEach((item) => this.onRowReception(item));
                console.log(data);
                console.log(server.getCache());
                this.setState({
                    rows:data.rows,
                    loading:false,
                    activeComponent:'detail',
                });
            });*/
    }

    onRowReception(data){

    }

    onRowPreview(row,rowIndex){
        console.log("row selectionnée !");
        console.log(row);
        console.log(rowIndex);
        this.setState({selected:[row.id],activeData:row,activeComponent:'detail'});
    }

    handleClose() {
        this.setState({ activeData: null });
    }

    handleArticleSwitch() {
        console.log("switch");
        this.setState({ activeComponent: (this.state.activeComponent === 'detail')?'form':'detail' });
    }



    render(){
        const { article } = this.props;
        /*console.log("articles ?");
        console.log(article);
        article.items.forEach((item)=>{console.log(item.toJS())});*/

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
                        data={ this.props.selector(this.state.searchBag)}
                        selectRow={{
                            hideSelectColumn:true,
                            mode :'radio',
                            style: { backgroundColor: '#c8e6c9' },
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
                    <Modal show={this.state.activeData !== null} onHide={this.handleClose.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.activeData && this.state.activeData.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Article {...this.props} data={this.state.activeData} activeComponent={this.state.activeComponent}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonToolbar>
                                <ToggleButtonGroup
                                    type={'radio'}
                                    name="options"
                                    defaultValue={this.state.activeComponent}
                                >
                                    <ToggleButton onClick={this.handleArticleSwitch.bind(this)} value={"detail"}>
                                        Previsualiser
                                    </ToggleButton>
                                    <ToggleButton onClick={this.handleArticleSwitch.bind(this)} value={"form"}>
                                        Editer
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                            <Button onClick={this.handleClose.bind(this)}>Fermer</Button>
                        </Modal.Footer>
                    </Modal>

                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("ArticleTablePage map state to props");
    console.log(state);
    return {
        selector: getSelectors["article"](state)
    }
};

export default connect(mapStateToProps)(ArticleTablePage);