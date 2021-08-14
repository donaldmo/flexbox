import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        FlexBox classroom
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        
      </Typography>
   
      <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://flexiblebox.dev/">
        Flexible Box
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
    </footer>
  )
}

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
