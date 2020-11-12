import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import MiddlePage from './pages/MiddlePage';
import AddCandidate from './components/AddCandidate';
import history from './history';

class App extends React.Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={ MiddlePage } />
          <Route exact path="/candidates/new" component={ AddCandidate } />
        </Switch>
      </Router>
    );
  }
}

export default App;
