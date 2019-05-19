import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import FolderFormDialog from './FolderFormDialog'
import { admin } from './utils'

const Folders = ({ folders }) => {
  const [openForm, setOpenForm] = useState(false)

  return (
    <Fragment>
      <NavBar title="Ethan Suyeon Lee - Folders">
        {admin && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenForm(true)}
            style={{ marginLeft: '10px' }}
          >
            New Folder
          </Button>
        )}
      </NavBar>
      <GridContainer>
        {folders.map(folder => (
          <Grid key={folder} item xs={4} md={3} lg={2}>
            <Link to={`/${folder}`}>
              <Chip
                icon={<FolderIcon />}
                label={folder}
                variant="outlined"
                color="primary"
                clickable
              />
            </Link>
          </Grid>
        ))}
      </GridContainer>
      <FolderFormDialog
        open={openForm}
        handleClose={() => setOpenForm(false)}
      />
    </Fragment>
  )
}

export default Folders
