import React from "react";
import ProgressionCircle from "../atoms/ProgressionCircle";
import {AVAILABLE_AREAS} from '../../util/explorerUtil';
import {getInlinedCss} from '../../util/cssUtil';

const defaultTextStyle = {
    fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica",
    fontSize  : 16,
    stroke     : "none",
    fill       : "#000000",
    fontStyle: 'normal'
};


// to prerender title text of the article and measure its width
let mockSvgText = null;

/**
 * molecule level component defining display of one article in the panel
 */
class HBExplorerPanelMarker extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
        this.hasAddedBox = false;
        //console.log("HBExplorerPanelArticle created");
        //console.log(props.article);

        mockSvgText = document.getElementById(`time-panel-svg-article-mock`);
    }

    componentWillUnmount(){
        console.log("HBExplorerPanelmarker will unmount");
    }

    handleOnClick (e){
        const {selectArticle,article,onPanelMoveEnd} = this.props;
        e.preventDefault();
        e.stopPropagation();

        selectArticle([article.id]);
        onPanelMoveEnd(e);

    }

    render() {
        const {marker, timeScale,originY,addBox,selected,width,cursorDate} = this.props;

        const {hDate,html} = marker;

        const id = 'time-panel-marker-' + marker.id;

        const currentProgression = hDate.getRateOfDate(cursorDate);

        const xMargin = 16;
        const {max,min} = Math;

        const x = timeScale(hDate.beginDate);
        const endX = timeScale(hDate.endDate);


        let realTitle = html;
        if(endX>width && x <0) realTitle = realTitle + ' //';


        let currentTextStyle = defaultTextStyle;
        //console.log(`textStyle ${realTitle}`);
        //console.log(currentTextStyle);

        mockSvgText.setAttribute('style',getInlinedCss(Object.assign({visibility:'hidden',textLength:realTitle.length},currentTextStyle)));
        mockSvgText.innerHTML=realTitle;
        const textWidth = mockSvgText.getBBox().width+xMargin;
        //console.log(mockSvgText);
        //console.log(textWidth);


        let realX = x-xMargin;
        let realEndX = endX;
        let deltaX = realX < 0 ? min(-realX,max(realEndX-realX,1)):0;
        let viewportWidth = max(1500,realEndX-realX);
        //console.log(viewportWidth);


        if((x<0 && endX<0) || (x>width && endX>width)){
            viewportWidth = 0;
            realX = -2000;
            realEndX = -2000;
            deltaX=0;
        }
        else if(realEndX>width && x <0){
            realX=0;
            realEndX = 2*xMargin+textWidth;
            viewportWidth = realEndX-xMargin;
            deltaX=0;
        }




        const viewportHeight = 35;
        const y = 20;
        const component= this;

        setTimeout(()=>{
            const element = document.getElementById('time-panel-marker-content-' + marker.id);
            if(!!element) element.innerHTML = realTitle;
        },5);


        return (
            <svg
                key={`histo-article-svg-${marker.id}`}
                id={`time-panel-marker-${marker.id}`}
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                width={viewportWidth}
                height={viewportHeight}
                x={realX}
                y={originY}
                onMouseEnter={()=>{}}
                onMouseLeave={()=>{}}
                onClick={(e)=>{
                   //e.preventDefault();
                   //e.stopPropagation();
                    const event = new CustomEvent('hb.explorer.set.marker');
                    event.iconId = !!marker.markerId?marker.markerId:marker.id;
                    event.hbOrigin=AVAILABLE_AREAS.TIME;
                    window.dispatchEvent(event);
                }}
                ref={node => {
                    if(node && !component.hasAddedBox){
                        addBox(node,marker[0]);
                        component.hasAddedBox = true;
                    }
                }}
                xmlns="http://www.w3.org/2000/svg">
                <rect
                    fill={"black"}
                    stroke={'none'}
                    x={xMargin}
                    y={7}
                    width={max(realEndX-realX-xMargin,1)}
                    height={4}
                    rx={2}
                    ry={2}
                    onClick={this.handleOnClick}
                />
                <foreignObject
                    x={2*xMargin+deltaX}
                    y={12}
                    width={viewportWidth-(2*xMargin+deltaX)}
                    height={viewportHeight-18}
                >
                    <div id={'time-panel-marker-content-' + marker.id} xmlns="http://www.w3.org/1999/xhtml">
                    </div>
                </foreignObject>
                <circle
                    cx={xMargin + deltaX}//{deltaX + xMargin}
                    cy={10}
                    r="8"
                    fill={marker.id.includes('GEO_MARKER')?`blue`:`orange`}
                    onClick={this.handleOnClick}
                />
                <ProgressionCircle
                    key={`histo-article-progcircle-${id}`}
                    staticRate={0}
                    rate={currentProgression}
                    cx={xMargin + deltaX}//{deltaX + xMargin}
                    cy={10}
                    r={8}/>
            </svg>
        );
    }
}

export default HBExplorerPanelMarker;
