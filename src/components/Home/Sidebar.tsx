import React from 'react';
import './style.css';
import { Button } from '@material-ui/core';
import {UserContext} from '../../userProvider';
import { useHistory } from 'react-router-dom';

import { auth } from '../../firebase-config';

const Sidebar: React.FC<{}> = () => {

    const [selected, setSelected] = React.useState<number>(0);
    const user = React.useContext(UserContext);
    const history = useHistory();

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
                    width: min(window.innerWidth, window.innerHeight)/7
                }}
            >

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