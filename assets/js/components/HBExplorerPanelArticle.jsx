import React from "react";

const textStyle = {
    fontFamily: "Arial, sans-serif",
    fontSize  : 16,
    stroke     : "#000000",
    fill       : "#000000"
};


    function collide() {
    node = this.node();
    nodeBox = node.getBBox();
    nodeLeft = nodeBox.x;
    nodeRight = nodeBox.x + nodeBox.width;
    nodeTop = nodeBox.y;
    nodeBottom = nodeBox.y + nodeBox.height;

    d3.selectAll("circle")
        .attr("fill", function() {
            if (this !== node) {
                otherBox = this.getBBox();

                otherLeft = otherBox.x;
                otherRight = otherBox.x + otherBox.width;
                otherTop = otherBox.y;
                otherBottom = otherBox.y + otherBox.height;

                collideHoriz = nodeLeft < otherRight && nodeRight > otherLeft;
                collideVert = nodeTop < otherBottom && nodeBottom > otherTop;

                if ( collideHoriz && collideVert) {
                    return "tomato";
                } else {
                    return "none"
                }

            } else {
                return "none";
            }
        });
}

/**
 * molecule level component defining display of one article in the panel
 */
class HBExplorerPanelArticle extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick (e){
        const {selectArticle,article,onPanelMoveEnd} = this.props;
        e.preventDefault();
        e.stopPropagation();

        selectArticle([article.id]);
        onPanelMoveEnd(e);

    }

    render() {
        const {article,timeScale,originY,addBox,selected} = this.props;

        const x = timeScale(article.beginHDate.beginDate);
        const endX = timeScale(article.endHDate?article.endHDate.endDate:new Date());

        const xMargin = 13;
        const viewportHeight = 30;

        let viewportWidth = Math.max(endX-x + 2*xMargin,(article.title.length)*15);

        const y = article.currentY - originY;

        let thisTextStyle = {};
        Object.assign(thisTextStyle,textStyle);
        if(selected) thisTextStyle.stroke='#0000FF';

        return (
            <svg
                key={`histo-article-svg-${article.id}`}
                id={`histo-article-svg-${article.id}`}
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                width={viewportWidth}
                height={viewportHeight}
                x={x-xMargin}
                y={y}
                ref={node => {
                    if(node) addBox(node,article);
                }}
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="article-image" x="0" y="0" patternUnits="userSpaceOnUse" height="30" width="30">
                        <image x="0" y="0" href="http://localhost:8000/media/cache/mini/246-clement-1.jpeg"/>
                    </pattern>
                </defs>
                <rect
                    fill={selected?"blue":"black"}
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
                    x={xMargin+viewportHeight/2}
                    y={viewportHeight-2}
                    style={thisTextStyle}
                    onClick={this.handleOnClick}
                >
                    {article.title}
                </text>

                <circle
                    cx={xMargin}
                    cy={viewportHeight/2}
                    r="13"
                    fill="url(#article-image)"
                    onClick={this.handleOnClick}
                />

            </svg>


        );
    }
}

export default React.forwardRef((props, ref) => (<HBExplorerPanelArticle ref={ref} {...props} />));