import React from "react";
import posed from "react-pose";

export default posed.div({
    enter: {
        opacity: 1,
        beforeChildren: true,
        transition: { duration: 200, ease: "linear" }
    },
    exit: {
        opacity: 0,
        afterChildren: true,
        transition: { duration: 200, ease: "linear" }
    }
});