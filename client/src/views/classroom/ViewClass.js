import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import ClassCard from '../../components/ClassCard'
import Footer from '../../components/Footer'
import CustomizedBreadcrumbs from '../../components/CustomizedBreadcrumbs'


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const subjects = [
  {
    title: 'Social Sciences',
    details: 'Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force.',
    _id: '0',
    image: 'https://source.unsplash.com/random',
    createdBy: {
      name: 'Jane Doe',
      _id: 'auehehleh'
    },
    createdAt: '1739394747329',
    updatedAt: 'queeirueowehr',
    students: [],
    tasks: [
      {
        title: '',
        dueDate: '',
        attachments: [
          {
            type: 'DOCUMENT',
            url: '',
            name: ''
          },
          {
            type: 'YOUTUBE',
            url: '',
            name: ''
          },
        ]
      }
    ],
    assignments: [
      {
        title: '',
        dueDate: '',
        attachments: [
          {
            type: 'DOCUMENT',
            url: '',
            name: '',

          },
          {
            type: 'YOUTUBE',
            url: '',
            name: ''
          },
        ],
        submitions: [
          {
            _id: 'alkdjfeiernenenw',
            name: 'Joe Jonsons',
            createdAt: '21098374973984729',
            attachments: [

            ]
          }
        ],
        submitionType: 'upload || hand',
        marks: '100',
        rubrick: [

        ]
      }
    ],
    liveClass: [
      {
        _id: 'aldjenelwajaduohebnek',
        time: '',
        name: '',
        code: '',
        paticipants: [
          {
            name: '',
            _id: '3ianderiuhaldierhei'
          }
        ]
      }
    ]
  },
  {
    title: 'Mathematics',
    details: 'Mathematics includes the study of such topics as quantity (number theory), structure (algebra), space (geometry), and change (analysis).',
    _id: '1',
    image: 'https://source.unsplash.com/random',
    createdBy: {
      name: 'Jane Doe',
      _id: 'auehehleh'
    },
    createdAt: '1739394747329',
    updatedAt: 'queeirueowehr',
    students: [],
    tasks: [
      {
        title: '',
        dueDate: '',
        attachments: [
          {
            type: 'DOCUMENT',
            url: '',
            name: ''
          },
          {
            type: 'YOUTUBE',
            url: '',
            name: ''
          },
        ]
      }
    ],
    assignments: [
      {
        title: '',
        dueDate: '',
        attachments: [
          {
            type: 'DOCUMENT',
            url: '',
            name: '',

          },
          {
            type: 'YOUTUBE',
            url: '',
            name: ''
          },
        ],
        submitions: [
          {
            _id: 'alkdjfeiernenenw',
            name: 'Joe Jonsons',
            createdAt: '21098374973984729',
            attachments: [

            ]
          }
        ],
        submitionType: 'upload || hand',
        marks: '100',
        rubrick: [

        ]
      }
    ],
    liveClass: [
      {
        _id: 'aldjenelwajaduohebnek',
        time: '',
        name: '',
        code: '',
        paticipants: [
          {
            name: '',
            _id: '3ianderiuhaldierhei'
          }
        ]
      }
    ]
  }
]

export default function ViewClass() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <CustomizedBreadcrumbs />

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Class Room
            </Typography>

            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Something short and leading about the collection below—its contents, the creator, etc.
              Make it short and sweet, but not too short so folks don&apos;t simply skip over it
              entirely.
            </Typography>

            <div className={classes.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Create New Class
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Start Live Class
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>

            {subjects && subjects.map((subject) => (
              <ClassCard subject={subject} key={subject._id} />
            ))}

            {/* {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))} */}
          </Grid>
        </Container>
      </main>
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