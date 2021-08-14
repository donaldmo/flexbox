import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../../../components/Copyright'
import { API_ENDPOINT, ACCESS_TOKEN } from '../../../utils/helpers'

export default function AddWorkspace() {
  const classes = useStyles();

  const [state, setState] = useState({ name: '', description: '' })
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

    if (!state.name) err.push('Invalid Workspace name')
    console.log(err)
    if (err.length) return
    setProgress(true)

    console.log(state)

    let res = await fetch(`${API_ENDPOINT}workspace/add`, {
      method: 'POST',
      body: JSON.stringify(state),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json()
      console.log(data)
      setReSuccess(res.ok)
      setProgress(false)
    }
    else {
      let { error } = await res.json()
      console.log(error)
      setProgress(false)
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
            <HomeWorkIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Let's build a Workspace
          </Typography>

          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Workspace name"
              name="name"
              autoComplete="name"
              autoFocus
              onChange={handleChange}
            />

            <TextField
              minRows="5"
              maxRows="5"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Workspace description"
              name="description"
              autoComplete="description"
              autoFocus
              onChange={handleChange}
            />

            {inputErrors && inputErrors.map((err, i) => (
              <Alert key={i} style={{ marginTop: '16px' }} severity="error">
                {err}
              </Alert>
            ))}

            {resError && <Alert style={{ marginTop: '16px' }} severity="error">{resError}</Alert>}

            {resSuccess && (
              <Alert severity="success" style={{ marginTop: '16px' }}>
                Successfuly Created
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
                Create
              </Button>
            ) : (
              <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>
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
    backgroundImage: 'url(https://source.unsplash.com/random)',
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