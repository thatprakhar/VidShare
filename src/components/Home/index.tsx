import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';

import {UserContext} from '../../userProvider';

import './style.css';
import { Redirect } from 'react-router-dom';

const Home: React.FC<{}> = () => {

    const user = React.useContext(UserContext);

    if (user.user === null) {
        return (
            <Redirect to="/login" />
        )
    }

    return (
        <div
            className='home'
        >
            <Sidebar />
            <Main />
        </div>
    )
}

export default Home;