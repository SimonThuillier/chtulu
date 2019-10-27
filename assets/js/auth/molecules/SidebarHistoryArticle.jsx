import React,{ Component } from "react";
import {makeGetOneByIdSelector} from "../../shared/selectors";
import { connect } from 'react-redux';
import RImageMini from '../../shared/atoms/RImageMini';
import {Tooltip,Overlay,OverlayTrigger} from 'react-bootstrap';
import {previewTooltip} from "../atoms/tooltips";

const historyLine = (article,sidebarStatus="EXPANDED") => (
    <li key={article.id}
        onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('hb.article.select',{detail:{id:article.id}}));}
        }
    >
        <a style={{paddingLeft:sidebarStatus==="EXPANDED"?"15px":"8px"}} href={"#"}>
            <RImageMini id={article.detailImageResource} useDefault={true}/>&nbsp;&nbsp;
            <span style={{whiteSpace:'pre-wrap'}}>{article.title}</span>
        </a>
    </li>
);


class SidebarHistoryArticle extends Component {
    constructor(props) {
        super(props);

        this.target=null;
    }

    componentDidMount() {
        const {dispatch} = this.props;
    }

    render(){
        const {id,getOneById,sidebarStatus} = this.props;
        const article = getOneById(+id);

        if (!article) return null;
        const line = historyLine(article,sidebarStatus);
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