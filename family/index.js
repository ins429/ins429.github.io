import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Family from './Family'
import Images from './Images'

const NotFound = () => <div>Not found</div>

const ErrorPage = () => <div>Something went wrong</div>

const FamilyApp = () => (
  <Router basename="/family">
    <Switch>
      <Route path="/" exact component={Family} />
      <Route
        path="/admin"
        exact
        component={props => <Family {...props} admin />}
      />
      <Route
        path="/admin/:folder"
        exact
        component={props => <Images {...props} admin />}
      />
      <Route path="/error" component={ErrorPage} />
      <Route path="/:folder" component={Images} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)

ReactDOM.render(<FamilyApp />, document.getElementById('root'))
