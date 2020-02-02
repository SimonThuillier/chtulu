import React, {Component} from 'react';
import { NavLink,Link,withRouter} from 'react-router-dom';
import {getCurrentUserSelector, getHbaseVersionSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import SidebarHistory from '../molecules/SidebarHistory';
const componentUid = require("uuid/v4")();

const search = (e,history) =>{
    e.preventDefault();
    e.stopPropagation();

    const value = document.getElementById(`hbase-sidebar-${componentUid}-search-input`).value;
    console.log(`rechercher ${value}`);
    history.push(`/welcome?${value}`);
};

class SideBar extends Component {
    constructor(props) {
        super(props);

        this.onSidebarToggle = this.onSidebarToggle.bind(this);

        this.state = {
            sidebarStatus : "EXPANDED"
        };
    }

    componentDidMount() {
        window.addEventListener("hb.sidebar.toggle", this.onSidebarToggle);
        this.onSidebarToggle();
    }

    componentWillUnmount() {
        window.removeEventListener("hb.sidebar.toggle", this.onSidebarToggle);
    }

    onSidebarToggle() {
        const status = document.body.classList.contains("sidebar-collapse")?"COLLAPSED":"EXPANDED";
        // console.log(`sidebar toggle, status : ${status}`);

        this.setState({sidebarStatus:status});
    }

    render(){
        const version = this.props.getHbaseVersion();
        const status = this.state.sidebarStatus;
        const currentUser = this.props.getCurrentUser();

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
                            onKeyPress={(e)=>{if(e.which === 13){search(e,this.props.history);}}}
                        />
                        <span className="input-group-btn">
                            <button
                                name="search"
                                id="search-btn"
                                className="btn btn-flat"
                                onClick={(e)=>{search(e,this.props.history);}}
                            >
                                <i className="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                    <ul className="sidebar-menu" data-widget="tree">
                        <li>
                            <Link title="Accueil du site" className={""} to='/welcome'>
                                <i className="fa fa-circle"></i> <span>Accueil</span>
                            </Link>
                        </li>
                        {currentUser &&
                        <li>
                            <Link title="Mes articles" className={""} to='/account/articles'>
                                <i className="fa fa-book"></i> <span>Mes articles</span>
                            </Link>
                        </li>}
                        <li>
                            <Link title="Contacter le webmaster" className={""} to='/contact'>
                                <i className="fa fa-envelope"></i> <span>Contact</span>
                            </Link>
                        </li>
                        <li style={{color: "#4b646f", background: "#1a2226"}}>
                            <a href="#">
                                <i className="glyphicon glyphicon-book"></i>
                                <span>Historique</span>
                            </a>
                        </li>
                    </ul>
                    <SidebarHistory sidebarStatus={status}/>
                </section>
            </aside>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        getHbaseVersion: getHbaseVersionSelector(state.get("app")),
        getCurrentUser: getCurrentUserSelector(state.get("app"),state.get("user"))
    }
};

export default connect(mapStateToProps)(SideBar);