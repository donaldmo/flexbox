import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router';

import AppBar from '@material-ui/core/AppBar';
import { Avatar } from '@material-ui/core';

import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ChatIcon from '@material-ui/icons/Chat';
import PanToolIcon from '@material-ui/icons/PanTool';


import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import FolderSharedIcon from '@material-ui/icons/FolderShared';

import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import BottomNavigation from './BottomNavigation'
import { ClassRounded } from '@material-ui/icons';

const drawerWidth = 240;

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
  }
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const items = [
    {
      text: 'Home',
      icon: <HomeIcon />,
      click: () => history.push('/classroom')
    },
    {
      text: 'Invite People',
      icon: <PeopleAltIcon />,
      click: () => {}
    },
    {
      text: 'Start Recording',
      icon: <FiberManualRecordIcon />,
      click: () => {}
    },
    {
      text: 'Full Screen',
      icon: <FullscreenIcon />,
      click: () => {}
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      click: () => {}
    },
    {
      text: 'Raise Hand',
      icon: <PanToolIcon />,
      click: () => {}
    },
    {
      text: 'Share Screen',
      icon: <ScreenShareIcon />,
      click: () => {}
    },
    {
      text: 'Leave Meeting',
      icon: <PhoneDisabledIcon />,
      click: () => {}
    },
    {
      text: 'Share File',
      icon: <FolderSharedIcon />,
      click: () => {}
    },
    {
      text: 'White Board',
      icon: <BorderColorIcon />,
      click: () => {}
    },
    {
      text: 'Settings',
      icon: <SettingsApplicationsIcon />,
      click: () => {}
    },
  ]

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {items.map((item, index) => (
          <ListItem button key={index} onClick={() => item.click()}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />

    </div>
  );

  // const [open, setOpen] = React.useState(true);
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };
  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

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
            Live Class
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Typography>Rebualefe</Typography>
          <Avatar className={classes.avatar} src='/donald-profile.jpg'/>
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

        <BottomNavigation />
      </main>

    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;