import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import Container from '@material-ui/core/Container'
import Footer from '../../components/Footer'
import CustomizedBreadcrumbs from '../../components/CustomizedBreadcrumbs'
import WorkspaceTabs from './WorkspaceTabs'

import { API_ENDPOINT, ACCESS_TOKEN } from '../../utils/helpers'

export default function ViewClass() {
  const classes = useStyles();
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  const history = useHistory()
  const location = useLocation()

  const [workspace, setWorkspace] = useState(null)
  const [loadingWorkspace, setLoadingWorkspace] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(async () => {
    if (id) {
      /* load Workspaces 
      -----------------------------------------------------*/
      let res = await fetch(`${API_ENDPOINT}workspace/get/${id}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const data = await res.json()
        setWorkspace(data)
        setLoadingWorkspace(false)
      }
      else {
        let { error } = await res.json()
        console.log(error)
        setLoadingWorkspace(false)
        if (error && error.message) setLoadError(error.message)
      }
    }
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <CustomizedBreadcrumbs />

      <div>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {loadingWorkspace && (
              <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>
            )}

            {!loadingWorkspace && workspace && (
              <div>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                  {workspace.name}
                </Typography>

                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  {workspace.description}
                </Typography>

                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <Button variant="contained" color="primary" 
                        onClick={() => history.push(`/dashboard/workspace/add-member?id=${workspace._id}`)}
                      >
                        Invite Members
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="outlined" color="primary" 
                        onClick={() => history.push(`/dashboard/workspace/add-grade?id=${workspace._id}`)}
                      >
                        Add Grades
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="contained" color="primary" 
                        onClick={() => history.push(`/dashboard/workspace/add-student?id=${workspace._id}`)}
                      >
                        Add Students
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <WorkspaceTabs workspace={workspace}/>
          </Grid>
        </Container>
      </div>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    marginTop: '24px'
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));