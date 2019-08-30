export const getComponentClassType = reduxFormType => {
  switch (reduxFormType) {
    case "textarea":
      return "textarea";
    case "select":
      return "select";
    default:
      return "input";
  }
};
