import React,{ Component } from "react";
import {makeGetOneByIdSelector} from "../selectors";
import { connect } from 'react-redux';
import RImageMini from '../atoms/RImageMini';
import {Tooltip,Overlay,OverlayTrigger} from 'react-bootstrap';
import {previewTooltip} from "../../auth/atoms/tooltips";
import { withRouter} from 'react-router-dom';

function HistoryLine({article,sidebarStatus="EXPANDED",history}){
    //const history = useHistory();

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        history.push(`/article/${article.id}`);
        /*const event = new CustomEvent('hb.article.select');
        event.articleId = article.id;
        window.dispatchEvent(event);*/
    }


    return(<li key={article.id}
               onClick={handleClick}
    >
        <a style={{paddingLeft: sidebarStatus === "EXPANDED" ? "15px" : "8px"}} href={"#"}>
            <RImageMini id={article.detailImageResource} useDefault={true}/>&nbsp;&nbsp;
            <span style={{whiteSpace: 'pre-wrap'}}>{article.title}</span>
        </a>
    </li>);

};


class SidebarHistoryArticle extends Component {
    constructor(props) {
        super(props);

        this.target=null;
    }

    componentDidMount() {
        const {dispatch} = this.props;
    }

    render(){
        const {id,getOneById,sidebarStatus,history} = this.props;
        const article = getOneById(+id);

        if (!article) return null;
        const line = HistoryLine({article: article, sidebarStatus: sidebarStatus,history:history});
        if(sidebarStatus === "EXPANDED") return line;

        const tooltip = (<Tooltip key={`tootip-history-${id}`}>
            {article.title}
        </Tooltip>);

        return (
            <OverlayTrigger placement="right" overlay={tooltip} key={`tootip-history-${id}`}>
                {line}
            </OverlayTrigger>
        );
    }
}

const makeMapStateToProps = () => {
    const getSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneById: getSelector(state.get("article"))
        }
    }
};

export default connect(makeMapStateToProps)(SidebarHistoryArticle);