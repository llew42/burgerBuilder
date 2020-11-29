import React, {useEffect, lazy, Suspense} from 'react'
import './App.css'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Layout from './hoc/Layout/Layout'
import {Route, Switch, Redirect, withRouter} from 'react-router-dom'
import Logout from './containers/Auth/Logout/Logout'
import {useDispatch, useSelector} from 'react-redux'
import * as actions from './store/actions/index'

const Checkout = lazy(() => import('./containers/Checkout/Checkout'))
const Orders = lazy(() => import('./containers/Orders/Orders'))
const Auth = lazy(() => import('./containers/Auth/Auth'))

function App() {
  const dispatch = useDispatch(actions.authStateCheck())
  useEffect(() => {
    dispatch(actions.authStateCheck())
  }, [dispatch])

  const isAuthenticated = useSelector(state => state.auth.token)

  let routes = (
    <Switch>
      <Route path="/" component={BurgerBuilder} exact />
      <Route path="/auth" render={props => <Auth {...props} />} />
      <Redirect to="/" />
    </Switch>
  )

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/orders" render={props => <Orders {...props} />} />
        <Route path="/checkout" render={props => <Checkout {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={props => <Auth {...props} />} />
        <Route path="/" component={BurgerBuilder} exact />
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </Layout>
  )
}

export default withRouter(App)
