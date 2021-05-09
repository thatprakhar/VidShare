import React from 'react';
import './style.css';
import { Button } from '@material-ui/core';
import {UserContext} from '../../userProvider';
import { useHistory } from 'react-router-dom';

import defaultImage from './user-avatar.jpeg';

import { auth, firebaseStorage } from '../../firebase-config';

interface SidebarProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({ setLoading }) => {

    const [selected, setSelected] = React.useState<number>(0);
   

    const user = React.useContext(UserContext);
    const history = useHistory();

    React.useEffect(() => {
        console.log(user.user?.photoURL);
    }, [user])

    const min = (a: number, b: number) => {
        return a < b ? a : b;
    }

    const renderList = () => {
        const list = ['Top Picks', 'Discover', 'Favourites', 'Playlists', 'Messages'];


        let elems: JSX.Element[] = [];

        list.forEach((item, idx) => {
            elems.push(
                <div
                    className={
                        'sidebar-item' + (selected === idx ? ' sidebar-item-selected' : '')
                    }
                    onClick={e => {
                        setSelected(idx);
                    }}
                    key={idx}
                >
                    <p>
                        {item}
                    </p>
                </div>
            )
        });
        
        return elems;
    }

    return (
        <div
            className='sidebar'
        >
        <div
            className='profile'
        >
            <div
                className='avatar'
                style={{
                    height: min(window.innerWidth, window.innerHeight)/7,
                    width: min(window.innerWidth, window.innerHeight)/7,
                    cursor: 'pointer'
                }}
                onClick={() => {
                    document.getElementById('profile-avatar-selector')?.click();
                }}
            >
                <img 
                    src={user.user?.photoURL ? user.user.photoURL : defaultImage}
                    height={min(window.innerWidth, window.innerHeight)/7}
                    width={min(window.innerWidth, window.innerHeight)/7}
                    alt='user-avatar'
                />
                <input id='profile-avatar-selector' type='file' name="img" accept="image/*" onChange={(e) => {
                    if (e.target.files == null) {
                        return;
                    }
                    const imageAsFile = e.target.files[0];
                    const uploadTask = firebaseStorage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
                    setLoading(true);
                    uploadTask.on('state_changed', 
                    (snapShot) => {
                      //takes a snap shot of the process as it is happening
                    }, (err) => {
                      //catches the errors
                      console.log(err)
                      setLoading(false)
                    }, () => {
                      // gets the functions from firebaseStorage refences the image firebaseStorage in firebase by the children
                      // gets the download url then sets the image from firebase as the value for the imgUrl key:
                      firebaseStorage.ref('images').child(imageAsFile.name).getDownloadURL()
                       .then(fireBaseUrl => {
                            user.user?.updateProfile({
                                photoURL: fireBaseUrl
                            }).then(function() {
                                setLoading(false)
                                console.log('updated succesfully')
                            }).catch(function(error) {
                                setLoading(false)
                                console.log('error', error)
                            });
                       })
                    })
                }}/>
            </div>
            <p>
                {user.user?.displayName}
            </p>
        </div>
            {renderList()}
            <div className='logout-container'>
                <Button variant='outlined' color='secondary'
                    onClick={() => {
                        auth.signOut().then(() => {
                            history.push('/login');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }}
                >
                    Log Out
                </Button>
            </div>
        </div>

        
    )
};

export default Sidebar;