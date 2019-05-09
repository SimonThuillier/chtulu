import React from "react";

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
    }

    render() {
        const {article,timeScale,originY} = this.props;

        const x = timeScale(article.beginHDate.beginDate);
        const endX = timeScale(article.endHDate?article.endHDate.endDate:new Date());

        const xMargin = 13;
        const viewportHeight = 30;

        let viewportWidth = Math.max(endX-x + 2*xMargin,(article.title.length)*15);

        const y = article.currentY - originY;


        return (
            <svg
                key={`histo-article-svg-${article.id}`}
                id={`histo-article-svg-${article.id}`}
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                width={viewportWidth}
                height={viewportHeight}
                x={x-xMargin}
                y={y}
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="article-image" x="0" y="0" patternUnits="userSpaceOnUse" height="30" width="30">
                        <image x="0" y="0" href="http://localhost:8000/media/cache/mini/246-clement-1.jpeg"/>
                    </pattern>
                </defs>
                <rect fill="black" x={xMargin}  y={viewportHeight/8} width={Math.max(endX-x,1)} height={viewportHeight/4} rx={2} ry={2}/>
                <text textAnchor="start" x={xMargin+viewportHeight/2}  y={viewportHeight-2} style={textStyle}>
                    {article.title}
                </text>

                <circle cx={xMargin} cy={viewportHeight/2} r="13" fill="url(#article-image)"/>

            </svg>


        );
    }
}

export default React.forwardRef((props, ref) => (<HBExplorerPanelArticle ref={ref} {...props} />));