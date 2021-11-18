import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as Logo } from '../logo.svg';
import { loginUrl } from "../SpotifyLogin";

const useStyles = makeStyles({
    login: {
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        backgroundColor: 'black',

        '& img':{
            width: '50%'
        },

        '& a':{
            padding: '20px',
            borderRadius: '99px',
            backgroundColor: '#EE82EE',
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
        },

        '& a:hover':{
            backgroundColor:' white',
            borderColor: '#1db954',
            color: '#EE82EE',
        }
    },
});

function Landing() {
    const classes = useStyles()
    return (
        <div className={classes.login}>
            <img src={Logo} alt="Youdate Logo" />
            <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export default Landing