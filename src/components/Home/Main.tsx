import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { IconButton, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import MediaList from './MediaList';
import { YTVideo } from './MediaList';
import {mediaList} from '../../userProvider';


interface MainProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    selectedMediaList: mediaList | null
}

const Main: React.FC<MainProps> = ({ setLoading, selectedMediaList }) => {

    const [searching, setSearching] = React.useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [searchResult, setSearchResult] = React.useState<Array<YTVideo>>([]);
    const [searchLoaded, setSearchLoaded] = React.useState<boolean>(true);

    const search = () => {
        if (searchQuery === '') return;
        setSearching(true);
        setSearchLoaded(false);
        setSearchResult([]);
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=AIzaSyB2alQvPKSivl3PYRzmz5UIovfFHYqmzXs`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            setSearchLoaded(true);
            console.log(data.items);
            setSearchResult(data.items.map((item: { snippet: { title: any; channelTitle: any; thumbnails: { default: any; }}; id: { videoId: any; }; }) => {
                return {
                    title: item.snippet.title,
                    author_name: item.snippet.channelTitle,
                    thumbnail_url: item.snippet.thumbnails.default.url,
                    video_id: item.id.videoId
                } as YTVideo;
            }));
        })
        .catch(err => {
            setSearchLoaded(true);
            console.log('errpr', err)
        });
    }

    return (
        <div className='main'>
            <div className='nav'>
                <div className='search-container'>
                    <input 
                        placeholder='Search for videos...'
                        className='search-input'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <IconButton
                        onClick={() => search()}
                    >
                        <SearchIcon fontSize='large'/>
                    </IconButton>
                    {
                        searching && 
                        <IconButton
                            onClick={() => {
                                setSearching(false)
                                setSearchQuery('');
                            }}
                        >
                            <CloseIcon fontSize='large'/>
                        </IconButton>
                    }
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

            {
                searching ? 
                    searchLoaded ? 
                        <MediaList mediaListTitle={searchQuery} mediaList={searchResult} isSearchResult={true}/>
                    :
                        <CircularProgress style={{
                            margin: 'auto'
                        }}/>
                :
                    selectedMediaList ? 
                        <MediaList mediaListTitle={selectedMediaList.list_title} mediaList={selectedMediaList.mediaItems}/>
                        :
                        <></>
            
            }

        </div>
    )
}

export default Main;