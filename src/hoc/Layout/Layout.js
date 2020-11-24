import React, {lazy, Suspense, useState} from 'react'
import Aux from '../Aux/Aux'
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import Spinner from '../../components/UI/Spinner/Spinner'
import {connect} from 'react-redux'

const SideDrawer = lazy(() =>
  import('../../components/Navigation/SideDrawer/SideDrawer')
)

function Layout(props) {
  const [showSideDrawer, setShowSideDrawer] = useState(false)

  const sideDrawerClosed = () => {
    setShowSideDrawer(false)
  }

  const sideDrawerToggle = () => {
    setShowSideDrawer(prevState => {
      return {showSideDrawer: !prevState.showSideDrawer}
    })
  }

  return (
    <Aux>
      <Suspense fallback={<Spinner />}>
        <Toolbar
          drawerClicked={sideDrawerToggle}
          isAuth={props.isAuthenticated}
        />
        <SideDrawer
          closed={sideDrawerClosed}
          open={showSideDrawer}
          isAuth={props.isAuthenticated}
        />
        <main className={classes.Content}>{props.children}</main>
      </Suspense>
    </Aux>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token,
  }
}

export default connect(mapStateToProps)(Layout)
