import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { timestamp } from './utils'

const buildFolderUrl = dir => `https://ins429.dynu.net:60429/family/images`

const styles = {
  root: {
    borderBottom: `1px solid #ccc`,
    margin: 0,
    padding: '10px'
  },
  closeButton: {
    position: 'absolute',
    right: '3px',
    top: '3px'
  },
  fileInput: {
    display: 'none'
  }
}

const ImageFormDialog = ({ folder, open, handleClose, classes }) => {
  const [filename, setFilename] = useState('')
  const [folderName, setFolderName] = useState('')

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <form
        action={buildFolderUrl(folder)}
        method="POST"
        encType="multipart/form-data"
      >
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">New image</Typography>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            name="filename"
            label="Filename"
            value={filename}
            onChange={({ target: { value } }) => setFilename(value)}
            margin="normal"
            variant="outlined"
          />
          <input
            id="outlined-button-file"
            accept="image/*"
            type="file"
            name="file"
            onChange={({ target: { files } }) =>
              setFilename(`${timestamp()}-${files[0].name}`)
            }
            className={classes.fileInput}
          />
          <label htmlFor="outlined-button-file">
            <Button size="small" variant="outlined" component="span">
              {filename ? `${filename} or browse...` : 'Browse...'}
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" color="primary" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default withStyles(styles)(ImageFormDialog)
