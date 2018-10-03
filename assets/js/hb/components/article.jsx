import React from "react";
import {Modal,Popover,OverlayTrigger,Tooltip,Button} from 'react-bootstrap';
import server from '../util/server.js';
import Loadable from 'react-loading-overlay';


export function ArticleDetailMinimal(props){
    return(
        <div className="col-md-6">
            <div className="container-fluid">
                <div className="row">
                    <h5>Type : {props.type ? props.type.label : ''}</h5>
                    <h5>Date de début : {props.beginHDate ? props.beginHDate.getLabel() : ''}</h5>
                    <h5>Date de fin : {props.endHDate ? props.endHDate.getLabel() : ''}</h5>
                </div>
            </div>
        </div>
    )
}

export function ArticleDetailAbstract(props){
    const abstract = props.abstract || "";
    const paragraphs =  abstract.split("\r\n").map((line) =>{
        return(
            <p>
                &nbsp;&nbsp;{line}
            </p>
        );
    });
    return(
        <div className="row">
            <div className="col-md-12">
                <div className="container-fluid">
                    {paragraphs}
                </div>
            </div>
        </div>
    )
}

export class ArticleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data||null,
            loading: false,
            wantedGroups:props.wantedGroups || {"minimal":true,"abstract":true},
        };
    }

    onDataLoading(){
        this.setState({
            loading:true
        });
    }

    componentDidMount(){
        server.getOneById('article',this.state.wantedGroups,this.state.data.id,this.onDataLoading.bind(this))
            .then(hResponse =>{
                console.log("reception client");
                console.log(hResponse);
                this.setState({
                    data:hResponse.data,
                    loading:false
                });
            })
            .catch((error) => {
                this.setState({
                    loading:false
                });
            });
    }

    render(){
        let data = this.state.data;
        const availableGroups = server.intersectGroups('article',this.state.wantedGroups,data.loadedGroups);
        /*console.log(this.state.data);
        console.log(availableGroups);*/

        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
        //console.log(server.getCache());
        return (
            <Loadable
                active={this.state.loading}
                spinner
                text='Chargement des données...'
                color='black'
                background='rgba(192,192,192,0.4)'
            >
                <div>
                    <h4>Text in a modal</h4>
                    <p>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </p>

                    <h4>Popover in a modal</h4>
                    <p>
                        there is a{' '}
                        <OverlayTrigger overlay={popover}>
                            <a href="#popover">popover</a>
                        </OverlayTrigger>{' '}
                        here
                    </p>

                    <h4>Tooltips in a modal</h4>
                    <p>
                        there is a{' '}
                        <OverlayTrigger overlay={tooltip}>
                            <a href="#tooltip">tooltip</a>
                        </OverlayTrigger>{' '}
                        here
                    </p>

                    <hr />

                    {availableGroups.hasOwnProperty("minimal") &&
                    <ArticleDetailMinimal type={data.type} beginHDate={data.beginHDate} endHDate={data.endHDate}/>
                    }

                    {availableGroups.hasOwnProperty("abstract") &&
                    <ArticleDetailAbstract abstract={data.abstract}/>
                    }
                </div>
            </Loadable>
        );
    }


}