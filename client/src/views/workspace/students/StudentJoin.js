import React, { useState, useEffect } from 'react';
import validator from 'validator';

import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../../../components/Copyright'
import { API_ENDPOINT } from '../../../utils/helpers'

export default function StudentJoin() {
  const classes = useStyles();
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const email = urlParams.get('email')
  const workspaceId = urlParams.get('workspaceId')

  const [state, setState] = useState({ password: '', })
  const [inputErrors, setInputErrors] = useState()
  const [resError, setResError] = useState('')
  const [resSuccess, setReSuccess] = useState(false)
  const [progress, setProgress] = useState(false)

  const [pageLoading, setPageLoading] = useState(true);
  const [userFound, setUserFound] = useState(null)

  useEffect(async () => {

    let res = await fetch(`${API_ENDPOINT}workspace/join-student?token=${token}&workspaceId=${workspaceId}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${''}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      let data = await res.json()
      console.log(data)
      if (data) setUserFound(data)
      setPageLoading(false)
    }
    else {
      let { error } = await res.json()
      setPageLoading(false)
      if (error && error.message) setResError(error.message)
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    let { value, id } = e.target
    setState(prevState => ({ ...prevState, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResError('')
    setReSuccess(false)
    setInputErrors([]);
    let err = []
    console.log(state)

    if (!userFound) err.push('User is required')
    if (!state.password) err.push('Password is Required')

    if (err.length) return setInputErrors(err)
    setProgress(true)

    let res = await fetch(`${API_ENDPOINT}workspace/join-student/${workspaceId}`, {
      method: 'POST',
      body: JSON.stringify({ ...userFound, newPassword: state.password }),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${''}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      let { accessToken } = await res.json()
      console.log(accessToken)
      setReSuccess(res.ok)
      setProgress(false)
      // setTimeout(() => window.location = '/dashboard/workspace', 2000)
    }
    else {
      let { error } = await res.json()
      setProgress(false)
      if (error && error.message) setResError(error.message)
    }
  }
console.log(userFound)
console.log(state)
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

        {pageLoading && (
          <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>
        )}

        {!pageLoading && (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Student Join Workspace
            </Typography>

            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid >
                {userFound && (
                  <>
                    <TextField
                      disabled
                      margin="normal"
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label={userFound.firstName}
                      autoFocus
                      onChange={handleChange}
                    />

                    <TextField
                      disabled
                      margin="normal"
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label={userFound.lastName}
                      name="lastName"
                      autoComplete="lname"
                      onChange={handleChange}
                    />

                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label={userFound.email}
                      name="email"
                      autoComplete="email"
                      autoFocus
                      onChange={handleChange}
                      disabled
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
                      onChange={handleChange}
                    />
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />

                    {inputErrors && inputErrors.map((err, i) => (
                      <div style={{ marginTop: '16px' }} >
                        <Alert key={i} severity="error">{err}</Alert>
                      </div>
                    ))}

                    {resError && userFound && (
                      <Alert style={{ marginTop: '16px' }} severity="error">{resError}</Alert>
                    )}

                    {resError && !userFound && (
                      <div style={{ marginTop: '16px' }}>
                        <Alert severity={resError === 'Not Found' ? 'warning' : 'error'}>
                          {resError !== 'Not Found' ? resError : 'Please fill this form to register and join a workspace'}
                        </Alert>
                      </div>
                    )}


                    {resSuccess && (
                      <Alert severity="success" style={{ marginTop: '16px' }}>
                        Joined in successfuly
                      </Alert>
                    )}

                    {!pageLoading && userFound && (
                      <Alert severity="info" style={{ marginTop: '16px' }}>
                        Please fill in your password to join a workspace
                      </Alert>
                    )}

                    {!progress ? (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Join Workspace
                      </Button>
                    ) : (
                      <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>
                    )}
                  </>
                )}
                <Box mt={5}>
                  <Copyright />
                </Box>
              </Grid>
            </form>
          </div>
        )}
      </Grid>
    </Grid>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random/?school)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
