import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/List';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

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

  const members = [
    {
      _id: "610fab8fe2e9d907d8067793",
      userName: "Donald Motswiri",
      userId: "610fa8bbd1b07c07a939370f"
    },
    {
      _id: "610fab8fe2e9d907d8067791",
      userName: "Member 2",
      userId: "610fa8bbd1b07c07a939370f"
    },
    {
      _id: "610fab8fe2e9d907d8067792",
      userName: "Member 3",
      userId: "610fa8bbd1b07c07a939370f"
    },
    {
      _id: "610fab8fe2e9d907d8067793",
      userName: "Member 4",
      userId: "610fa8bbd1b07c07a939370f"
    }
  ]

  const handleSubmit = () => {
    console.log(checked)
    const teachers = []

    checked.map((i) => teachers.push(members[i]))

    console.log(teachers)
  }

  return (
    <List className={classes.root}>
      {members && members.map((member, value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Avatar
                alt={`Avatar n°${value + 1}`}
                src={`https://material-ui.com/static/images/avatar/${value + 1}.jpg`}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={member.userName} />
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Create
      </Button>
    </List>
  );
}