import React, {lazy} from 'react'
import classes from './Toolbar.css'
import Logo from '../../Logo/Logo'

const NavigationItems = lazy(() => import('../NavigationItems/NavigationItems'))
const DrawerToggle = lazy(() =>
  import('../SideDrawer/DrawerToggle/DrawerToggle')
)

const toolbar = props => (
  <header className={classes.Toolbar}>
    <DrawerToggle clicked={props.drawerClicked} />
    <div className={classes.Logo}>
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <NavigationItems isAuthenticated={props.isAuth} />
    </nav>
  </header>
)

export default toolbar
