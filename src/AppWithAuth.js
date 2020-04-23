import React from "react";
import App from "./App";
import { Authenticator, AmplifyTheme, SignIn } from "aws-amplify-react";

class AppWithAuth extends React.Component {
  render() {
    return (
      <div>
        <Authenticator hideDefault={true} theme={theme}>
          <SignIn />
          <App />
        </Authenticator>
      </div>
    );
  }
}
const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "#ffc0cb"
  },
  button: { ...AmplifyTheme.button, backgroundColor: "var(--amazonOrange)" },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: "5px"
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: "var(--squidInk)"
  }
};

export default AppWithAuth;
