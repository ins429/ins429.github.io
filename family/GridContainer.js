import React from 'react'
import Grid from '@material-ui/core/Grid'

const GridContainer = ({ children }) => (
  <div style={{ margin: '10px' }}>
    <Grid container spacing={24}>
      {children}
    </Grid>
  </div>
)

export default GridContainer
