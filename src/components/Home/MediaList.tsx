import React from 'react';
import {IconButton, Dialog, DialogContent, DialogTitle, List, ListItem, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { firestore } from '../../firebase-config';
import { UserContext } from '../../userProvider';

export type Song = {
    key: string
    title: string
    subtitle: string
    images: {
        coverart ?: string
        background ?: string
    }
    url: string
}

const min = (a: number, b: number) => {
    return a < b  ? a : b;
}

const renderSong = (song: Song) => {



    return (
        <div
            className='song'
            key={song.key}
        >
            <img 
                src={song.images.coverart ? song.images.coverart : song.images.background}
                alt={song.title}
                height={min(window.innerHeight, window.innerWidth)/4}
                width={min(window.innerHeight, window.innerWidth)/4}
                onClick={() => {
                    window.open(song.url);
                }}
            />
            <p className='song-title'>{song.title}</p>
            <p className='artist-title'>{song.subtitle}</p>
        </div>
    )
}

export type YTVideo = {
    title: string
    author_name: string
    thumbnail_url: string
    video_id: string
}

const createElementFromHTML = (
    videoId: string
) => {

    const videoWidth = (window.innerWidth < 1000 ? window.innerWidth / 1.3 : window.innerWidth / 4)

    const videoFrame = <iframe
    title={videoId}
    src={`https://www.youtube.com/embed/${videoId}?feature=oembed`} frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen/>;
    
    return (
        <div 
            key='1'
            style={{
                width: videoWidth,
                height: window.innerHeight / 4,
            }}
            className='iframe-container'

        >
            {videoFrame}
        </div>
    )
}

const renderYTVideo = (
    video: YTVideo, 
    isSearchResult: boolean | undefined,
    setSelectedVideo: React.Dispatch<React.SetStateAction<YTVideo | undefined>>,
    setAddingVideoToList:  React.Dispatch<React.SetStateAction<boolean>>
) => {

    let elems = [];

    if (video.video_id) {
        const elem = createElementFromHTML(video.video_id);
        elems.push(elem);
    } else {
        elems.push(
                <img 
                    key='1'
                    src={video.thumbnail_url}              
                    width={min(window.innerHeight, window.innerWidth)/2.5}
                    height={min(window.innerHeight, window.innerWidth)/4} 
                    alt={video.author_name}
                />);
        }
    
    elems.push(<p key = '2' className='song-title'>{video.title}</p>);

    if (isSearchResult) {
        elems.push(
            <IconButton key='3' onClick={() => {
                setSelectedVideo(video);
                setAddingVideoToList(true);
            }}>
                <AddIcon />
            </IconButton>
        )
    }

    elems.push(<a key='4' className='artist-title' href={'https://www.google.com'}>{video.author_name}</a>);


    return (
        <div
            className='ytvid'
            key={video.video_id}
        >   
        {elems}
        </div>
    )

}

interface MediaListProps {
    mediaListTitle: string
    mediaList: Array<Song | YTVideo>
    isSearchResult?: boolean
}


const MediaList: React.FC<MediaListProps> = ({
    mediaListTitle,
    mediaList,
    isSearchResult
}) => {

    const [selectedVideo, setSelectedVideo] = React.useState<YTVideo>();
    const [addingVideoToList, setAddingVideoToList] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);

    const { mediaLists } = React.useContext(UserContext);

    const addVideoToList = (list_title: string) => {
        if (!selectedVideo) return;
        setLoading(true);
        firestore.collection(list_title).doc(selectedVideo.video_id).set({
            video_id: selectedVideo.video_id,
            author_name: selectedVideo.author_name,
            thumbnail_url: selectedVideo.thumbnail_url,
            title: selectedVideo.title
        })
        .then(() => {
            setLoading(false);
            setAddingVideoToList(false);
        })
        .catch(err => console.log('err'))
    }

    return (
        <div
            className='song-list-container'
        >
            <div className='song-list-title'>
                <h3>    
                    {mediaListTitle}
                </h3>   
            </div>

            <div className='song-list'>
                {
                    mediaList.map(media => {
                        if ('subtitle' in media) {
                            return renderSong(media);
                        } else {
                            return renderYTVideo(media, isSearchResult, setSelectedVideo, setAddingVideoToList);
                        }

                    })
                }
            </div>
            <Dialog onClose={() => setAddingVideoToList(false)} open={addingVideoToList}>
            <DialogTitle>Choose list to add video to</DialogTitle>
            <List>
                {mediaLists.map((list) => (
                <ListItem button onClick={() => addVideoToList(list.list_title)} key={list.list_title}>
                    {list.list_title}
                </ListItem>
                ))}
            </List>
            {
                loading &&
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            }
            </Dialog>
        </div>
    )
}

export default MediaList;