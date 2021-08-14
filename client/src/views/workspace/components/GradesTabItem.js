import React from 'react';
import PropTypes from 'prop-types';
import {Typography, Card, CardMedia, Grid, Container, CardActions, Button, CardContent} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router';

const GradesTabItem = ({grades}) => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  const classes = useStyles();
  const history = useHistory()
  const location = useLocation()
  console.log(grades)

  return (
    <Container className={classes.cardGrid} maxWidth="md">
    {/* End hero unit */}
    <Grid container spacing={4}>

      {grades && grades.map((grade, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image="https://source.unsplash.com/random"
              title={grade.name}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {grade.name}
              </Typography>
              <Typography>
               {grade.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary"
                onClick={() => {
                  history.push(`/dashboard/workspace/grade?id=${grade._id}&workspaceId=${id}`)
                }}
              >
                View
              </Button>
              <Button size="small" color="primary">
                Edit
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
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
 
export default GradesTabItem;