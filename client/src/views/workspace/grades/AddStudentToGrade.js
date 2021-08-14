import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import Copyright from '../../../components/Copyright'
import { API_ENDPOINT, ACCESS_TOKEN } from '../../../utils/helpers'

export default function AddStudentToGrade() {
  const classes = useStyles();

  const urlParams = new URLSearchParams(window.location.search)
  const workspaceId = urlParams.get('workspaceId')
  const gradeId = urlParams.get('id')

  const [state, setState] = useState({ name: '', description: '' })
  const [inputErrors, setInputErrors] = useState()
  const [resError, setResError] = useState('')
  const [resSuccess, setReSuccess] = useState(false)
  const [progress, setProgress] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [students, setStudents] = useState(null)
  const [checked, setChecked] = React.useState([0]);

  useEffect(async () => {
    if (workspaceId) {
      /* load Workspaces Students 
       *-----------------------------------------------------*/
      let res = await fetch(`${API_ENDPOINT}workspace/grade/add-learner/${workspaceId}?gradeId=${gradeId}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)
        if (data.students) setStudents(data.students)
        setPageLoading(false)
      }
      else {
        let { error } = await res.json()
        console.log(error)
        setPageLoading(false)
        if (error && error.message) setResError(error.message)
      }
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    let { value, id } = e.target
    setState(prevState => ({ ...prevState, [id]: value }))
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResError('')
    setReSuccess(false)
    setInputErrors([]);
    let err = []
    const learners = []

    checked.map(i => learners.push(students[i]))

    if (!learners.length) err.push('Please select a student!')
    if (err.length) return

    setProgress(true)

    let res = await fetch(`${API_ENDPOINT}workspace/grade/add-learner/${workspaceId}`, {
      method: 'POST',
      body: JSON.stringify({ learners, gradeId: gradeId }),
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
            <List className={classes.list}>
              {students && students.map((student, value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                  <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                    <ListItemIcon>
                      <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={`https://material-ui.com/static/images/avatar/${value + 1}.jpg`}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={student.firstName + ' ' + student.lastName} />
                    <ListItemSecondaryAction>

                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

            {inputErrors && inputErrors.map((err, i) => (
              <Alert key={i} style={{ marginTop: '16px' }} severity="error">
                {err}
              </Alert>
            ))}

            {resError && <Alert style={{ marginTop: '16px' }} severity="error">{resError}</Alert>}

            {resSuccess && (
              <Alert severity="success" style={{ marginTop: '16px' }}>
                Successfuly Added
              </Alert>
            )}

            {!progress && students && (
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

            {students && progress && (
              <div style={{ textAlign: 'center', margin: '32px' }}>
                <CircularProgress />
              </div>
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));