import React from "react";
import { Table } from "react-bootstrap";
import {
    getOneByIdSelector
} from "../selectors";
import {connect} from "react-redux";
import RImageMini from "./RImageMini";

const HBExplorerContentHistory = (props) => {

    const {displayedArticles,selectArticle,selector} = props;

    console.log("displayedArticles");
    console.log(displayedArticles);

    const articlesToDisplay = Array.from(displayedArticles).
    sort((a,b)=>{
        const aSelectionDate = a[1].selectionDate;
        const bSelectionDate = b[1].selectionDate;
        return (bSelectionDate.getTime() - aSelectionDate.getTime());
    })
        .map(([id,v])=>{
            const article = selector(+id);
            const value = article.detailImageResource;

            return (
                <tr
                    key={`article-history-${+id}`}
                    onClick={(e)=>{selectArticle([+id]);}}
                >
                    <td>{article.title}&nbsp;{value?<RImageMini id={value}/>:''}</td>
                </tr>);
        });


    return (
        <div style={{minWidth:150}}>
            <Table bordered hover>
                <thead/>
                <tbody>
                {articlesToDisplay}
                </tbody>
            </Table>
        </div>
    );
};

const mapStateToProps = state => {
    const selector = getOneByIdSelector(state.get("article"));
    return {
        selector: selector
    }
};

export default connect(mapStateToProps)(HBExplorerContentHistory);

