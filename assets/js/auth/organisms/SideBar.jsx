import React from 'react';
import { NavLink,Link} from 'react-router-dom';
import {getHbaseVersionSelector} from "../../shared/selectors";
import {connect} from "react-redux";
const componentUid = require("uuid/v4")();


const search = (e,history) =>{

    e.preventDefault();
    e.stopPropagation();



    const value = document.getElementById(`hbase-sidebar-${componentUid}-search-input`).value;
    console.log(`rechercher ${value}`);
    history.push(`/explorer?${value}`);
};

const SideBar = (props) => {
    const version = props.getHbaseVersion();
    return (

        <aside id="main-sidebar" className="main-sidebar">
            <section className="sidebar">
                <ul className="sidebar-menu" data-widget="tree">
                    <li className="header" style={{
                        color:"#ccc",
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        {version?`v` + version.number + `  '` +  version.tag + `'`:'Menu'}
                    </li>
                </ul>



                    <div className="input-group sidebar-form">
                        <input
                            id={`hbase-sidebar-${componentUid}-search-input`}
                            type="text"
                            name="q"
                            className="form-control"
                            placeholder="Rechercher..."
                            onKeyPress={(e)=>{if(e.which === 13){search(e,props.history);}}}
                        />
                        <span className="input-group-btn">
                            <button
                                name="search"
                                id="search-btn"
                                className="btn btn-flat"
                                onClick={(e)=>{search(e,props.history);}}
                            >
                                <i className="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                <ul className="sidebar-menu" data-widget="tree">
                    <li>
                        <Link title="Tout se passe ici" className={""} to='/explorer'>
                            <i className="fa fa-globe"></i> <span>Explorateur</span>
                        </Link>
                    </li>
                    <li>
                        <Link title="Contacter le webmaster" className={""} to='/contact'>
                            <i className="fa fa-envelope"></i> <span>Contact</span>
                        </Link>
                    </li>

                    {/*<li className="treeview">*/}
                        {/*<a href="#">*/}
                            {/*<i className="fa fa-pencil"/>*/}
                            {/*<span>Ecrire</span>*/}
                            {/*<span className="pull-right-container">*/}
                            {/*<i className="fa fa-angle-left pull-right"/>*/}
						{/*</span>*/}
                        {/*</a>*/}
                        {/*<ul className="treeview-menu">*/}
                            {/*<li>*/}
                                {/*<NavLink to='/article-table' activeClassName='hurray'>*/}
                                    {/*<i className="fa fa-search"></i>*/}
                                    {/*Listes article*/}
                                {/*</NavLink>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                                {/*<NavLink to='/article/' activeClassName='hurray'>*/}
                                    {/*<i className="fa fa-plus"></i>*/}
                                    {/*Creer article*/}
                                {/*</NavLink>*/}
                            {/*</li>*/}
                        {/*</ul>*/}
                    {/*</li>*/}
                </ul>
            </section>
        </aside>
    )
};

const mapStateToProps = (state) => {
    return {
        getHbaseVersion: getHbaseVersionSelector(state.get("app"))
    }
};

export default connect(mapStateToProps)(SideBar);