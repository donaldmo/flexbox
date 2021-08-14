import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { createMuiTheme, ThemeProvider } from '@material-ui/core'

import ResponsiveDrawer from './components/ResponsiveDrawer'
import StickyFooter from './pages/StickyFooter'

import Pricing from './pages/Pricing'
import Album from './pages/Album'
import Dashboard from './pages/dashboard/Dashboard'
import Blog from './pages/blog/Blog'
import ClassRoom from './views/classroom/ClassRoom'

import SignUp from './views/auth/SignUp'
import SignInSide from './views/auth/SignInSide'

import Checkout from './pages/checkout/Checkout'
import ViewClass from './views/classroom/ViewClass'
import CreateClass from './views/classroom/create-class/CreateClass'
import WorkSpace from './views/workspace/Workspace'
import AddWorkspace from './views/workspace/add-workspace/AddWorkspace'
import AddWorkspaceMember from './views/workspace/add-workspace/AddWorkspaceMember'
import JoinWorkspace from './views/workspace/join-workspace/JoinWorkspace'

import AddGrade from './views/workspace/grades/AddGrade'
import ViewGrade from './views/workspace/grades/view-grade/ViewGrade'
import AddTeacher from './views/workspace/grades/AddTeacher'
import AddStudent from './views/workspace/students/AddStudent'

import CheckboxList from './pages/CheckboxList'
import StudentJoin from './views/workspace/students/StudentJoin'
import AddStudentToGrade from './views/workspace/grades/AddStudentToGrade'

const theme = createMuiTheme()

function App(props) {
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Switch>
            <Route exact path="/"><CheckboxList /></Route>
            
            <Route exact path="/live-class"><ResponsiveDrawer /></Route>
            <Route exact path="/pricing"><Pricing /></Route>
            <Route exact path="/album"><Album /></Route>

            <Route exact path="/blog"><Blog /></Route>
            <Route exact path="/checkout"><Checkout /></Route>

            <Route exact path="/register"><SignUp /></Route>
            <Route exact path="/login"><SignInSide /></Route>

            <Route exact path="/student-registration">
              <ClassRoom><Checkout/></ClassRoom>
            </Route>

            <Route exact path="/dashboard">
              <ClassRoom><ViewClass/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/add">
              <ClassRoom><AddWorkspace/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/add-member">
              <ClassRoom><AddWorkspaceMember/></ClassRoom>
            </Route>
            
            <Route exact path="/dashboard/workspace/add-student">
              <ClassRoom><AddStudent /></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/add-grade">
              <ClassRoom><AddGrade/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/join-workspace">
              <ClassRoom><JoinWorkspace/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/join-student">
              <ClassRoom><StudentJoin/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/grade">
              <ClassRoom><ViewGrade/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/grade/add-teacher">
              <ClassRoom><AddTeacher/></ClassRoom>
            </Route>

            <Route exact path="/dashboard/workspace/grade/add-student">
              <ClassRoom><AddStudentToGrade/></ClassRoom>
            </Route>

            <Route path="/dashboard/workspace">
              <ClassRoom><WorkSpace/></ClassRoom>
            </Route>
            
            <Route path="dashboard/add-grade">
              <ClassRoom><CreateClass/></ClassRoom>
            </Route>

            <Route path="dashboard/add-subject">
              <ClassRoom><CreateClass/></ClassRoom>
            </Route>

            <Route exact path="/edit-class">
              <ClassRoom><Album/></ClassRoom>
            </Route>

            <Route exact path="/view-class">
              <ClassRoom><Blog/></ClassRoom>
            </Route>

            <Route exact path="/create-class">
              <ClassRoom><AddWorkspace/></ClassRoom>
            </Route>
            
            <Route exact path="/sticky-footer"><StickyFooter /></Route>
            <Route exact path="/live-class"><ResponsiveDrawer /></Route>
          </Switch>

          {/* <BottomNavigation /> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;
