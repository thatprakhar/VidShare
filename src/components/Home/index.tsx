import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import { Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@material-ui/core';
import {mediaList, UserContext} from '../../userProvider';
import { firestore } from '../../firebase-config';

import './style.css';
import { Redirect } from 'react-router-dom';



const Home: React.FC<{}> = () => {

    const user = React.useContext(UserContext);
    const mediaLists = React.useContext(UserContext).mediaLists;
    const [selectedMediaList, setSelectedMediaList] = React.useState<mediaList | null>(null);
    const [showCreateNewListDialog, setShowCreateNewListDialog] = React.useState<boolean>(false);
    
    const [newListTitle, setNewListTitle] = React.useState<string>('');

    const createNewList = () => {
        if (newListTitle.trim() === '') return;
    
        if (mediaLists.some(list => list.list_title === newListTitle)) return;

        const lists_ref = firestore.collection('lists');

        lists_ref.doc(newListTitle).set({
            list_title: newListTitle
        })
        .then(() => {
            firestore.collection(newListTitle).doc('a').set({
                temp: 'a'
            })
            .then(() => {
                firestore.collection(newListTitle).doc('a').delete()
                .then(() => {
                    setShowCreateNewListDialog(false);
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }


    const openSidebar = () => {
        if (window.innerWidth >= 1000) return;
        const elem = document.getElementById('side');
        if (!elem) return;
        elem.style.width = '90vw';
        elem.style.height = '100vh';
    }

    const closeSidebar = () => {
        if (window.innerWidth >= 1000) return;
        const elem = document.getElementById('side');
        if (!elem) return;
        elem.style.width = '0';
        elem.style.height = '0';
    }

    const [loading, setLoading] = React.useState<boolean>(false);


    React.useEffect(() => {
        if (user && user.mediaLists.length > 0) {
            setSelectedMediaList(user.mediaLists[0]);
        }
    }, [user])

    if (user.loading) {
        return (
            <Backdrop open={user.loading}>
                <CircularProgress />
            </Backdrop>
        )
    }

    if (user.user === null) {
        return (
            <Redirect to="/login" />
        )
    }

    return (
        <div
            className='home'
        >
            
            <Sidebar setLoading={setLoading} setSelectedMediaList={setSelectedMediaList} setShowCreateNewListDialog={setShowCreateNewListDialog} closeSidebar={closeSidebar}/>
            <Main setLoading={setLoading} selectedMediaList={selectedMediaList} openSidebar={openSidebar}/>
            <Backdrop open={loading} style={{
                zIndex: 99,
                color: '#fff',
            }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog open={showCreateNewListDialog} onClose={() => setShowCreateNewListDialog(false)}>
                <DialogTitle>Create a new list</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label='List title'
                    fullWidth
                    value={newListTitle}
                    onChange={e => setNewListTitle(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowCreateNewListDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => createNewList()} color="primary">
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Home;