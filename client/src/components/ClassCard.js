import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory, useLocation } from 'react-router';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

import { red } from '@material-ui/core/colors';

import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function ClassCard(props) {
  const history = useHistory()
  const location = useLocation()

  const { subject } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  // Popper
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleExpandClick = () => setExpanded(!expanded);

  const renderPoper = (id) => (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Typography className={classes.typography}>Edit {id}</Typography>
      <Typography className={classes.typography}>Delete {id}</Typography>
      <Typography className={classes.typography}>Save as Draft{id}</Typography>
      <Typography className={classes.typography}>Archive {id}</Typography>
    </Popover>
  )

  if (subject) console.log(subject)

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.title}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {subject.title.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon onClick={e => handleClick(e)}/>
            {renderPoper(subject._id)}
          </IconButton>
        }
        title={subject.title}
        subheader="September 14, 2021"
        onClick={() => {history.push(`/view-class?id=${subject._id}`);}}
      />

      <CardMedia
        className={classes.media}
        image="https://material-ui.com/static/images/cards/paella.jpg"
        title={subject.title}
        onClick={() => {history.push(`/view-class?id=${subject._id}`);}}
      />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {subject.details}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Details:</Typography>
          <Typography paragraph>
            {subject.details}
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginLeft: '16px',
    marginRight: '16px'
  },
  title: { 
    cursor: 'pointer'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9,
    cursor: 'pointer'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  typography: {
    padding: theme.spacing(2),
  },
}));