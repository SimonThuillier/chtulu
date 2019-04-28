// HOC for extraData injection (usefull for some components in forms)
import React from "react";

function withExtraData(WrappedComponent, extraData) {
    return class extends React.Component {
        render() {
            return <WrappedComponent extraData={extraData} {...this.props} />;
        }
    };
}

export default withExtraData;