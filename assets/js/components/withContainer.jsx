// HOC for container injection (usefull for widgets in modal)
import React from "react";

function withContainer(WrappedComponent, container) {
    return class extends React.Component {
        render() {
            return <WrappedComponent container={container} {...this.props} />;
        }
    };
}

export default withContainer;