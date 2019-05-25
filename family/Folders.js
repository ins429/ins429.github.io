import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import FolderFormDialog from './FolderFormDialog'

const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'

const Folders = ({ admin, folders, reload }) => {
  const [openForm, setOpenForm] = useState(false)

  return (
    <Fragment>
      <NavBar title="Ethan Suyeon Lee - Folders">
        {admin && (
          <IconButton
            color="primary"
            onClick={() => setOpenForm(true)}
            style={{ marginLeft: '10px' }}
          >
            <CreateNewFolderIcon />
          </IconButton>
        )}
      </NavBar>
      <GridContainer>
        {folders.sort().map(folder => (
          <Grid key={folder} item xs={12} md={3} lg={2}>
            <Link to={admin ? `/admin/${folder}` : `/${folder}`}>
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
        handleSubmit={(folderName, password) => {
          axios.post(mkdirUrl, { dir: folderName, password })
          reload()
        }}
      />
    </Fragment>
  )
}

export default Folders
