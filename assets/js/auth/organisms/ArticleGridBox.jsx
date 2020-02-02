import React from "react";

import {
    Panel
} from 'react-bootstrap';
import ArticleDetail from './ArticleDetail';


import {Link, withRouter} from 'react-router-dom';
import ArticleTitle from '../atoms/ArticleTitle';



class ArticleGridBox extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {article,history} = this.props;

        return(

                <Panel
                    className={"box hvr-grow"}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        history.push(`/article/${article.id}`);
                    }}
                >
                    <Panel.Heading align="center">
                        <ArticleTitle id={article.id}/>
                    </Panel.Heading>
                    <Panel.Body>
                        <ArticleDetail data={article}>
                            <ArticleDetail.FullSummary/>
                        </ArticleDetail>
                    </Panel.Body>
                </Panel>



        );
    }
}

export default withRouter(ArticleGridBox);