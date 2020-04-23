import React from "react";
import { Auth } from "aws-amplify";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import Navbar from "./components/Navbar";
import "./App.css";

class App extends React.Component {
  state = { user: null };

  componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      user ? this.setState({ user }) : this.setState({ user: null });
    } catch (err) {
      console.error(err);
      this.setState({ user: null });
    }
  };

  handleSignout = async () => {
    console.log("signing out");
    try {
      await Auth.signOut();
      this.setState({ user: null });
    } catch (err) {
      console.error("Error singing out user", err);
    }
  };

  render() {
    const { user } = this.state;
    if (this.props.authState === "signedIn" && user) {
      return (
        <Router>
          <>
            <Navbar user={user} handleSignout={this.handleSignout} />
            <div className="app-container">
              <Route exact path="/" component={HomePage} />
              <Route path="/profile" component={ProfilePage} />
              <Route
                path="/markets/:marketId"
                component={({ match }) => (
                  <MarketPage marketId={match.params.marketId} />
                )}
              />
            </div>
          </>
        </Router>
      );
    } else {
      return null;
    }
  }
}

export default App;
