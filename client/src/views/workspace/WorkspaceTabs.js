import React, { useEffect, setState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MembersTabItem from './components/MembersTabItem';
import GradesTabItem from './components/GradesTabItem'
import StudentList from './components/StudentList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function WorkspaceTabs(props) {
  const { workspace } = props
  const history = useHistory()
  const location = useLocation()

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Grades" {...a11yProps(1)} />
          <Tab label="Students" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        {workspace && workspace.members && (
          <MembersTabItem members={workspace.members} />
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {workspace && workspace.members && (
          <GradesTabItem grades={workspace.grades} />
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        {workspace && workspace.students && (
          <StudentList students={workspace.students} />
        )}
      </TabPanel>
    </div>
  );
}
