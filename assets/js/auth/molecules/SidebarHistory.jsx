import React,{ Component } from "react";
import {getArticlesHistory} from "../../shared/selectors";
import { connect } from 'react-redux';
import RImageMini from '../../shared/atoms/RImageMini';

class SidebarHistory extends Component {
    constructor(props) {
        super(props);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.state = {
            height:100,
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;

        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize() {
        console.log(`resized window : ${window.innerWidth} / ${window.innerHeight}`);
        this.setState({height:Math.floor(window.innerHeight-300)});
    }

    render(){
        const {height} = this.state;




        const keys = this.props.getHistory();

        const test = keys.map((key)=>(<li style={{direction:"ltr"}} key={key}>
                <a title={"si c'etait un article ?"} href={"#"}>
                    <RImageMini className={"fa"} useDefault={true}/>&nbsp;&nbsp;
                    <span style={{whiteSpace:"pre-wrap"}}>
                                mon super article avec un nom très très long {key}
                            </span>
                </a>
            </li>
        ));

        return (
            <ul
                className="sidebar-menu" data-widget="tree"
                style={{
                    maxHeight:`${height}px`,
                    overflow:"auto",
                    direction:"rtl",
                    borderBottom: `3px ridge rgb(170, 50, 220, .4)`
                }}
            >
                {test}
            </ul>
        );
    }
}

const mapStateToProps = state => {
        return {
            getHistory: getArticlesHistory(state)
        }
};

export default connect(mapStateToProps)(SidebarHistory);