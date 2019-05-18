import React, { Fragment, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import TextField from '@material-ui/core/TextField'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import { admin } from './utils'

const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'

const Folders = ({ folders, handleFolderClick }) => {
  const [folderName, setFolderName] = useState('')

  return (
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

      {admin && (
        <form action={mkdirUrl} method="POST">
          <TextField
            label="dir"
            name="dir"
            value={folderName}
            onChange={({ target: { value } }) => setFolderName(value)}
            margin="normal"
            variant="outlined"
          />
          <Button size="small" variant="outlined" color="primary" type="submit">
            mkdir
          </Button>
        </form>
      )}
    </Fragment>
  )
}

export default Folders
