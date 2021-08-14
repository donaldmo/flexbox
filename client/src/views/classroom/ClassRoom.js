import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router';
import AppBar from '@material-ui/core/AppBar';

import { Avatar } from '@material-ui/core';

import { CssBaseline, Collapse } from '@material-ui/core/';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { HelpOutline as HelpOutlineIcon, Feedback as FeedbackIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons/';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ForumIcon from '@material-ui/icons/Forum';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import { NoteAdd as NoteAddIcon, ListAlt as ListAltIcon, GroupAdd as GroupAddIcon } from '@material-ui/icons';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';

import { ACCESS_TOKEN, API_ENDPOINT } from '../../utils/helpers';

const drawerWidth = 240;

function ClassRoom(props) {
  const history = useHistory()
  const location = useLocation()

  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const items2 = [
    {
      text: 'My Profile',
      icon: <AccountCircleIcon />,
      onClick: () => { }
    },
    {
      text: 'Verification',
      icon: <AccountCircleIcon />,
      onClick: () => { }
    },
    {
      text: 'Help',
      icon: <HelpOutlineIcon />,
      onClick: () => { }
    },
    {
      text: 'Feed Back',
      icon: <FeedbackIcon />,
      onClick: () => { }
    },
  ];



  const [workspaces, setWorkspaces] = useState([])
  const [progress, setProgress] = useState(true)
  const [resError, setResError] = useState(null)
  const [loadingWorkspace, setLoadingWorkspace] = useState(true)

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List dense
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            WORKSPACES
          </ListSubheader>
        }
      >
        <ListItem button onClick={() => history.push(`/dashboard/workspace/add`)}>
          <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Add Workspace" />
        </ListItem>

        {workspaces && workspaces.map((workspace) => {
          const labelId = `checkbox-list-secondary-label-${workspace._id}`;
          return (
            <div>
            <ListItem key={workspace._id} button 
              onClick={() => history.push(`/dashboard/workspace?id=${workspace._id}`)}>
              <ListItemAvatar>
                <Avatar alt={`workspance n°${workspace.name}`} src={workspace.name} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${workspace.name}`} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List dense component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemIcon><CheckBoxIcon /></ListItemIcon>
                  <ListItemText primary="Getting Started" />
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon><EmojiPeopleIcon /></ListItemIcon>
                  <ListItemText primary="Teachers" />
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon><FeedbackIcon /></ListItemIcon>
                  <ListItemText primary="Grades" />
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon><ForumIcon /></ListItemIcon>
                  <ListItemText primary="Channel" />
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon><NotificationsActiveIcon /></ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon><SettingsApplicationsIcon /></ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>

              </List>
            </Collapse>
            </div>
          );
        })}

      </List>

      <Divider />

      <List dense className={classes.teachers}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            MARKET PLACE
          </ListSubheader>
        }
      >
        <ListItem button>
          <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Create Course" />
        </ListItem>

        <ListItem button>
          <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
      </List>

      <Divider />

      <List>
        {items2.map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

    </div>
  );

  // const [open, setOpen] = React.useState(true);
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };
  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  useEffect(async () => {

    /* load Workspaces 
    -----------------------------------------------------*/
    let res = await fetch(`${API_ENDPOINT}workspace`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json()
      setWorkspaces(data)
      setLoadingWorkspace(false)
    }
    else {
      let { error } = await res.json()
      console.log(error)
      setLoadingWorkspace(false)
      if (error && error.message) setResError(error.message)
    }
  }, [])


  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap className={classes.title}>
            Flexbox Classroom
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Typography>Rebualefe</Typography>
          <Avatar className={classes.avatar} src='/donald-profile.jpg' />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        {props.children}
      </main>

    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  title: {
    flexGrow: 1,
  },

  avatar: {
    marginLeft: theme.spacing(2)
  },

  teachers: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  active: {
    background: '#f4f4f4'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

ClassRoom.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default withRouter(ClassRoom);