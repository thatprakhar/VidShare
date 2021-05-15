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

interface UserProviderState {
  user: firebase.User | null
  loading: boolean
  mediaLists: Array<mediaList>
}

class UserProvider extends Component<{},UserProviderState> {
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
        this.setState({
          loading: true
        })
        const lists_ref = firestore.collection('lists');
        lists_ref.get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            const list_title = doc.data().list_title;
            const top_picks_ref = firestore.collection(list_title);
            top_picks_ref.get()
            .then(snapshot => {
                this.setState(prevState => ({
                  mediaLists: [
                    ...prevState.mediaLists,{
                      list_title,
                      mediaItems: (snapshot.docs.map(doc => doc.data()) as YTVideo[])
                    } as mediaList
                ]
                }));
            })
          })
          this.setState({
            loading: false
          })
        })
        .catch(err => {
          console.error(err)
          this.setState({
            loading: false
          })
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