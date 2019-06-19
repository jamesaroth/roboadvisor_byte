import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
// import Dashboard from './components/Dashboard'
import Wizard from './components/Wizard'
import Cards from './components/Cards'
// import Main from './components/Main' 
import Signup from './components/Signup'
import ScrollToTop from './components/ScrollTop'
import Dashboard_update from './components/Dashboard_update';
import SingleStockDash from './components/SingleStockDash';


export default props => (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={ Dashboard_update } />
          <Route exact path='/dashboard' component={ SingleStockDash } />
          <Route exact path='/signup' component={ Signup } />
          <Route exact path='/wizard' component={ Wizard } />
          <Route exact path='/cards' component={ Cards } />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )