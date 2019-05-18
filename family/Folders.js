import React, { Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'

const Folders = ({ folders, handleFolderClick }) => (
  <Fragment>
    <NavBar title="Ethan Suyeon Lee - Folders" />
    <GridContainer>
      {folders.map(folder => (
        <Grid key={folder} item xs={4} md={3} lg={2}>
          <Chip
            icon={<FolderIcon />}
            label={folder}
            onClick={handleFolderClick(folder)}
            variant="outlined"
            color="primary"
            clickable
          />
        </Grid>
      ))}
    </GridContainer>
  </Fragment>
)

export default Folders
