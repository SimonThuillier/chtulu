import { BrowserRouter, Router, Route,NavLink,Switch} from 'react-router-dom';
import React, {Component} from 'react';
import server from '../util/server.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Loadable from 'react-loading-overlay';
import {Helmet} from 'react-helmet';

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
}, {
        dataField: 'id',
        text: 'Action'
    }
    ];



class ArticleTablePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            rows:[],
            loading:true,
            searchBag:server.createSearchBag(null,'id','DESC',0,5)
        };
    }

    componentDidMount(){
        server.get('article',{minimal:true,date:true,detailImage:true,detailImageUrl:true},this.state.searchBag)
            .then(data =>{
                console.log("reception client");
                data.rows.forEach((item) => this.onArticleReception(item));
                console.log(data);
                this.setState({
                    rows:data.rows,
                    loading:false
                });
            });
    }

    onArticleReception(data){

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
                        remote={ {
                            filter: true,
                            pagination: false,
                            sort: true,
                            cellEdit: true
                        } }
                        loading={this.state.loading}
                        columns={ columns } />
                    </Loadable>
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