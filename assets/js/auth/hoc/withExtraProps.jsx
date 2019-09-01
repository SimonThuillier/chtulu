// HOC for extraProps injection (usefull for some components in forms)
import React from "react";

function withExtraProps(WrappedComponent, extraProps) {
    return class extends React.Component {
        render() {
            return <WrappedComponent {...extraProps} {...this.props} />;
        }
    };
}

export default withExtraProps;