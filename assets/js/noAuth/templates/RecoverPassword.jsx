import React from "react";
import {Grid,Row,Col} from 'react-bootstrap';
import Header from '../organisms/Header';
import ChangePasswordCard from '../organisms/ChangePasswordCard';

const Imm = require("immutable");
const componentUid = require("uuid/v4")();


class RecoverPassword extends React.Component
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
            <div className="wrapper hold-transition skin-blue sidebar-mini">
                <Header/>
                <div className="content-wrapper hb-container">
                    <section className="content">
                        <Grid>
                            <Row className="show-grid">
                                <Col xs={0} sm={2} md={3} lg={3}/>
                                <Col xs={12} sm={8} md={6} lg={6}>
                                    <ChangePasswordCard {...this.props}/>
                                </Col>
                                <Col xs={0} sm={2} md={3} lg={3}/>
                            </Row>
                        </Grid>
                    </section>
                </div>
            </div>
        );
    }
}

export default RecoverPassword;
