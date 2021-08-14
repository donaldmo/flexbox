import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Container from '@material-ui/core/Container';
import Footer from '../../../../components/Footer'
import CustomizedBreadcrumbs from '../../../../components/CustomizedBreadcrumbs'

import { API_ENDPOINT, ACCESS_TOKEN } from '../../../../utils/helpers'
import GradesTabs from './GradesTabs';

export default function ViewGrade() {
  const classes = useStyles();
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  const workspaceId = urlParams.get('workspaceId')

  const history = useHistory()
  const location = useLocation()

  const [pageLoading, setPageLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [grade, setGrade] = useState(null)

  useEffect(async () => {
    if (id) {
      /* load single grade
      -----------------------------------------------------*/
      let res = await fetch(`${API_ENDPOINT}workspace/grade/${id}?workspaceId=${workspaceId}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const data = await res.json()
        setGrade(data)
        setPageLoading(false)
      }
      else {
        let { error } = await res.json()
        console.log(error)
        setPageLoading(false)
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
            {pageLoading && (
              <div style={{ textAlign: 'center', margin: '32px' }}><CircularProgress /></div>
            )}

            {!pageLoading && grade && (
              <div>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                  {grade.name}
                </Typography>

                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  {grade.description}
                </Typography>

                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <Button variant="contained" color="primary"
                        onClick={() => {
                          history.push(`/dashboard/workspace/grade/add-teacher?id=${grade._id}&workspaceId=${workspaceId}`)
                        }
                        }
                      >
                        Add Teachers
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="outlined" color="primary"
                        onClick={() => {
                          history.push(`/dashboard/workspace/grade/add-subject?id=${grade._id}&workspaceId=${workspaceId}`)
                        }
                        }
                      >
                        Add Subjects
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="contained" color="primary"
                        onClick={() => history.push(`/dashboard/workspace/grade/add-student?id=${grade._id}&workspaceId=${workspaceId}`)}
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
            {grade && (
              <GradesTabs grade={grade} />
            )}
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