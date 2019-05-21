/**
 * @package geometry.js
 * @doc geometry.js : Contains various geometry functions for hbase
 */
export const LEFT = "LEFT";
export const RIGHT =  "RIGHT";
export const TOP =  "TOP";
export const BOTTOM = "BOTTOM";
export const HORIZONTAL = "HORIZONTAL";
export const VERTICAL = "VERTICAL";
export const PORTRAIT = "PORTRAIT";
export const LANDSCAPE = "LANDSCAPE";

/**@doc returns the rounded distance between two positions {x,y}
 * @param pos1
 * @param pos2
 * @returns {number}
 */
export const distance = (pos1, pos2) => {
    return Math.ceil(
        Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
    );
};

/** @doc returns length of a position ,eg its distance from the origin {0,0}
 * @param position
 * @returns {number}
 */
export const vectorLength = (position) => {
    return Math.ceil(
        Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2)) + 1
    );
};

/** @doc returns the vector difference {pos2}-{pos1}
 * @param pos1
 * @param pos2
 * @returns {object}
 */
export const vectorDiff = (pos1, pos2) => {
    return { x: pos2.x - pos1.x, y: pos2.y - pos1.y };
};

/**
 * @doc returns the absolute path from a custom horizontally-relative path
 * @param relPath
 * @param hScale
 * @returns {string}
 */
export const hScalePath = function(relPath, hScale) {
    let hasZ = relPath.indexOf("Z") !== -1;
    let rawArrayPath = relPath
        .replace("M", "")
        .replace("Z", "")
        .trim()
        .split("L");
    let arrayPath = [];
    rawArrayPath.forEach(function(element) {
        arrayPath.push(element.trim().split(" "));
    });
    let absPath = "M ";
    arrayPath.forEach(function(element) {
        let relX = element[0];
        if (relX.indexOf("%") === -1) {
            return;
        }
        relX = Number(relX.replace("%", ""));
        let x = Math.floor(hScale(relX));
        absPath = absPath + " " + x + " " + element[1] + " L";
    });
    absPath = absPath.substring(0, absPath.length - 2).trim();
    if (hasZ) absPath = absPath + " Z";
    return absPath;
};

/**
 * @doc returns the absolute path from a custom vertically-relative path
 * @param relPath
 * @param vScale
 * @returns {string}
 */
export const vScalePath = function(relPath, vScale) {
    let hasZ = relPath.indexOf("Z") !== -1;
    let rawArrayPath = relPath
        .replace("M", "")
        .replace("Z", "")
        .trim()
        .split("L");
    let arrayPath = [];
    rawArrayPath.forEach(function(element) {
        arrayPath.push(element.trim().split(" "));
    });
    let absPath = "M ";
    arrayPath.forEach(function(element) {
        let relY = element[1];
        if (relY.indexOf("%") === -1) {
            return;
        }
        relY = Number(relY.replace("%", ""));
        let y = Math.floor(vScale(relY));
        absPath = absPath + " " + element[0] + " " + y + " L";
    });
    absPath = absPath.substring(0, absPath.length - 2).trim();
    if (hasZ) absPath = absPath + " Z";
    return absPath;
};

/**
 * @doc returns the minimum X of a path
 * @param {string} path
 * @returns {number}
 */
export const getPathMinX = function(path) {
    let arrayPath = path
        .replace("M", "")
        .replace("Z", "")
        .trim()
        .split("L");
    let minX = 100000;
    arrayPath.forEach(function(element) {
        minX = Math.min(minX, Number(element.trim().split(" ")[0]));
    });
    return minX;
};

/**
 * @doc returns the maximum X of a path
 * @param {string} path
 * @returns {number}
 */
export const getPathMaxX = function(path) {
    let arrayPath = path
        .replace("M", "")
        .replace("Z", "")
        .trim()
        .split("L");
    let maxX = 0;
    arrayPath.forEach(function(element) {
        maxX = Math.max(maxX, Number(element.trim().split(" ")[0]));
    });
    return maxX;
};

/** @doc returns D3 points for htsChevron : takes for argument the upper point and the peak point
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {String}
 * */
export const getChevronDefPoints = function(x1, y1, x2, y2) {
    return [
        "M",
        x1,
        y1,
        "L",
        x2,
        y2,
        "L",
        x1,
        y1 + 2 * (y2 - y1),
        "L",
        x1 + (x2 - x1) / 2,
        y2,
        "Z"
    ].join(" ");
};

/** @doc returns D3 points for isocel triangle : takes for argument the upper point and the peak point
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {String}
 * */
export const getTriangleDefPoints = function(x1, y1, x2, y2) {
    return ["M", x1, y1, "L", x2, y2, "L", x1, y1 + 2 * (y2 - y1), "Z"].join(
        " "
    );
};

/** @doc returns D3 points for diamond : takes for argument the upper point and lower point coordinates and the ratio horizontal vs vertical
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} ratio
 * @returns {String}
 */
export const getDiamondDefPoints = function(x1, y1, x2, y2, ratio) {
    const horizontalArrow =
        ratio * Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const angle = Math.atan((x1 - x2) / (y2 - y1));

    const xc = x1 + (x2 - x1) / 2;
    const yc = y1 + (y2 - y1) / 2;

    const x3 = xc + 0.5 * horizontalArrow * Math.cos(angle);
    const y3 = yc + 0.5 * horizontalArrow * Math.sin(angle);
    const x4 = xc - 0.5 * horizontalArrow * Math.cos(angle);
    const y4 = yc - 0.5 * horizontalArrow * Math.sin(angle);

    return ["M", x1, y1, "L", x3, y3, "L", x2, y2, "L", x4, y4, "Z"].join(" ");
};

/** @doc returns D3 points for ArrowPeak : takes for argument the left upper point,the left upper peak point and the peak right point
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @returns {String} */
export const getArrowDefPoints = function(x1, y1, x2, y2, x3, y3) {
    return [
        "M",
        x1,
        y1,
        "L",
        x2,
        y1,
        "L",
        x2,
        y2,
        "L",
        x3,
        y3,
        "L",
        x2,
        y2 + 2 * (y3 - y2),
        "L",
        x2,
        y1 + 2 * (y3 - y1),
        "L",
        x1,
        y1 + 2 * (y3 - y1),
        "Z"
    ].join(" ");
};

/**
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node}
 * @doc returns true if two svg collides
 * @param {external:Node} node1 the first valid svg node to be checked
 * @param {external:Node} node2 the second valid svg node to be checked
 * @param {Number} margin minimal margin between the two nodes before declaring collision
 * @param {string} returnType VERTICAL to return vertical delta, HORIZONTAL for horizontal delta
 * @returns {Number} */
export const nodesCollide = function (node1,node2,margin=0,returnType=VERTICAL) {
    const node1Box = node1.getBBox();
    const node1Left = node1.x.baseVal.value - margin;
    const node1Right = node1.x.baseVal.value + node1Box.width + 2 * margin;
    const node1Top = node1.y.baseVal.value - margin;
    const node1Bottom = node1.y.baseVal.value + node1Box.height + 2 * margin;

    const node2Box = node2.getBBox();
    const node2Left = node2.x.baseVal.value - margin;
    const node2Right = node2.x.baseVal.value + node2Box.width + 2 * margin;
    const node2Top = node2.y.baseVal.value - margin;
    const node2Bottom = node2.y.baseVal.value + node2Box.height + 2 * margin;

    const {abs,min,max} = Math;

    const hCollide = (node1Left < node2Right && node1Right > node2Left)?
        min(abs(node1Left - node2Right),abs(node1Right - node2Left)):
        -min(abs(node1Left - node2Right),abs(node1Right - node2Left));
    ;
    const vCollide = (node1Top < node2Bottom && node1Bottom > node2Top)?
        min(abs(node1Top - node2Bottom),abs(node1Bottom - node2Top)):
        -min(abs(node1Top - node2Bottom),abs(node1Bottom - node2Top))
    ;

    return (returnType===VERTICAL?
        (hCollide>0?vCollide:null):
            (vCollide>0?hCollide:null)
    );
};

/** @doc determine if two DOMRects are equals or not, based on their properties
 * @param {DOMRect} rect1
 * @param {DOMRect} rect2
 * @returns {Boolean} */
export const domRectEquals = function (rect1,rect2){
    const {x1,y1,width1,height1,top1,right1,bottom1,left1} = rect1;
    const {x2,y2,width2,height2,top2,right2,bottom2,left2} = rect2;

    return x1===x2 && y1===y2 && width1===width2 && height1===height2 &&
        top1===top2 && right1===right2 && bottom1===bottom2 && left1===left2;
};