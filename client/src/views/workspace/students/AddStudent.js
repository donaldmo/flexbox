import React, { useState } from 'react';
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
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../../../components/Copyright'
import { ACCESS_TOKEN, API_ENDPOINT } from '../../../utils/helpers'

export default function SignInSide() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  const classes = useStyles();

  let initState = {
    email: '',
    firstName: '',
    lastName: ''
  }

  const [state, setState] = useState(initState)

  const [inputErrors, setInputErrors] = useState()
  const [resError, setResError] = useState('')
  const [resSuccess, setReSuccess] = useState(false)
  const [progress, setProgress] = useState(false)

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

    if (!validator.isEmail(state.email)) err.push('Invalid Email')
    if (!state.firstName) err.push('First Name is required!')
    if (!state.lastName) err.push('Last Name is required!')

    if (err.length) return setInputErrors(err)

    setProgress(true)

    let res = await fetch(`${API_ENDPOINT}workspace/add-student/${id}`, {
      method: 'POST',
      body: JSON.stringify({ ...state, id }),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      let data = await res.json()
      console.log(data)
      setReSuccess(res.ok)
      setProgress(false)
    }
    else {
      let { error } = await res.json()
      setProgress(false)
      console.log(err)
      if (error && error.message) setResError(error.message)
    }
  }
  console.log(state)

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LocalLibraryIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Student
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                  value={state.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={handleChange}
                  value={state.lastName}
                />
              </Grid>
            </Grid>
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
              onChange={handleChange}
              value={state.email}
            />

            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

            {inputErrors && inputErrors.map((err, i) => (
              <Alert key={i} style={{ marginTop: '16px' }} severity="error">
                {err}
              </Alert>
            ))}

            {resError && <Alert style={{ marginTop: '16px' }} severity="error">{resError}</Alert>}

            <Alert style={{ marginTop: '16px' }} severity="info">
              Password will be automatically generated for a student
            </Alert>

            {resSuccess && (
              <Alert severity="success" style={{ marginTop: '16px' }}>
                Student Added Successfuly
              </Alert>
            )}

            {!progress && !resSuccess && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Student
              </Button>
            )}

            {progress && <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>}

            {!progress && resSuccess && (
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
                onClick={e => {
                  e.preventDefault()
                  setState(initState)
                  setReSuccess(false)
                }}
              >
                Add Another One
              </Button>
            )}

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random/?student)',
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));