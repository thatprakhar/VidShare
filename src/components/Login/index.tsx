import React, { useContext } from 'react';
import { 
    Container, 
    Grid, 
    TextField, 
    CssBaseline, 
    Avatar,
    FormControlLabel,
    Typography,
    Checkbox,
    Link,
    Button,
    Box,
    CircularProgress
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { Alert } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';

import { auth } from '../../firebase-config';
import { Redirect, useHistory } from 'react-router-dom';

import {UserContext} from '../../userProvider';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Prakhar Nahar
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));


const Login: React.FunctionComponent<{}> = () => {

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const history = useHistory();
    const user = useContext(UserContext);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const classes = useStyles();


    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
    
        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            setLoading(false);
            if (response.user === null) {
                setErrorMessage('An error occured! here');
                return;
            }
            console.log(user);
            history.push("/");
            window.location.reload(false);
        })
        .catch(error => {
          setLoading(false);
          setErrorMessage(error.message);
        })

    }

    if (user.user !== null) {
      return (
        <Redirect to='/home' />
      )
    }

    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Login
        </Typography>
        <form 
            className={classes.form}
            onSubmit={(e) => handleLogin(e)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {
        errorMessage !== '' &&
        <Box mt={8} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
            <Alert variant='danger' >{errorMessage}</Alert>
        </Box>
      }
      {
        loading && 
        <Box mt={8}>
          <CircularProgress />
        </Box>
      }
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    )
}

export default Login;