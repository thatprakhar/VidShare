import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import { Backdrop, CircularProgress} from '@material-ui/core';
import {UserContext} from '../../userProvider';

import './style.css';
import { Redirect } from 'react-router-dom';



const Home: React.FC<{}> = () => {

    const user = React.useContext(UserContext);
    const [loading, setLoading] = React.useState<boolean>(false);

    if (user.user === null) {
        return (
            <Redirect to="/login" />
        )
    }

    return (
        <div
            className='home'
        >
            <Sidebar setLoading={setLoading}/>
            <Main setLoading={setLoading}/>
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