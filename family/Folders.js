import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import FolderFormDialog from './FolderFormDialog'
import { admin } from './utils'

const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'

const Folders = ({ folders, reload }) => {
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
        {folders.sort().map(folder => (
          <Grid key={folder} item xs={12} md={3} lg={2}>
            <Link to={`/${folder}?admin=${admin}`}>
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
        handleSubmit={folderName => {
          axios.post(mkdirUrl, { dir: folderName })
          reload()
        }}
      />
    </Fragment>
  )
}

export default Folders
