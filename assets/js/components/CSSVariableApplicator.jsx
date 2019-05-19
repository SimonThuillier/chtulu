import React from "react";

class CSSVariableApplicator extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.updateCSSVariables(this.props.variables);
    }

    componentDidUpdate(prevProps) {
        if (this.props.variables !== prevProps.variables) {
            this.updateCSSVariables(this.props.variables);
        }
    }

    updateCSSVariables(variables) {
        Object.entries(variables).forEach(([prop, value]) => {
            //console.log(`prop : ${prop}, value : ${value}`);
            document.documentElement.style.setProperty(prop, value);
        });
    }

    render() {
        //return <div>{this.props.children}</div>;
        return "";
    }
}

export default CSSVariableApplicator;
