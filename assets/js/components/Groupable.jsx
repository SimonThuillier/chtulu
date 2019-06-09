// HOC that allow use of groups to render components with subcomponents
import React from "react";
import cmn from "../util/common";

function Groupable(props) {
    if (!props.children || !props.groups) return props.children;
    //console.log(props.children[0]);
    const firstChild = Array.isArray(props.children)
        ? props.children[0]
        : props.children;

    const firstChildClass = firstChild.type;
    //console.log(firstChild.type["Title"]);

    let finalChildren = [];

    Object.keys(props.groups).forEach(group => {
        //console.log(cmn.capitalize(group));
        //console.log(firstChildClass[cmn.capitalize(group)]);
        if (typeof firstChildClass[cmn.capitalize(group)] !== "undefined") {
            finalChildren.push(
                firstChildClass[cmn.capitalize(group)]({ key: { group } })
            );
        } else {
            console.warn(
                `non-existent group ${cmn.capitalize(
                    group
                )} called for ${firstChildClass}`
            );
        }
    });

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
