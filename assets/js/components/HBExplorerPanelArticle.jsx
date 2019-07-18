import React from "react";
import ProgressionCircle from "./ProgressionCircle";
import HDate from "../util/HDate";
import RImageMini from './RImageMini';

const textStyle = {
    fontFamily: "Arial, sans-serif",
    fontSize  : 16,
    stroke     : "#000000",
    fill       : "#000000"
};

/**
 * molecule level component defining display of one article in the panel
 */
class HBExplorerPanelArticle extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    componentWillUnmount(){
        console.log("HBExplorerPanelArticle will unmount");
    }

    handleOnClick (e){
        const {selectArticle,article,onPanelMoveEnd} = this.props;
        e.preventDefault();
        e.stopPropagation();

        selectArticle([article.id]);
        onPanelMoveEnd(e);

    }

    render() {
        const {article,timeScale,originY,addBox,selected,hovered,setHoveredArticle,cursorDate} = this.props;

        const articleHDate = new HDate("2",
            article.beginHDate.beginDate,
            (article.endHDate && article.endHDate.endDate)||new Date());

        const currentProgression = articleHDate.getRateOfDate(cursorDate);


        /*const imageUrl = RImageMini({id:article.detailImageResource,urlOnly:true})
            || "http://localhost:8000/media/personnage.jpeg";
        console.log(`${article.title} , detailImageResource : ${imageUrl}`);

        console.log(imageUrl);*/

        /*console.log(`${article.title} , prog : ${currentProgression}`);
        console.log(cursorDate);
        console.log(articleHDate);*/

        const x = timeScale(article.beginHDate.beginDate);
        const endX = timeScale(article.endHDate?article.endHDate.endDate:new Date());

        /*console.log(article.beginHDate.beginDate);
        console.log(timeScale(new Date()));
        console.log(x);
        console.log(endX);*/

        const {max,min} = Math;
        let deltaX = min(max(-x,0),endX) + 15;
        deltaX=0;

        const xMargin = 18;
        const viewportHeight = 30;

        let viewportWidth = Math.max(endX-x + 2*xMargin,(article.title.length)*15);

        const y = article.currentY - originY;

        let thisTextStyle = {};
        Object.assign(thisTextStyle,textStyle);
        if(selected) thisTextStyle.stroke='#0000FF';
        else if(hovered) thisTextStyle.stroke='#FF0000';

        return (
            <svg
                key={`histo-article-svg-${article.id}`}
                id={`histo-article-svg-${article.id}`}
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                width={viewportWidth}
                height={viewportHeight}
                x={x-xMargin}
                y={y}
                onMouseEnter={()=>{setHoveredArticle(article.id)}}
                onMouseLeave={()=>{setHoveredArticle()}}
                ref={node => {
                    if(node) addBox(node,article);
                }}
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id={`article-image-${article.id}`} x="0" y="0" patternUnits="userSpaceOnUse" height="30" width="30">
                        <RImageMini deltaX={deltaX} id={article.detailImageResource} mode={'svg'}/>
                    </pattern>
                </defs>
                <rect
                    fill={selected?"blue":hovered?"red":"black"}
                    x={xMargin}
                    y={viewportHeight/8}
                    width={Math.max(endX-x,1)}
                    height={viewportHeight/4}
                    rx={2}
                    ry={2}
                    onClick={this.handleOnClick}
                />
                <text
                    textAnchor="start"
                    x={deltaX + xMargin+viewportHeight/2}
                    y={viewportHeight-2}
                    style={thisTextStyle}
                    onClick={this.handleOnClick}
                >
                    {article.title}
                </text>

                <circle
                    cx={deltaX + xMargin}
                    cy={viewportHeight/2}
                    r="13"
                    fill={`url(#article-image-${article.id})`}
                    onClick={this.handleOnClick}
                />
                <ProgressionCircle
                    key={`histo-article-progcircle-${article.id}`}
                    staticRate={0}
                    rate={currentProgression}
                    cx={deltaX + xMargin}
                    cy={viewportHeight/2}
                    r={13}/>
            </svg>
        );
    }
}

export default HBExplorerPanelArticle;
//export default React.forwardRef((props, ref) => (<HBExplorerPanelArticle ref={ref} {...props} />));