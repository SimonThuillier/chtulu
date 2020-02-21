import React from "react";
import {Grid,Row,Col} from 'react-bootstrap';
import AskPasswordRecoveryCard from '../organisms/AskPasswordRecoveryCard';

const componentUid = require("uuid/v4")();


class Login extends React.Component
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
        return (
            <div className="content-wrapper hb-container">
                <section className="content">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={0} sm={2} md={3} lg={3}/>
                            <Col xs={12} sm={8} md={6} lg={6}>
                                <AskPasswordRecoveryCard/>
                            </Col>
                            <Col xs={0} sm={2} md={3} lg={3}/>
                        </Row>
                    </Grid>
                </section>
            </div>
        );
    }
}

export default Login;
