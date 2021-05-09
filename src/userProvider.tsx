import React, { Component, createContext } from "react";
import { auth } from "./firebase-config";
import firebase from 'firebase';

interface UserContextProps {
  user: firebase.User | null
}

export const UserContext = createContext({ user: null } as UserContextProps);
class UserProvider extends Component {
  state = {
    user: null
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      console.log(userAuth);
      this.setState({ user: userAuth});
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;