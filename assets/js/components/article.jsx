import React from "react";
import {Popover,OverlayTrigger,Tooltip,Image,ControlLabel,FormGroup,FormControl} from 'react-bootstrap';
import server from '../util/Server.js';
import Loadable from 'react-loading-overlay';
import Actions from "../Actions.js";
const uuidv4 = require('uuid/v4');


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

export function ArticleDetailImage(props){
    return(
        <div className="col-md-6">
            <div className="container-fluid">
                <Image src={props.url} rounded />
            </div>
        </div>
    )
}

export function ArticleDetailAbstract(props){
    const abstract = props.abstract || "";
    let paragraphKey=0;
    const paragraphs =  abstract.split("\r\n").map((line) =>{
        if (line.length === 0) return null;
        paragraphKey++;
        return(
            <p>
                &nbsp;&nbsp;&nbsp;{line}
            </p>
        );
    });
    return(
        <div className="col-md-12">
            <div className="container-fluid">
                {paragraphs}
            </div>
        </div>
    )
}

export function ArticleDetail(props){
    let data = props.data;
    const availableGroups = (data && data.loadedGroups)?server.intersectGroups('article',props.groups,data.loadedGroups):{};

    return (
        <div>
            <div className="row">
                {availableGroups.hasOwnProperty("minimal") &&
                <ArticleDetailMinimal type={data.type} beginHDate={data.beginHDate} endHDate={data.endHDate}/>
                }
                {availableGroups.hasOwnProperty("detailImageResource") &&
                data.detailImageResource && data.detailImageResource.activeVersion &&
                <ArticleDetailImage url={data.detailImageResource.activeVersion.urlDetailThumbnail}/>
                }
            </div>
            <div className="row">
                <hr/>
            </div>
            <div className="row">
                {availableGroups.hasOwnProperty("abstract") &&
                <ArticleDetailAbstract abstract={data.abstract}/>
                }
            </div>
        </div>
    );
}


export function ArticleTypeSelect(props){
    let uuid = uuidv4();
    Actions.get(uuid,{dataType:"articleType"});

    console.log(props.articleType.values());

    /*const options =  props.articleType.options.map((option) =>{
        return(
            <option value={option.id}>
                {option.label}
            </option>
        );
    });*/
    let options = [];


    return(
        <FormGroup validationState={null} controlId="formControlsSelect">
            <ControlLabel>Type</ControlLabel>
            <FormControl componentClass="select" placeholder="choisissez un type d'article">
                {options}
            </FormControl>
        </FormGroup>
    );
}


export class ArticleTypeSelect2 extends React.Component{
    constructor(props) {
        console.log(props.articleType);
        super(props);
        this.state = {
            uuid: uuidv4(),
            options:props.articleType,
            loading: false,
            disabled: false,
            searchBag:server.createSearchBag(null,'label','ASC',0,100)
        };
    }

    onDataLoading(){
        this.setState({
            loading:true
        });
    }

    componentDidMount(){
        console.log("article type has mounted");
        Actions.get(this.state.uuid,{dataType:"articleType"});




        server.get('articleType',{minimal:true},this.state.searchBag,this.onDataLoading.bind(this))
            .then(hResponse =>{
                console.log("reception types article");
                console.log(hResponse);
                /*this.setState({
                    options:hResponse.data,
                    loading:false
                });*/
            })
            .catch((error) => {
                // this.setState({
                //     loading:false
                // });
            });
    }

    render(){
        console.log(this.state);
        const options =  this.state.options.map((option) =>{
            return(
                <option value={option.id}>
                    {option.label}
                </option>
            );
        });


        return(
            <FormGroup validationState={null} controlId="formControlsSelect">
                <ControlLabel>Type</ControlLabel>
                <FormControl componentClass="select" placeholder="choisissez un type d'article">
                    {options}
                </FormControl>
            </FormGroup>
        );
    }
};

const formDataTransformer = {
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
};

export class Article extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeComponent: props.activeComponent||'detail',
            data: props.data||null,
            loading: false,
            detailGroups:props.detailGroups || {"minimal":true,"abstract":true,
                "detailImageResource":{"activeVersion":{"urlDetailThumbnail":true}}
            },
            formGroups:props.formGroups || {"minimal":true},
            pendingData: (props.data)?Object.create(props.data):null,
        };
        console.log("Article built");
    }

    getChangeHandler(attribute){
        return function(event){
            this.state.pendingData[attribute] =
                formDataTransformer[attribute] ? formDataTransformer[attribute](event.target.value):event.target.value;
            this.setState({pendingData:this.state.pendingData});
        }.bind(this)
    }

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
        server.getOneById('article',this.state.detailGroups,this.state.data.id,this.onDataLoading.bind(this))
            .then(hResponse =>{
                console.log("reception client Article");
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

        const data = this.state.pendingData; //

        return (
            <Loadable
                active={this.state.loading}
                spinner
                text='Chargement des données...'
                color='black'
                background='rgba(192,192,192,0.4)'
            >
                <div hidden={this.state.activeComponent!=='detail'}>
                    <ArticleDetail data={this.state.pendingData} groups={this.state.detailGroups}/>
                </div>
                <div hidden={this.state.activeComponent!=='form'}>
                    {this.state.activeComponent==='form' && <ArticleForm
                        data={this.state.pendingData}
                        groups={this.state.formGroups}
                        changeHandler={this.getChangeHandler.bind(this)}/>}
                </div>
            </Loadable>
        );
    }
}