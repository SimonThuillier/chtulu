import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
import React, {Component} from 'react';
import server from '../util/server.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';
import {Preview} from './actions.jsx';
import {Modal,Popover,OverlayTrigger,Tooltip,Button} from 'react-bootstrap';
import {ArticleDetail} from "./article";

const articles = [
    {id:1,title:"Emile Zola",type:{id:1,label:"Personnage"},beginHDate:"debut",endHDate:"fin"}
    ];

const columns = [{
    dataField: 'title',
    text: 'Titre',
    formatter: function(cell,row){
        console.log(row);
        let finalValue = cell;
        if(row.detailImageResource &&
            row.detailImageResource.activeVersion){
            let activeVersion = row.detailImageResource.activeVersion;
            return (
                <div>{cell}&nbsp;<img src={activeVersion.urlMini} className="img-circle"></img></div>
            );
        }
        return cell;
    }
}, {
    dataField: 'type.label',
    text: 'Type'
}, {
    dataField: 'beginHDate',
    text: 'Début',
    formatter: function(cell){
        if(cell === null) return '-';
        return cell.getLabel();
    }
}, {
    dataField: 'endHDate',
    text: 'Fin',
    formatter: function(cell){
        if(cell === null) return '-';
        return cell.getLabel();
    }
}
    ];



class ArticleTablePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            rows:[],
            loading:true,
            searchBag:server.createSearchBag(null,'id','DESC',0,10),
            selected:null,
            activeData:null,
        };
    }

    componentDidMount(){
        server.get('article',{minimal:true,date:true,detailImage:true,detailImageUrl:true},this.state.searchBag)
            .then(data =>{
                console.log("reception client");
                data.rows.forEach((item) => this.onRowReception(item));
                console.log(data);
                this.setState({
                    rows:data.rows,
                    loading:false
                });
            });
    }

    onRowReception(data){

    }

    onRowPreview(row,rowIndex){
        console.log(rowIndex);
        this.setState({selected:[row.id],activeData:row});
    }

    handleClose() {
        this.setState({ activeData: null });
    }



    render(){

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
                        data={ this.state.rows }
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
                            <ArticleDetail data={this.state.activeData}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                </section>
            </div>
        );
    }
}

class ArticleTablePage2 extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <p>Coucou</p>
        );
    }
}

export {ArticleTablePage};
export {ArticleTablePage2};