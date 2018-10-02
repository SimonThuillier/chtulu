import React from "react";
import {Modal,Popover,OverlayTrigger,Tooltip,Button} from 'react-bootstrap';
import server from '../util/server.js';

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

export class ArticleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data||null,
            loading: false,
            wantedGroups:props.wantedGroups || {"minimal":true},
        };
    }

    render(){
        let data = this.state.data;
        const availableGroups = server.intersectGroups('article',this.state.wantedGroups,data.loadedGroups);
        console.log(this.state.data);
        console.log(availableGroups);

        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
        return (
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

                <h4>Overflowing text to show scroll behavior</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                    ac consectetur ac, vestibulum at eros.
                </p>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur
                    et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                    auctor.
                </p>
                <p>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                    cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
                    dui. Donec ullamcorper nulla non metus auctor fringilla.
                </p>
            </div>
        );
    }


}