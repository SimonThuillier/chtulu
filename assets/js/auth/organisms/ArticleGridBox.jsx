import React from "react";

import {
    Panel
} from 'react-bootstrap';
import ArticleDetail from './ArticleDetail';


import { Link} from 'react-router-dom';
import ArticleTitle from '../atoms/ArticleTitle';



export default class ArticleGridBox extends React.Component
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
        const {article} = this.props;

        return(
            <Link to={`/article/${article.id}`}>
                <Panel
                    className={"box hvr-grow"}
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
            </Link>


        );
    }
}