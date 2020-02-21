import React from "react";
import {AVAILABLE_AREAS} from '../../util/explorerUtil';
import Article from "./Article.jsx";
import ArticleDetail from "../../shared/organisms/ArticleDetail.jsx";

const scrollElement = (targetElement,areaElement) => {
    if(!targetElement || !areaElement) return;

    const areaCoords = areaElement.getBoundingClientRect();
    const currentScroll = areaElement.scrollTop;
    const targetCoords = targetElement.getBoundingClientRect();
    console.log(areaCoords.top,currentScroll,targetCoords.top );
    areaElement.scrollTo(0,currentScroll + ((targetCoords.top-areaCoords.height/2)-areaCoords.top)-3);
    console.log(areaElement.scrollTop);
};

class HBExplorerArticleCard extends React.Component {
    constructor(props) {
        super(props);

        this.setMarker = this.setMarker.bind(this);

        this.state = {};
    }

    setMarker(event){
        if(event.hbOrigin ===AVAILABLE_AREAS.CONTENT) return;

        const {iconId} = event;
        //console.log('set read index=',iconId);

        const contentIcon = document.getElementById(iconId);
        if(!contentIcon) return;

        const scrollArea = document.getElementById('article-content-panel-body');

        contentIcon.classList.add("activated");
        setTimeout(()=>{
            contentIcon.classList.remove("activated");
        },520);

        scrollElement(contentIcon,scrollArea);
    }


    componentDidUpdate(prevProps){
    }

    componentDidMount(){
        window.addEventListener('hb.explorer.set.marker',this.setMarker);
    }

    componentWillUnmount(){
        window.removeEventListener('hb.explorer.set.marker',this.setMarker);
    }


    render() {
        const {dispatch,id} = this.props;

        return (
            <div className="panel panel-default hg-content-panel">
                <div
                    className="panel-body"
                    id={'article-content-panel-body'}
                >
                    <Article
                        dispatch={dispatch}
                        id={id}
                        onNothing={null}
                        groups={{
                            minimal:true,
                            date:true,
                            area:true,
                            detailImage:{minimal:true,activeVersion:{minimal:true,urlMini:true,urlDetailThumbnail:true}},
                            abstract:true,
                            owner:{minimal:true}
                        }}
                    >
                        <Article.Detail>
                            <ArticleDetail.Abstract/>
                        </Article.Detail>
                    </Article>
                </div>
                <div className="panel-footer hg-content-panel-footer">

                </div>
            </div>

        );
    }
}

/*const makeMapStateToProps = () => {
    const getLinksSelector = makeLocalGetByAttributeSelector();

    return state => {
        return {
            getLinks : getLinksSelector(state.get("articleLink"))
        }
    }
};*/

export default HBExplorerArticleCard;
