import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import SongList from './SongList';

interface MainProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Main: React.FC<MainProps> = ({ setLoading }) => {
    return (
        <div className='main'>
            <div className='nav'>
                <div className='search-container'>
                    <input 
                        placeholder='Search for songs, artists, albums, and more...'
                        className='search-input'
                    />
                </div>

                <div className='nav-item-list'>
                    <ul>
                        <li>
                            <NotificationsIcon />
                        </li>
                        <li>
                            <AccountCircleIcon />
                        </li>
                    </ul>
                </div>
            </div>

            <SongList songListTitle='Top Picks'/>
            <SongList songListTitle='Favourites'/>


        </div>
    )
}

export default Main;