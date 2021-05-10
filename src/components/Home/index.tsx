import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import { Backdrop, CircularProgress} from '@material-ui/core';
import {mediaList, UserContext} from '../../userProvider';

import './style.css';
import { Redirect } from 'react-router-dom';



const Home: React.FC<{}> = () => {

    const user = React.useContext(UserContext);
    const [selectedMediaList, setSelectedMediaList] = React.useState<mediaList | null>(null);


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
            <Sidebar setLoading={setLoading} setSelectedMediaList={setSelectedMediaList}/>
            <Main setLoading={setLoading} selectedMediaList={selectedMediaList}/>
            <Backdrop open={loading} style={{
                zIndex: 99,
                color: '#fff',
            }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default Home;