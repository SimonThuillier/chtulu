import React, {Component} from 'react';
import { NavLink,Link} from 'react-router-dom';
import {getHbaseVersionSelector} from "../../shared/selectors";
import {connect} from "react-redux";
import SidebarHistory from '../molecules/SidebarHistory';
const componentUid = require("uuid/v4")();

const search = (e,history) =>{
    e.preventDefault();
    e.stopPropagation();

    const value = document.getElementById(`hbase-sidebar-${componentUid}-search-input`).value;
    console.log(`rechercher ${value}`);
    history.push(`/explorer?${value}`);
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
                        <li style={{color: "#4b646f", background: "#1a2226"}}>
                            <a href="#">
                                <i className="glyphicon glyphicon-book"></i>
                                <span>Historique</span>
                            </a>
                        </li>
                    </ul>
                    <SidebarHistory sidebarStatus={this.state.sidebarStatus}/>
                </section>
            </aside>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        getHbaseVersion: getHbaseVersionSelector(state.get("app"))
    }
};

export default connect(mapStateToProps)(SideBar);