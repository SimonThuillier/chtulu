import React from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import { Field, reduxForm } from "redux-form/immutable";
import { getComponentClassType } from "../util/formUtil";
import HDateInput from "./HDateInput";
const Imm = require("immutable");

const style = {
  position: "inherit"
};

const formUid = require("uuid/v4")();

class HBExplorerDateInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("component didmount");
    const { initialize, input } = this.props;
    const data = Imm.Map({ hInterval: input });
    initialize(data);
  }

  componentDidUpdate(prevProps, prevState) {
    const oldHInterval = prevProps.input;
    const { initialize, input } = this.props;

    if (oldHInterval && !input.equals(oldHInterval)) {
      const data = Imm.Map({ hInterval: input });
      initialize(data);
    }
  }

  render() {
    const {
      onSubmit,
      pristine,
      reset,
      submitting,
      load,
      valid,
      setHInterval
    } = this.props;

    return (
      <Field
        style={{
          position: "absolute",
          padding: 0,
          margin: 0,
          minWidth: 450,
          textAlign: "center"
        }}
        name="hInterval"
        type="text"
        component={HDateInput}
        placeholder="Intervalle de l'explorateur"
        label={null}
        onChange={setHInterval}
      />
    );
  }
}

HBExplorerDateInput = reduxForm({
  form: formUid,
  destroyOnUnmount: false
})(HBExplorerDateInput);

HBExplorerDateInput = connect(
  state => {
    return { pendingForm: state.getIn(["form", formUid]) };
  },
  {}
)(HBExplorerDateInput);

export default HBExplorerDateInput;
