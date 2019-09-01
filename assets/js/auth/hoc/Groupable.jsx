// HOC that allow use of groups to render components with subcomponents
import React from "react";
import cmn from "../../util/common";
import {isClassComponent} from "../../util/reactUtil";

function Groupable(props) {
    if (!props.children || !props.groups) return props.children;
    //console.log(props.children[0]);
    const firstChild = Array.isArray(props.children)
        ? props.children[0]
        : props.children;

    const firstChildClass = firstChild.type;
    //console.log(firstChild.type["Title"]);
    const uid = props.subKey; // IMPORTANT ! to give children their keys

    let finalChildren = [];

    Object.keys(props.groups).forEach(group => {
        //console.log(cmn.capitalize(group));
        //console.log(firstChildClass[cmn.capitalize(group)]);
        const subComponent = firstChildClass[cmn.capitalize(group)];
        if (typeof subComponent  !== "undefined") {
            const key = `${uid}-${group}`;
            //console.log(`key : ${key}`);

            finalChildren.push(
                React.createElement(subComponent,{ key: key },null)
            );

            /*if(isClassComponent(subComponent)){
                const element = React.createElement(subComponent,{ key: key },null);
                //console.log(element.props);
                //console.log(element.props.key);
                console.log(element.key);
                finalChildren.push(
                    element
                    //new subComponent({ key: { group } })
                );
            }
            else{

            }*/

            /*console.log(`${cmn.capitalize(group)} : ${typeof firstChildClass[cmn.capitalize(group)]}`);
            console.log(`${cmn.capitalize(group)} : ${isClassComponent(firstChildClass[cmn.capitalize(group)])}`);
            finalChildren.push(
                firstChildClass[cmn.capitalize(group)]({ key: { group } })
            );*/
        } else {
            console.warn(
                `non-existent group ${cmn.capitalize(
                    group
                )} called for ${firstChildClass}`
            );
        }
    });

    const originalChildren = firstChild.props.children;

    //console.log(originalChildren);

    if (originalChildren !== null && Array.isArray(originalChildren)) {
        finalChildren = finalChildren.concat(originalChildren);
    }
    else if (originalChildren !== null && !Array.isArray(originalChildren)) {
        finalChildren.push(originalChildren);
    }


    //finalChildren = finalChildren.concat(firstChild.props.children);

    if (finalChildren.length < 1) {
        finalChildren = null;
    } else if (finalChildren.length === 1) {
        finalChildren = finalChildren[0];
    }



    //console.log(finalChildren);

    let finalProps = { ...firstChild.props, children: finalChildren };

    return <firstChild.type {...finalProps} />;

    //return (React.createElement(props.children[0],));
}

export default Groupable;
