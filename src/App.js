import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import * as ROUTES from './components/constants/routes'
import GameWindow from './components/game/GameWindow'
import Home from './components/navigation/Home'
import DataDirectory from './components/data/DataDirectory'
import DataPage from './components/data/DataPage'
import NavBar from './components/navigation/NavBar'
import About from './components/navigation/About'
import DevPage from './components/dev/DevPage'
import CustomGame from './components/game/CustomGameWindow'
import ReferenceTrackingGame from './components/game/ReferenceTrackingGame';

const PrimaryRouter = () => (
  <div>
    <main>
      <Switch>
        <Route exact path = {ROUTES.HOME} component = {Home} />
        <Route path = {ROUTES.GAME} component = {GameWindow} />
        <Route path = {'/custom'} component = {CustomGame} />
        <Route exact path = {ROUTES.DATA_HOME} component = {DataDirectory} />
        <Route path = {ROUTES.DATA_PAGE} component = {DataPage} />
        <Route path = {ROUTES.ABOUT} component = {About} />
        <Route path = '/tracker' component = {ReferenceTrackingGame} />
        <Route path = '/dev' component = {DevPage} />
      </Switch>
    </main>
  </div>
)

const App = () => (
  <Router>
    <NavBar />
    <PrimaryRouter />
  </Router>
)

export default App;
