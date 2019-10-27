import React,{ Component } from "react";
import {getArticlesHistory} from "../../shared/selectors";
import { connect } from 'react-redux';
import SidebarHistoryArticle from './SidebarHistoryArticle';

class SidebarHistory extends Component {
    constructor(props) {
        super(props);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.state = {
            height:100,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize() {
        //console.log(`resized window : ${window.innerWidth} / ${window.innerHeight}`);
        this.setState({height:Math.floor(window.innerHeight-300)});
    }

    render(){
        const {height} = this.state;
        const historyIds = this.props.getHistory();
        const sidebarHistoryArticles = historyIds.map((id)=>(
            <SidebarHistoryArticle id={id} sidebarStatus={this.props.sidebarStatus}/>
        ));

        return (
            <ul
                className="sidebar-menu" data-widget="tree"
                style={{
                    maxHeight:`${height}px`,
                    overflowY:"auto",
                    borderBottom: `3px ridge rgb(170, 50, 220, .4)`
                }}
            >
                {sidebarHistoryArticles}
            </ul>
        );
    }
}

const mapStateToProps = state => {
        return {
            getHistory: getArticlesHistory(state)
        }
};

export default connect(mapStateToProps)(SidebarHistory);