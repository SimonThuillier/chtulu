import React from "react";
import {FormGroup,InputGroup,ControlLabel,FormControl,HelpBlock,Glyphicon,
    Grid,Row,Col,Button} from 'react-bootstrap';

const formUid = require('uuid/v4')();
const Imm = require("immutable");

import SearchBag from "../../util/SearchBag";


export default class ArticleFilter2 extends React.Component{
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.id = require('uuid/v4')();
        //console.clear();
        this.state = {
            data:null,
            fields:props.fields || ["keyword","type","beginHDate","endHDate"],
            formValue:props.initialValue||{keyword:null}
        };

        //console.log(props.searchBag);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValue !== prevProps.initialValue){
            this.setState({formValue:this.props.initialValue});
        }
    }

    onSubmit(){
        const {formValue}= this.state;
        const {onFilter} = this.props;
        let searchBag = SearchBag({keyword:formValue.keyword,publicOnly:true},'firstPublishedDate');
        searchBag.limit=12;
        if(!!formValue.keyword && formValue.keyword.trim()!==''){
            searchBag.search={keyword:formValue.keyword,publicOnly:true};
            searchBag.sort = 'keyword';
        }
        onFilter(searchBag);
    }

    handleChange(e,controlId)
    {
        //console.log(`on ${controlId} change :${e.target.value}`);

        const formValue = Object.assign({},this.state.formValue);
        formValue[controlId] = e.target.value;

        this.setState(
            {
                formValue : formValue
            }
        );
    }

    render(){

        const {formValue} = this.state;

        const searchLineStyle = {
            display: "flex",
            flexDirection:"row",
            justifyContent:"center",
            padding:'0px 0px 10px 0px'
        };

        const childStyle={
            padding:'0px 5px 0px 5px'
        };



        return (
            <form>
                <div style = {searchLineStyle}>

                    <FormControl
                        componentClass="input"
                        type="text"
                        value={formValue.keyword}
                        placeholder="votre recherche"
                        onChange={(e)=>{this.handleChange(e,"keyword");}}
                        style={{
                            margin:'0px 10px 0px 0px',
                            maxWidth:'300px'
                        }}
                    />
                    <Button bsStyle="primary"
                            onClick={this.onSubmit}
                            style={{
                                maxWidth:'150px'
                            }}
                    >
                        Rechercher&nbsp;<Glyphicon glyph="filter"/>
                    </Button>
                </div>

            </form>
        );
    }
}