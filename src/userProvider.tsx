import React, { Component, createContext } from "react";
import { auth } from "./firebase-config";
import { YTVideo } from './components/Home/MediaList';
import firebase from 'firebase';
import { firestore } from './firebase-config';

export interface mediaList {
  list_title: string
  mediaItems: Array<YTVideo>
}

interface UserContextProps {
  user: firebase.User | null
  loading: boolean
  mediaLists: Array<mediaList>
}

export const UserContext = createContext({ user: null } as UserContextProps);
class UserProvider extends Component {
  state = {
    user: null,
    loading: true,
    mediaLists: []
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      this.setState({ 
        user: userAuth,
        loading: false,
      });
      if (userAuth) {
        const top_picks_ref = firestore.collection('top picks');
        top_picks_ref.get()
        .then(snapshot => {
            this.setState({
              mediaLists: [
                {
                  list_title: 'Top Picks',
                  mediaItems: snapshot.docs.map(doc => doc.data())
                }
            ]
            });
        })
      }
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