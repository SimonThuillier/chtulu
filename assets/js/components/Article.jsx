import React from "react";
import {Popover,OverlayTrigger,Tooltip,Image,ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
const uuidv4 = require('uuid/v4');
import { getOneByIdIfNeeded} from "../actions";
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';

/*const formDataTransformer = {
    abstract:function(value){
        return value.replace('<br />',"\n");
    }
};

export function ArticleForm(props){
    let data = props.data;
    return (
        <form onSubmit={null}>
            <label>
                Résumé :
                <textarea value={data.abstract} onChange={props.changeHandler("abstract")} />
            </label>
            <ArticleTypeSelect/>
            <input type="submit" value="Submit" />
        </form>
    );
};*/

export class Article extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeComponent: props.activeComponent||'detail',
            id: props.id||null,
            loading: false,
            detailGroups:props.detailGroups || {"minimal":true,"abstract":true,
                "detailImageResource":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            formGroups:props.formGroups || {"minimal":true},
            //pendingData: (props.data)?Object.create(props.data):null,
        };
        console.log("Article built");
        //console.log(props.data);
        //console.log(this.state.pendingData);
    }

    /*getChangeHandler(attribute){
        return function(event){
            this.state.pendingData[attribute] =
                formDataTransformer[attribute] ? formDataTransformer[attribute](event.target.value):event.target.value;
            this.setState({pendingData:this.state.pendingData});
        }.bind(this)
    }*/

    onDataLoading(){
        this.setState({
            loading:true
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        let toUpdate = {};
        if(nextProps.activeComponent!==prevState.activeComponent){
            toUpdate.activeComponent = nextProps.activeComponent;
        }
        else return null;
        return toUpdate;
    }

    componentDidMount(){
        console.log("Article begin Mount");
        const {dispatch} = this.props;
        dispatch(getOneByIdIfNeeded("article",this.state.detailGroups, this.state.id));
    }

    render(){
        // const popover = (
        //     <Popover id="modal-popover" title="popover">
        //         very popover. such engagement
        //     </Popover>
        // );
        // const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

        {/*<h4>Text in a modal</h4>*/}
        {/*<p>*/}
        {/*Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
        {/*</p>*/}

        {/*<h4>Popover in a modal</h4>*/}
        {/*<p>*/}
        {/*there is a{' '}*/}
        {/*<OverlayTrigger overlay={popover}>*/}
        {/*<a href="#popover">popover</a>*/}
        {/*</OverlayTrigger>{' '}*/}
        {/*here*/}
        {/*</p>*/}

        {/*<h4>Tooltips in a modal</h4>*/}
        {/*<p>*/}
        {/*there is a{' '}*/}
        {/*<OverlayTrigger overlay={tooltip}>*/}
        {/*<a href="#tooltip">tooltip</a>*/}
        {/*</OverlayTrigger>{' '}*/}
        {/*here*/}
        {/*</p>*/}

        {/*<hr/>*/}

        //const data = this.state.pendingData; //

        return (
            <Loadable
                active={this.state.loading}
                spinner
                text='Chargement des données...'
                color='black'
                background='rgba(192,192,192,0.4)'
            >
                <div hidden={this.state.activeComponent!=='detail'}>
                    <ArticleDetail id={this.state.id} groups={this.state.detailGroups}/>
                </div>
                <div hidden={this.state.activeComponent!=='form'}>
                    {this.state.activeComponent==='form' &&
                    <ArticleForm
                    id={this.state.id}
                    groups={this.state.formGroups}
                    // changeHandler={this.getChangeHandler.bind(this)}
                    />}
                </div>
            </Loadable>
        );
    }
}