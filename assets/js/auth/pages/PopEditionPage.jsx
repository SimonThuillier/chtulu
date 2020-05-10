import React from 'react';
import {Helmet} from 'react-helmet';

import PoPMap from '../organisms/PoPMap';
import {getInlinedCss} from "../../util/cssUtil";
import styled from "styled-components";


const containerStyle = {
    padding: "0px",
    height: "100%",
    width: "100%",
    minHeight: "100%",
    minWidth:"100%",
    overflow: "hidden"
};

class MapContainer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = React.createRef();

        this.getCurrentSize = this.getCurrentSize.bind(this);
        this.setCurrentSize = this.setCurrentSize.bind(this);

        this.state = {
            width : '0px',
            height : '0px'
        };

    }

    getCurrentSize(){

        console.log("window size : ",window.innerWidth,window.innerHeight);

        let size = {width:'0px',height:'0px'};
        if(this.ref.current){
            const rect = this.ref.current.getBoundingClientRect();
            size.width = `${window.innerWidth-rect.left}px`;
            size.height = `${window.innerHeight-rect.top}px`;
        }
        return size;
    }

    setCurrentSize(){
        this.setState({...this.getCurrentSize()});
    }

    componentDidMount()
    {
        this.setCurrentSize();
        window.addEventListener("resize", this.setCurrentSize);
        window.addEventListener("hb.sidebar.toggle", this.setCurrentSize);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.setCurrentSize);
        window.removeEventListener("hb.sidebar.toggle", this.setCurrentSize);
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {content} = this.props;
        const {width,height} = this.state;

        console.log("width,height : ",width,height);

        const children = (content || []).map((f)=>(f(width,height)));

        console.log(children);
        return (
            <section className="content no-padding" ref={this.ref} style={containerStyle}>
                {children}
            </section>
        );
    }
}

class PopEditionPage extends React.Component
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
        console.log('welcome props',this.props);

        let search=null;
        /*if(this.props.location && this.props.location.search){
            search = this.props.location.search.replace('?','');
        }*/

        return (
            <div>
                <Helmet>
                    <title>Edition des POPs</title>
                </Helmet>
                <div className="content-wrapper hb-container">
                    <MapContainer
                        content = {
                            [
                                (containerWidth,containerHeight)=>(<PoPMap
                                    width={containerWidth}
                                    height={containerHeight}
                                    test={"test"}
                                />)
                            ]
                        }
                    >
                    </MapContainer>
                </div>
            </div>
        )
    }
}

export default PopEditionPage;