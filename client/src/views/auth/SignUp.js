import React, { useState } from 'react';
import validator from 'validator';

import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Avatar } from '@material-ui/core/';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from '../../components/Copyright';

import { API_ENDPOINT } from '../../utils/helpers'

export default function SignUp() {
  const classes = useStyles();

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    allowExtraEmails: 'false'
  })

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

    if (!validator.isEmail(state.email)) err.push(
      'Invalid Email'
    )

    setProgress(true)

    let res = await fetch(`${API_ENDPOINT}auth/register`, {
      method: 'POST',
      body: JSON.stringify(state),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${''}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      let { accessToken } = await res.json()
      console.log(accessToken)
      if (accessToken) localStorage.setItem('flexbox_dev_token', accessToken);

      setReSuccess(res.ok)
      setProgress(false)
    }
    else {
      let { error } = await res.json()
      setProgress(false)
      if (error && error.message) setResError(error.message)
    }
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>

          {inputErrors && inputErrors.map((err, i) => (
            <Alert key={i} style={{ marginTop: '16px' }} severity="error">
              {err}
            </Alert>
          ))}

          {resError && <Alert style={{ marginTop: '16px' }} severity="error">{resError}</Alert>}

          {resSuccess && (
            <Alert severity="success" style={{ marginTop: '16px' }}>
              Registered successfuly! — check your email to confirm account.
            </Alert>
          )}

          {!progress ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit} onChange={handleSubmit}
            >
              Sign Up
            </Button>
          ) : (
            <div style={{ textAlign: 'center', margin: '32px'}}><CircularProgress /></div>
          )}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));