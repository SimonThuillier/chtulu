import React from "react";
import ReactDOM from "react-dom";
import RImageMini from './RImageMini';
import ArticleTitle from './ArticleTitle';

import L from "leaflet";

import debounce from "debounce";
import {articleIsOpen} from "../util/explorerUtil";
import {
    getBabiesSelector, getNewlyCreatedIdSelector, getNextNewIdSelector, getNotificationsSelector, getOneByIdSelector,
    getSelector,
    totalSelector2
} from "../selectors";
import {connect} from "react-redux";
import {getOneByIdIfNeeded,submitLocally,deleteLocally,fetchNew} from "../actions";

const style = {
    position: "relative",
    width: "100%",
    height: "100%"
};
const Imm = require("immutable");
const geometryGroups = {minimal:true};
const componentUid = require("uuid/v4")();

/*const ArticleIcon = (props) =>(
        <svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'>
            <defs>
                <pattern id={`article-image-${props.article.id}`} x='0' y='0' patternUnits='userSpaceOnUse' height='30' width='30'>
                    <RImageMini deltaX={0} id={props.article.detailImageResource} mode={'svg'}/>
                </pattern>
            </defs>
            <circle
                cx={20}
                cy={20}
                r='13'
                fill={`url(#article-image-${props.article.id})`}
            />
        </svg>);*/

const ArticleIcon = (props) =>(
                <RImageMini deltaX={0} id={props.article.detailImageResource} mode={'url'}/>
);

class HBMap extends React.Component {
    constructor(props) {
        super(props);

        this.resizingDelay = 8;

        this.handleContainerResizing = debounce(
            this.handleContainerResizing.bind(this),
            this.resizingDelay
        );
        this.onMapDblClick = this.onMapDblClick.bind(this);
        this.handleArticleIcons = this.handleArticleIcons.bind(this);

        this.map=null;
        this.markerRefs = new Map();
        this.iconSvgRefs = new Map();

        /*let achenSvgString = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><path d='M2,111 h300 l-242.7,176.3 92.7,-285.3 92.7,285.3 z' fill='#000000'/></svg>"
        let myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace('#','%23');

        this.templateIcon = L.icon({
            iconUrl: myIconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [7, -15],
            shadowUrl: 'http://localhost:8000/media/personnage.jpeg',
            shadowSize: [0, 0],
            shadowAnchor: [0,0]
        });*/
    }

    onMapDblClick(e){
        const {articles,displayedArticles,dispatch,getOneByIdSelector,nextNewIdSelector,newlyCreatedIdSelector} = this.props;
        const latlng = e.latlng;
        console.log("You dblclicked the map at " + e.latlng);

        displayedArticles.forEach((a,id)=>{
            if(a.isOpen){
                let article = articles.find((element)=>{return element.id === id});

                console.log(`${article.title} is selected`);
                let geometryId = article.geometry;
                if(geometryId===null){
                    geometryId =  nextNewIdSelector();
                    dispatch(submitLocally("article",Imm.Map({geometry:geometryId}), id,{geometry:true}));
                }

                console.log(geometryId);
                setTimeout(()=>{
                    dispatch(submitLocally("resourceGeometry",Imm.Map({
                        targetGeometry:{value:{type:"Point",coordinates:[latlng.lat,latlng.lng]}}
                        }),
                        geometryId,geometryGroups));
                },50);


            }
        });


    }

    componentDidMount() {
        // to create new geometries in future
        const {dispatch} = this.props;
        dispatch(fetchNew('resourceGeometry',-1,null));


        this.map = L.map('mymap', {
            center: [49.8419, 24.0315],
            zoom: 16,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: null
                }),
            ]
        });
        this.map.on('dblclick',this.onMapDblClick);
        //L.marker([49.8419, 24.0315], {icon: this.templateIcon}).addTo(this.map);
    }

    componentDidUpdate(prevProps){
        // handle resizing
        const isResizing =
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height;

        //console.log("map should update ?");
        //console.log(isResizing);
        if (isResizing) {
            this.handleContainerResizing();
        }
        if (prevProps.isResizing && !this.props.isResizing) {
            setTimeout(this.handleContainerResizing, 2 * this.resizingDelay);
        }

        // handle article icons
        const {articles,displayedArticles} = this.props;
        //console.log(articles);
        /*if(articles.length>0){
            let achenSvgString =articleIcon(articles[0]);
            console.log(achenSvgString);
            let myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace('#','%23');
            console.log(myIconUrl);
            this.templateIcon= L.icon({
                iconUrl: myIconUrl,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [7, -15],
                shadowUrl: 'http://localhost:8000/media/personnage.jpeg',
                shadowSize: [0, 0],
                shadowAnchor: [0,0]
            });
            L.marker([49.8419, 24.0315], {icon: this.templateIcon}).addTo(this.map);
        }*/

    }

    handleArticleIcons(){
        //console.log('article icons svg ref');
        //console.log(this.iconSvgRefs);
        const {articles,displayedArticles,dispatch,getOneByIdSelector,nextNewIdSelector,newlyCreatedIdSelector} = this.props;

        // 1 delete not necessary markers
        this.markerRefs.forEach((ref,id)=>{
            if(!this.iconSvgRefs.has(+id)){
                ref.removeFrom(this.map);
            }
        });


        this.iconSvgRefs.forEach((object,id)=>{
            const {geometryId,ref} = object;
            if(!!ref && !!ref.innerHTML && !this.markerRefs.has(+id)){
                //console.log(test);
                //let myIconUrl = encodeURI("data:image/svg+xml;base64," + btoa(ref.innerHTML)).replace('#','%23');
                console.log(ref.innerHTML);
                console.log(geometryId);
                const geometry = getOneByIdSelector(+geometryId);
                console.log(geometry.targetGeometry.value.coordinates);

                let icon = L.icon({
                    iconUrl:ref.children[0].innerHTML,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [7, -15],
                    shadowUrl: null,
                    shadowSize: [15, 15],
                    shadowAnchor: [0,0]
                });

                const {selectArticle} = this.props;

                const marker = L.marker(geometry.targetGeometry.value.coordinates, {
                        icon: icon,
                        onClick:(()=>{selectArticle([id])}),
                        draggable:true,
                        riseOnHover:true,
                        title:ref.children[1].children[0].innerHTML
                    }
                );
                this.markerRefs.set(+id,marker);
                marker.addTo(this.map).on('click',()=>{selectArticle([id])});
            }

        });
    }

    /*shouldComponentUpdate(prevProps) {
        const isResizing =
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height;

        //console.log("map should update ?");
        //console.log(isResizing);
        if (isResizing) {
            this.handleContainerResizing();
        }
        if (prevProps.isResizing && !this.props.isResizing) {
            setTimeout(this.handleContainerResizing, 2 * this.resizingDelay);
        }
        return isResizing;
    }*/

    handleContainerResizing() {
        //console.log(this.map);
        this.map.invalidateSize();

        for (let layer in this.layers) {
            //layer.redraw();
        }
    }

    render() {
        const width = this.props.width;
        const height = this.props.height;

        const position = [51, 0];
        const zoom = 6;

        let currentStyle = { ...style };
        currentStyle.width = `${width}px`;
        currentStyle.height = `${height}px`;


        const {articles,displayedArticles,dispatch,getOneByIdSelector,nextNewIdSelector,newlyCreatedIdSelector} = this.props;

        const arrayOfArticlesToDisplay = articles.filter((a) => {return !!a.geometry;});
        this.iconSvgRefs = new Map();
        const iconSvgRefs = this.iconSvgRefs;
        //console.log(iconSvgRefs);

        const articleSvgIconRefs = arrayOfArticlesToDisplay.map((a) => {
            return (
                <div ref={(ref)=>{iconSvgRefs.set(+a.id,{geometryId:+a.geometry,ref:ref})}} hidden={true}
                     key={`article-svg-icon-div-${a.id}`}>
                    <div>
                        <ArticleIcon
                            key={`article-svg-icon-${a.id}`}
                            selected={articleIsOpen(displayedArticles,+a.id)}
                            article={a}
                        />
                    </div>
                    <div>
                        <ArticleTitle id={a.id}/>
                    </div>
                </div>
            );
        });

        setTimeout(this.handleArticleIcons,15);

        return (
            <div id='mymap' style={style}>
                {articleSvgIconRefs}
            </div>);
    }
}

const mapStateToProps = state => {
    return {
        getOneByIdSelector: getOneByIdSelector(state.get("resourceGeometry")),
        babiesSelector:getBabiesSelector(state.get("resourceGeometry")),
        nextNewIdSelector: getNextNewIdSelector(state.get("resourceGeometry")),
        newlyCreatedIdSelector:getNewlyCreatedIdSelector(state.get("resourceGeometry"))
    }
};

export default connect(mapStateToProps)(HBMap);
