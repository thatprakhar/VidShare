import React from 'react';
import {IconButton} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { firestore } from '../../firebase-config';


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

const createElementFromHTML = (videoId: string) => {

    const htmlString = `\u003ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/${videoId}?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\u0022 allowfullscreen\u003e\u003c/iframe\u003e`;
    return (
        <div 
            key='1'
            dangerouslySetInnerHTML={{
                __html: htmlString
            }}
            style={{
                width: min(window.innerHeight, window.innerWidth)/2.5,
                height: min(window.innerHeight, window.innerWidth)/4
            }}
            className='iframe-container'
        >
        </div>
    )
}

const renderYTVideo = (video: YTVideo, isSearchResult: boolean | undefined) => {

    let elems = [];

    if (video.video_id) {
        elems.push(createElementFromHTML(video.video_id));
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
                firestore.collection('top picks').doc(video.video_id).set({
                    video_id: video.video_id,
                    author_name: video.author_name,
                    thumbnail_url: video.thumbnail_url,
                    title: video.title
                })
                .then(() => {
                    console.log('added');
                })
                .catch(err => console.log('err'))
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

interface SongListProps {
    mediaListTitle: string
    mediaList: Array<Song | YTVideo>
    isSearchResult?: boolean
}


const MediaList: React.FC<SongListProps> = ({
    mediaListTitle,
    mediaList,
    isSearchResult
}) => {

    React.useEffect(() => {

    }, []);

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
                            return renderYTVideo(media, isSearchResult);
                        }

                    })
                }
            </div>

        </div>
    )
}

export default MediaList;