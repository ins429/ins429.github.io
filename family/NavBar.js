import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = {
  grow: {
    flexGrow: 1
  }
}

const NavBar = ({ title, children, classes }) => (
  <AppBar position="static" color="default">
    <Toolbar variant="dense">
      <Typography variant="subtitle2" color="inherit" className={classes.grow}>
        {title}
      </Typography>
      {children}
    </Toolbar>
  </AppBar>
)

export default withStyles(styles)(NavBar)
